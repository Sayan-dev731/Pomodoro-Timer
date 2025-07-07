import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SpotifyService } from '../../services/spotifyService';
import { useSpotify } from '../../contexts/SpotifyContext';
import type { SpotifyUserProfile } from '../../services/spotifyService';
import { ExternalLink, User, LogOut, Music } from 'lucide-react';

interface SpotifyAuthProps {
    onAuthChange: (isAuthenticated: boolean) => void;
}

const SpotifyAuth: React.FC<SpotifyAuthProps> = ({ onAuthChange }) => {
    const [spotifyService] = useState(() => SpotifyService.getInstance());
    const [userProfile, setUserProfile] = useState<SpotifyUserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated, setIsAuthenticated } = useSpotify();

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        const authenticated = spotifyService.isAuthenticated();
        setIsAuthenticated(authenticated);
        onAuthChange(authenticated);

        if (authenticated) {
            try {
                const profile = await spotifyService.getUserProfile();
                setUserProfile(profile);
            } catch (error) {
                console.error('Failed to get user profile:', error);
            }
        }
    };

    const handleLogin = () => {
        setIsLoading(true);
        const authUrl = spotifyService.getAuthUrl();
        window.location.href = authUrl;
    };

    const handleLogout = () => {
        spotifyService.logout();
        setIsAuthenticated(false);
        setUserProfile(null);
        onAuthChange(false);
    };

    if (isAuthenticated && userProfile) {
        return (
            <motion.div
                className="glass rounded-xl p-6 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            {userProfile.images && userProfile.images.length > 0 ? (
                                <img
                                    src={userProfile.images[0].url}
                                    alt={userProfile.display_name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <User className="h-6 w-6 text-green-400" />
                                </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
                        </div>

                        <div>
                            <h3 className="text-white font-semibold">{userProfile.display_name}</h3>
                            <p className="text-white/60 text-sm flex items-center gap-1">
                                <Music className="h-3 w-3" />
                                Connected to Spotify
                            </p>
                        </div>
                    </div>

                    <motion.button
                        onClick={handleLogout}
                        className="p-2 text-white/60 hover:text-red-400 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <LogOut className="h-5 w-5" />
                    </motion.button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="glass rounded-xl p-6 mb-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="mb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Music className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Connect Spotify</h3>
                <p className="text-white/60 text-sm mb-6">
                    Connect your Spotify account to control playback and see what's currently playing
                </p>
                <div className="text-xs text-white/40 mb-4">
                    <p>⭐ Spotify Premium required for full playback control</p>
                    <p>🎵 Free accounts can see currently playing tracks</p>
                </div>
            </div>

            <motion.button
                onClick={handleLogin}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                {isLoading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Connecting...
                    </>
                ) : (
                    <>
                        <ExternalLink className="h-4 w-4" />
                        Connect with Spotify
                    </>
                )}
            </motion.button>

            <div className="mt-4 text-xs text-white/40">
                <p>We'll redirect you to Spotify to authorize access</p>
            </div>
        </motion.div>
    );
};

export default SpotifyAuth;
