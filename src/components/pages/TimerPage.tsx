import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import {
    Volume2,
    VolumeX,
    Target,
    Coffee,
    Shuffle,
    Maximize,
    Minimize,
    Music
} from 'lucide-react';
import { usePomodoroStore } from '../../stores/pomodoroStore';
import { AudioService } from '../../services/audioService';
import { formatTime } from '../../utils/helpers';
import ProgressRing from '../timer/ProgressRing';
import SessionModeSelector from '../timer/SessionModeSelector';
import TaskSelector from '../timer/TaskSelector';
import TimerControls from '../timer/TimerControls';

const TimerPage: React.FC = () => {
    const {
        currentMode,
        timeRemaining,
        isRunning,
        settings,
        currentTask,
        startTimer,
        pauseTimer,
        resetTimer,
        switchMode,
        nextBackground,
    } = usePomodoroStore();

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [audioService] = useState(() => AudioService.getInstance());
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [ringSize, setRingSize] = useState(320);

    // Update ring size based on screen size
    useEffect(() => {
        const updateRingSize = () => {
            const maxSize = Math.min(320, window.innerWidth - 80, window.innerHeight - 300);
            setRingSize(Math.max(240, maxSize));
        };

        updateRingSize();
        window.addEventListener('resize', updateRingSize);
        return () => window.removeEventListener('resize', updateRingSize);
    }, []);

    // GSAP animations for timer
    useEffect(() => {
        if (isRunning) {
            gsap.to('.timer-display', {
                scale: 1.02,
                duration: 0.5,
                yoyo: true,
                repeat: -1,
                ease: 'power2.inOut'
            });
        } else {
            gsap.killTweensOf('.timer-display');
            gsap.set('.timer-display', { scale: 1 });
        }
    }, [isRunning]);

    // Breathing animation for focus mode
    useEffect(() => {
        if (currentMode === 'focus' && isRunning) {
            gsap.to('.breathing-circle', {
                scale: 1.1,
                duration: 4,
                yoyo: true,
                repeat: -1,
                ease: 'power2.inOut'
            });
        } else {
            gsap.killTweensOf('.breathing-circle');
            gsap.set('.breathing-circle', { scale: 1 });
        }
    }, [currentMode, isRunning]);

    // Play tick sound
    useEffect(() => {
        if (isRunning && settings.tickSoundEnabled && !isMuted) {
            const interval = setInterval(() => {
                audioService.playTickSound();
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isRunning, settings.tickSoundEnabled, isMuted, audioService]);

    // Session completion notifications
    useEffect(() => {
        if (timeRemaining === 0 && !isRunning) {
            if (settings.notificationsEnabled) {
                const message = currentMode === 'focus'
                    ? 'Focus session completed! Time for a break.'
                    : 'Break time is over! Ready to focus?';

                if (Notification.permission === 'granted') {
                    new Notification('Pomodoro Timer', { body: message });
                }
            }

            if (settings.soundEnabled && !isMuted) {
                audioService.playNotification(
                    currentMode === 'focus' ? 'session-complete' : 'break-complete'
                );
            }
        }
    }, [timeRemaining, isRunning, currentMode, settings, audioService, isMuted]);

    // Handle fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Auto-hide controls in fullscreen after inactivity
    useEffect(() => {
        if (!isFullscreen) return;

        let timeoutId: NodeJS.Timeout;
        const resetTimeout = () => {
            setShowControls(true);
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => setShowControls(false), 3000);
        };

        const handleMouseMove = () => resetTimeout();
        const handleKeyPress = () => resetTimeout();

        resetTimeout();
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('keydown', handleKeyPress);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [isFullscreen]);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (!isMuted) {
            audioService.setVolume(0);
        } else {
            audioService.setVolume(settings.volume / 100);
        }
    };

    const getModeConfig = () => {
        switch (currentMode) {
            case 'focus':
                return {
                    title: 'Focus Time',
                    icon: Target,
                    color: 'from-red-500 to-orange-500',
                    bgColor: 'bg-red-500/10',
                    textColor: 'text-red-400',
                };
            case 'shortBreak':
                return {
                    title: 'Short Break',
                    icon: Coffee,
                    color: 'from-green-500 to-emerald-500',
                    bgColor: 'bg-green-500/10',
                    textColor: 'text-green-400',
                };
            case 'longBreak':
                return {
                    title: 'Long Break',
                    icon: Coffee,
                    color: 'from-blue-500 to-cyan-500',
                    bgColor: 'bg-blue-500/10',
                    textColor: 'text-blue-400',
                };
            default:
                return {
                    title: 'Focus Time',
                    icon: Target,
                    color: 'from-red-500 to-orange-500',
                    bgColor: 'bg-red-500/10',
                    textColor: 'text-red-400',
                };
        }
    };

    const modeConfig = getModeConfig();
    const totalDuration = currentMode === 'focus'
        ? settings.focusDuration * 60
        : currentMode === 'shortBreak'
            ? settings.shortBreakDuration * 60
            : settings.longBreakDuration * 60;

    return (
        <div className={`min-h-screen relative ${isFullscreen ? '' : ''}`}>
            {/* Top Controls */}
            <AnimatePresence>
                {(!isFullscreen || showControls) && (
                    <motion.div
                        className="absolute top-6 left-6 right-6 z-40"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <div className="flex justify-between items-center">
                            <SessionModeSelector
                                currentMode={currentMode}
                                onModeChange={switchMode}
                                disabled={isRunning}
                            />

                            <div className="flex items-center gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={toggleMute}
                                    className="p-3 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors"
                                >
                                    {isMuted ? <VolumeX className="h-5 w-5 text-white" /> : <Volume2 className="h-5 w-5 text-white" />}
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={nextBackground}
                                    className="p-3 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors"
                                >
                                    <Shuffle className="h-5 w-5 text-white" />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={toggleFullscreen}
                                    className="p-3 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors"
                                >
                                    {isFullscreen ? <Minimize className="h-5 w-5 text-white" /> : <Maximize className="h-5 w-5 text-white" />}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Timer */}
            <div className="flex items-center justify-center min-h-screen p-4 sm:p-6">
                <div className="text-center max-w-2xl mx-auto w-full">
                    {/* Mode Header */}
                    <motion.div
                        className="mb-6 sm:mb-8"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className={`inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full ${modeConfig.bgColor} border border-white/20`}>
                            <modeConfig.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${modeConfig.textColor}`} />
                            <span className="text-white font-semibold text-base sm:text-lg">{modeConfig.title}</span>
                        </div>
                    </motion.div>

                    {/* Timer Display with Breathing Animation */}
                    <motion.div
                        className="relative mb-8 sm:mb-12"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: 'backOut' }}
                    >
                        {/* Breathing Circle for Focus Mode */}
                        {currentMode === 'focus' && (
                            <div className="breathing-circle absolute inset-0 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 blur-xl" />
                        )}

                        {/* Progress Ring */}
                        <ProgressRing
                            progress={(totalDuration - timeRemaining) / totalDuration * 100}
                            size={ringSize}
                            strokeWidth={8}
                            color={modeConfig.color}
                        />

                        {/* Timer Text */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                className="timer-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold font-jetbrains text-white text-center leading-none flex items-center justify-center"
                                style={{
                                    textShadow: '0 0 20px rgba(0,0,0,0.5)',
                                    width: '100%',
                                    height: '100%',
                                }}
                                animate={isRunning ? {
                                    textShadow: [
                                        '0 0 20px rgba(255,255,255,0.5)',
                                        '0 0 30px rgba(255,255,255,0.8)',
                                        '0 0 20px rgba(255,255,255,0.5)'
                                    ]
                                } : {}}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                {formatTime(timeRemaining)}
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Current Task Display */}
                    <AnimatePresence>
                        {currentTask && (!isFullscreen || showControls) && (
                            <motion.div
                                className="mb-6 sm:mb-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div className="glass rounded-2xl p-4 sm:p-6 max-w-md mx-auto">
                                    <div className="flex items-center gap-2 text-white/70 mb-2">
                                        <Target className="h-4 w-4" />
                                        <span className="text-sm font-medium">Current Task</span>
                                    </div>
                                    <h3 className="text-white text-base sm:text-lg font-semibold">{currentTask.title}</h3>
                                    {currentTask.description && (
                                        <p className="text-white/60 text-sm mt-1">{currentTask.description}</p>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Timer Controls */}
                    <TimerControls
                        isRunning={isRunning}
                        onStart={startTimer}
                        onPause={pauseTimer}
                        onReset={resetTimer}
                        gradient={modeConfig.color}
                    />

                    {/* Task Selector */}
                    <AnimatePresence>
                        {(!isFullscreen || showControls) && (
                            <motion.div
                                className="mt-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <TaskSelector />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Music Player Controls */}
            <AnimatePresence>
                {(!isFullscreen || showControls) && (
                    <motion.div
                        className="fixed bottom-6 right-6"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-4 bg-white/10 rounded-full backdrop-blur-sm hover:bg-white/20 transition-colors"
                            onClick={() => {/* Open music player */ }}
                        >
                            <Music className="h-6 w-6 text-white" />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TimerPage;
