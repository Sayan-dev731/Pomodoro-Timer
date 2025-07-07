import { Howl } from 'howler';

export class AudioService {
    private static instance: AudioService;
    private currentMusic: Howl | null = null;
    private tickSound: Howl | null = null;
    private notificationSounds: Map<string, Howl> = new Map();
    private volume = 0.5;
    private musicVolume = 0.3;

    private constructor() {
        this.initializeSounds();
    }

    public static getInstance(): AudioService {
        if (!AudioService.instance) {
            AudioService.instance = new AudioService();
        }
        return AudioService.instance;
    }

    private initializeSounds() {
        // Initialize notification sounds
        this.notificationSounds.set('session-complete', new Howl({
            src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsEUcHI8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFA=='],
            volume: this.volume,
        }));

        this.notificationSounds.set('break-complete', new Howl({
            src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsEUcHI8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFA=='],
            volume: this.volume,
        }));

        // Initialize tick sound
        this.tickSound = new Howl({
            src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsEUcHI8N2QQAoUXrTp66hVFApGn+LytGIcBjiQ2OvNeSsFJHfH8N2QQAoUXrTp66hVFA=='],
            volume: this.volume * 0.3,
        });
    }

    public playNotification(type: 'session-complete' | 'break-complete') {
        const sound = this.notificationSounds.get(type);
        if (sound) {
            sound.play();
        }
    }

    public playTickSound() {
        if (this.tickSound) {
            this.tickSound.play();
        }
    }

    public playMusic(category: 'nature' | 'ambient' | 'classical' | 'focus', _trackIndex = 0) {
        this.stopMusic();

        // Use generated audio for all categories
        this.playGeneratedMusic(category);
    }

    private playGeneratedMusic(category: string) {
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator1 = audioContext.createOscillator();
            const oscillator2 = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            const filter = audioContext.createBiquadFilter();

            // Configure based on category
            let freq1, freq2, filterFreq, waveType;
            switch (category) {
                case 'nature':
                    freq1 = 220; // A3
                    freq2 = 330; // E4
                    filterFreq = 800;
                    waveType = 'triangle';
                    break;
                case 'ambient':
                    freq1 = 110; // A2
                    freq2 = 165; // E3
                    filterFreq = 400;
                    waveType = 'sine';
                    break;
                case 'classical':
                    freq1 = 440; // A4
                    freq2 = 659; // E5
                    filterFreq = 1200;
                    waveType = 'sine';
                    break;
                case 'focus':
                    freq1 = 40; // Low frequency for focus
                    freq2 = 60;
                    filterFreq = 200;
                    waveType = 'sine';
                    break;
                default:
                    freq1 = 220;
                    freq2 = 330;
                    filterFreq = 800;
                    waveType = 'sine';
            }

            // Setup oscillators
            oscillator1.type = waveType as OscillatorType;
            oscillator2.type = waveType as OscillatorType;
            oscillator1.frequency.setValueAtTime(freq1, audioContext.currentTime);
            oscillator2.frequency.setValueAtTime(freq2, audioContext.currentTime);

            // Setup filter
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(filterFreq, audioContext.currentTime);

            // Connect nodes
            oscillator1.connect(filter);
            oscillator2.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Set volume
            gainNode.gain.setValueAtTime(this.musicVolume * 0.05, audioContext.currentTime);

            // Start oscillators
            oscillator1.start();
            oscillator2.start();

            // Store references for stopping
            (this as any).currentOscillators = [oscillator1, oscillator2];
            (this as any).currentAudioContext = audioContext;

        } catch (error) {
            console.warn('Failed to generate music:', error);
        }
    }

    public stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
        }

        // Stop generated audio
        if ((this as any).currentOscillators) {
            (this as any).currentOscillators.forEach((osc: OscillatorNode) => {
                try {
                    osc.stop();
                } catch (e) {
                    // Already stopped
                }
            });
            (this as any).currentOscillators = null;
        }

        if ((this as any).currentAudioContext) {
            try {
                (this as any).currentAudioContext.close();
            } catch (e) {
                // Already closed
            }
            (this as any).currentAudioContext = null;
        }
    }

    public pauseMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
        }
    }

    public resumeMusic() {
        if (this.currentMusic) {
            this.currentMusic.play();
        }
    }

    public setVolume(volume: number) {
        this.volume = Math.max(0, Math.min(1, volume));

        // Update all sound volumes
        this.notificationSounds.forEach(sound => {
            sound.volume(this.volume);
        });

        if (this.tickSound) {
            this.tickSound.volume(this.volume * 0.3);
        }
    }

    public setMusicVolume(volume: number) {
        this.musicVolume = Math.max(0, Math.min(1, volume));

        if (this.currentMusic) {
            this.currentMusic.volume(this.musicVolume);
        }
    }

    public getVolume(): number {
        return this.volume;
    }

    public getMusicVolume(): number {
        return this.musicVolume;
    }

    // Test if audio is supported
    public static isAudioSupported(): boolean {
        return !!(window.AudioContext || (window as any).webkitAudioContext || window.Audio);
    }
}
