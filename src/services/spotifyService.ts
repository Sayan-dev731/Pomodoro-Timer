interface SpotifyTrack {
    id: string;
    name: string;
    artists: Array<{ name: string }>;
    album: {
        name: string;
        images: Array<{ url: string; height: number; width: number }>;
    };
    duration_ms: number;
    preview_url: string | null;
}

interface SpotifyDevice {
    id: string;
    is_active: boolean;
    is_private_session: boolean;
    is_restricted: boolean;
    name: string;
    type: string;
    volume_percent: number;
}

interface SpotifyPlaybackState {
    device: SpotifyDevice;
    repeat_state: string;
    shuffle_state: boolean;
    context: {
        type: string;
        href: string;
        external_urls: { spotify: string };
        uri: string;
    } | null;
    timestamp: number;
    progress_ms: number;
    is_playing: boolean;
    item: SpotifyTrack | null;
    currently_playing_type: string;
    actions: {
        interrupting_playback?: boolean;
        pausing?: boolean;
        resuming?: boolean;
        seeking?: boolean;
        skipping_next?: boolean;
        skipping_prev?: boolean;
        toggling_repeat_context?: boolean;
        toggling_shuffle?: boolean;
        toggling_repeat_track?: boolean;
        transferring_playback?: boolean;
    };
}

interface SpotifyUserProfile {
    id: string;
    display_name: string;
    email: string;
    images: Array<{ url: string; height: number; width: number }>;
    followers: { total: number };
}

export class SpotifyService {
    private static instance: SpotifyService;
    private accessToken: string | null = null;
    private refreshToken: string | null = null;
    private tokenExpiry: number | null = null;
    private clientId: string;
    private clientSecret: string;
    private redirectUri: string;
    private apiBaseUrl: string;
    private accountsBaseUrl: string;
    private scopes = [
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-currently-playing',
        'user-read-private',
        'user-read-email',
        'streaming',
        'user-library-read',
        'user-library-modify',
        'playlist-read-private',
        'playlist-read-collaborative'
    ];

    private constructor() {
        this.clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID || '';
        this.clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || '';
        this.redirectUri = import.meta.env.VITE_SPOTIFY_CALLBACK_URL || 'http://localhost:5173/callback';

        // Use proxy URLs in development, direct URLs in production
        const isDevelopment = import.meta.env.DEV;
        this.apiBaseUrl = isDevelopment ? '/api/spotify' : 'https://api.spotify.com';
        this.accountsBaseUrl = isDevelopment ? '/api/spotify-accounts' : 'https://accounts.spotify.com';

        // Load stored tokens
        this.loadStoredTokens();
    }

    public static getInstance(): SpotifyService {
        if (!SpotifyService.instance) {
            SpotifyService.instance = new SpotifyService();
        }
        return SpotifyService.instance;
    }

    private loadStoredTokens() {
        const stored = localStorage.getItem('spotify_tokens');
        if (stored) {
            try {
                const tokens = JSON.parse(stored);
                this.accessToken = tokens.accessToken;
                this.refreshToken = tokens.refreshToken;
                this.tokenExpiry = tokens.tokenExpiry;
            } catch (error) {
                console.error('Failed to load stored Spotify tokens:', error);
                this.clearTokens();
            }
        }
    }

    private saveTokens() {
        if (this.accessToken && this.refreshToken && this.tokenExpiry) {
            localStorage.setItem('spotify_tokens', JSON.stringify({
                accessToken: this.accessToken,
                refreshToken: this.refreshToken,
                tokenExpiry: this.tokenExpiry
            }));
        }
    }

    private clearTokens() {
        this.accessToken = null;
        this.refreshToken = null;
        this.tokenExpiry = null;
        localStorage.removeItem('spotify_tokens');
    }

    public getAuthUrl(): string {
        const state = this.generateRandomString(16);
        localStorage.setItem('spotify_auth_state', state);

        const params = new URLSearchParams({
            response_type: 'code',
            client_id: this.clientId,
            scope: this.scopes.join(' '),
            redirect_uri: this.redirectUri,
            state: state,
            show_dialog: 'true'
        });

        return `https://accounts.spotify.com/authorize?${params.toString()}`;
    }

