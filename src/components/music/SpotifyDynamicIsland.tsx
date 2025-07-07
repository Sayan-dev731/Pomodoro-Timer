import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpotifyService } from '../../services/spotifyService';
import type { SpotifyPlaybackState } from '../../services/spotifyService';
import { Play, Pause, SkipForward, SkipBack, Volume2, Minimize2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface SpotifyDynamicIslandProps {
    isVisible: boolean;
}

const SpotifyDynamicIsland: React.FC<SpotifyDynamicIslandProps> = ({
    isVisible
}) => {
    const [spotifyService] = useState(() => SpotifyService.getInstance());
    const [playbackState, setPlaybackState] = useState<SpotifyPlaybackState | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [lastTrackId, setLastTrackId] = useState<string | null>(null);

    useEffect(() => {
        if (!isVisible) return;

        const updatePlaybackState = async () => {
            try {
                const state = await spotifyService.getCurrentPlayback();

                // Show toast notification when a new track starts
                if (state?.item && state.item.id !== lastTrackId && lastTrackId !== null) {
                    toast(`🎵 Now playing: ${state.item.name}`, {
                        duration: 3000,
                        position: 'top-center',
                        style: {
                            background: 'rgba(0, 0, 0, 0.9)',
                            color: '#fff',
                            borderRadius: '25px',
                            marginTop: '80px', // Position below the Dynamic Island
                        },
                    });
                }

                setPlaybackState(state);
                if (state?.item) {
                    setLastTrackId(state.item.id);
                }
            } catch (error) {
                console.error('Failed to get playback state:', error);
            }
        };

        // Initial fetch
        updatePlaybackState();

        // Update every 5 seconds
        const interval = setInterval(updatePlaybackState, 5000);

        return () => clearInterval(interval);
    }, [isVisible, spotifyService]);

    const handlePlayPause = async () => {
        if (!playbackState) return;

        setIsLoading(true);
        try {
            if (playbackState.is_playing) {
                await spotifyService.pause(playbackState.device.id);
            } else {
                await spotifyService.play(playbackState.device.id);
            }

            // Update state immediately for better UX
            setTimeout(async () => {
                const newState = await spotifyService.getCurrentPlayback();
                setPlaybackState(newState);
                setIsLoading(false);
            }, 500);
        } catch (error) {
            console.error('Failed to toggle playback:', error);
            setIsLoading(false);
        }
    };

    const handleSkipNext = async () => {
        if (!playbackState) return;

        setIsLoading(true);
        try {
            await spotifyService.skipToNext(playbackState.device.id);
            setTimeout(async () => {
                const newState = await spotifyService.getCurrentPlayback();
                setPlaybackState(newState);
                setIsLoading(false);
            }, 1000);
        } catch (error) {
            console.error('Failed to skip next:', error);
            setIsLoading(false);
        }
    };

    const handleSkipPrevious = async () => {
        if (!playbackState) return;

        setIsLoading(true);
        try {
            await spotifyService.skipToPrevious(playbackState.device.id);
            setTimeout(async () => {
                const newState = await spotifyService.getCurrentPlayback();
                setPlaybackState(newState);
                setIsLoading(false);
            }, 1000);
        } catch (error) {
            console.error('Failed to skip previous:', error);
            setIsLoading(false);
        }
    };

    const formatTime = (ms: number): string => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const getProgressPercentage = (): number => {
        if (!playbackState?.item || !playbackState.progress_ms) return 0;
        return (playbackState.progress_ms / playbackState.item.duration_ms) * 100;
    };

    if (!isVisible || !playbackState?.item) {
        return null;
    }

    const track = playbackState.item;
    const albumImage = track.album.images[0]?.url;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
                initial={{ opacity: 0, y: -100, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -100, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <motion.div
                    className="bg-black/90 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl overflow-hidden"
                    animate={{
                        width: isExpanded ? "400px" : "280px",
                        height: isExpanded ? "120px" : "60px"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    {/* Compact View */}
                    <AnimatePresence>
                        {!isExpanded && (
                            <motion.div
                                className="flex items-center gap-3 p-3 cursor-pointer"
                                onClick={() => setIsExpanded(true)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {albumImage && (
                                    <motion.img
                                        src={albumImage}
                                        alt={track.album.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                        animate={playbackState.is_playing ? { rotate: 360 } : {}}
                                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    />
                                )}

                                <div className="flex-1 min-w-0">
                                    <div className="text-white text-sm font-medium truncate">
                                        {track.name}
                                    </div>
                                    <div className="text-white/60 text-xs truncate">
                                        {track.artists.map(artist => artist.name).join(', ')}
                                    </div>
                                </div>

                                <motion.button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePlayPause();
                                    }}
                                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : playbackState.is_playing ? (
                                        <Pause className="h-4 w-4 text-white" />
                                    ) : (
                                        <Play className="h-4 w-4 text-white ml-0.5" />
                                    )}
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Expanded View */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                className="p-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        {albumImage && (
                                            <motion.img
                                                src={albumImage}
                                                alt={track.album.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                                animate={playbackState.is_playing ? { rotate: 360 } : {}}
                                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                            />
                                        )}

                                        <div className="min-w-0">
                                            <div className="text-white font-medium text-sm truncate max-w-48">
                                                {track.name}
                                            </div>
                                            <div className="text-white/60 text-xs truncate max-w-48">
                                                {track.artists.map(artist => artist.name).join(', ')}
                                            </div>
                                            <div className="text-white/40 text-xs truncate max-w-48">
                                                {track.album.name}
                                            </div>
                                        </div>
                                    </div>

                                    <motion.button
                                        onClick={() => setIsExpanded(false)}
                                        className="p-1 text-white/60 hover:text-white transition-colors"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Minimize2 className="h-4 w-4" />
                                    </motion.button>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-3">
                                    <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                                        <span>{formatTime(playbackState.progress_ms || 0)}</span>
                                        <span>{formatTime(track.duration_ms)}</span>
                                    </div>
                                    <div className="w-full bg-white/20 rounded-full h-1">
                                        <motion.div
                                            className="bg-green-500 h-1 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${getProgressPercentage()}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex items-center justify-center gap-4">
                                    <motion.button
                                        onClick={handleSkipPrevious}
                                        className="p-2 text-white/60 hover:text-white transition-colors"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        disabled={isLoading}
                                    >
                                        <SkipBack className="h-4 w-4" />
                                    </motion.button>

                                    <motion.button
                                        onClick={handlePlayPause}
                                        className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : playbackState.is_playing ? (
                                            <Pause className="h-5 w-5 text-white" />
                                        ) : (
                                            <Play className="h-5 w-5 text-white ml-0.5" />
                                        )}
                                    </motion.button>

                                    <motion.button
                                        onClick={handleSkipNext}
                                        className="p-2 text-white/60 hover:text-white transition-colors"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        disabled={isLoading}
                                    >
                                        <SkipForward className="h-4 w-4" />
                                    </motion.button>

                                    <div className="flex items-center gap-2 ml-2">
                                        <Volume2 className="h-4 w-4 text-white/60" />
                                        <div className="text-white/60 text-xs">
                                            {playbackState.device.volume_percent}%
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SpotifyDynamicIsland;