    public async handleCallback(code: string, state: string): Promise<boolean> {
        const storedState = localStorage.getItem('spotify_auth_state');
        if (state !== storedState) {
            throw new Error('State mismatch');
        }

        try {
            const response = await fetch(`${this.accountsBaseUrl}/api/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: this.redirectUri
                })
            });

            if (!response.ok) {
                throw new Error('Token exchange failed');
            }

            const data = await response.json();
            this.accessToken = data.access_token;
            this.refreshToken = data.refresh_token;
            this.tokenExpiry = Date.now() + (data.expires_in * 1000);

            this.saveTokens();
            localStorage.removeItem('spotify_auth_state');

            return true;
        } catch (error) {
            console.error('Failed to handle Spotify callback:', error);
            return false;
        }
    }

    private async refreshAccessToken(): Promise<boolean> {
        if (!this.refreshToken) {
            return false;
        }

        try {
            const response = await fetch(`${this.accountsBaseUrl}/api/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`
                },
                body: new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: this.refreshToken
                })
            });

            if (!response.ok) {
                throw new Error('Token refresh failed');
            }

            const data = await response.json();
            this.accessToken = data.access_token;
            if (data.refresh_token) {
                this.refreshToken = data.refresh_token;
            }
            this.tokenExpiry = Date.now() + (data.expires_in * 1000);

            this.saveTokens();
            return true;
        } catch (error) {
            console.error('Failed to refresh Spotify token:', error);
            this.clearTokens();
            return false;
        }
    }

    private async ensureValidToken(): Promise<boolean> {
        if (!this.accessToken) {
            return false;
        }

        if (this.tokenExpiry && Date.now() >= this.tokenExpiry - 60000) { // Refresh 1 minute before expiry
            return await this.refreshAccessToken();
        }

        return true;
    }

    private async makeApiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        if (!await this.ensureValidToken()) {
            throw new Error('No valid Spotify token');
        }

        const response = await fetch(`${this.apiBaseUrl}/v1${endpoint}`, {
            ...options,
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        if (response.status === 401) {
            // Token might be invalid, try to refresh
            if (await this.refreshAccessToken()) {
                // Retry the request with new token
                return this.makeApiCall(endpoint, options);
            }
            throw new Error('Spotify authentication failed');
        }

        if (!response.ok) {
            throw new Error(`Spotify API error: ${response.status}`);
        }

        return response.json();
    }

    public async getCurrentPlayback(): Promise<SpotifyPlaybackState | null> {
        try {
            return await this.makeApiCall<SpotifyPlaybackState>('/me/player');
        } catch (error) {
            console.error('Failed to get current playback:', error);
            return null;
        }
    }

    public async getUserProfile(): Promise<SpotifyUserProfile | null> {
        try {
            return await this.makeApiCall<SpotifyUserProfile>('/me');
        } catch (error) {
            console.error('Failed to get user profile:', error);
            return null;
        }
    }

    public async play(deviceId?: string): Promise<boolean> {
        try {
            const endpoint = deviceId ? `/me/player/play?device_id=${deviceId}` : '/me/player/play';
            await this.makeApiCall(endpoint, { method: 'PUT' });
            return true;
        } catch (error) {
            console.error('Failed to play:', error);
            return false;
        }
    }

    public async pause(deviceId?: string): Promise<boolean> {
        try {
            const endpoint = deviceId ? `/me/player/pause?device_id=${deviceId}` : '/me/player/pause';
            await this.makeApiCall(endpoint, { method: 'PUT' });
            return true;
        } catch (error) {
            console.error('Failed to pause:', error);
            return false;
        }
    }

    public async skipToNext(deviceId?: string): Promise<boolean> {
        try {
            const endpoint = deviceId ? `/me/player/next?device_id=${deviceId}` : '/me/player/next';
            await this.makeApiCall(endpoint, { method: 'POST' });
            return true;
        } catch (error) {
            console.error('Failed to skip to next:', error);
            return false;
        }
    }

    public async skipToPrevious(deviceId?: string): Promise<boolean> {
        try {
            const endpoint = deviceId ? `/me/player/previous?device_id=${deviceId}` : '/me/player/previous';
            await this.makeApiCall(endpoint, { method: 'POST' });
            return true;
        } catch (error) {
            console.error('Failed to skip to previous:', error);
            return false;
        }
    }

    public async setVolume(volume: number, deviceId?: string): Promise<boolean> {
        try {
            const params = new URLSearchParams({ volume_percent: Math.round(volume).toString() });
            if (deviceId) {
                params.append('device_id', deviceId);
            }
            await this.makeApiCall(`/me/player/volume?${params.toString()}`, { method: 'PUT' });
            return true;
        } catch (error) {
            console.error('Failed to set volume:', error);
            return false;
        }
    }

    public async seek(positionMs: number, deviceId?: string): Promise<boolean> {
        try {
            const params = new URLSearchParams({ position_ms: positionMs.toString() });
            if (deviceId) {
                params.append('device_id', deviceId);
            }
            await this.makeApiCall(`/me/player/seek?${params.toString()}`, { method: 'PUT' });
            return true;
        } catch (error) {
            console.error('Failed to seek:', error);
            return false;
        }
    }

    public isAuthenticated(): boolean {
        return !!this.accessToken && !!this.tokenExpiry && Date.now() < this.tokenExpiry;
    }

    public logout(): void {
        this.clearTokens();
    }

    private generateRandomString(length: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
}

export type { SpotifyTrack, SpotifyDevice, SpotifyPlaybackState, SpotifyUserProfile };
