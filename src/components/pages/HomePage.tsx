import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Play,
    Pause,
    RotateCcw,
    CheckSquare,
    Timer,
    Target,
    Coffee,
    TrendingUp,
    Settings,
    Shuffle
} from 'lucide-react';
import { usePomodoroStore } from '../../stores/pomodoroStore';
import { formatTime, getGreeting } from '../../utils/helpers';
import QuoteDisplay from '../ui/QuoteDisplay';
import ClockDisplay from '../timer/ClockDisplay';

const HomePage: React.FC = () => {
    const {
        currentMode,
        timeRemaining,
        isRunning,
        stats,
        tasks,
        currentTask,
        settings,
        startTimer,
        pauseTimer,
        resetTimer,
        nextBackground,
    } = usePomodoroStore();

    useEffect(() => {
        // This effect can be used for periodic updates if needed
        const timer = setInterval(() => {
            // For future use
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const pendingTasks = tasks.filter(task => !task.completed);
    const completedToday = tasks.filter(task =>
        task.completed &&
        task.completedAt &&
        new Date(task.completedAt).toDateString() === new Date().toDateString()
    );

    const getModeDisplay = () => {
        switch (currentMode) {
            case 'focus':
                return { text: 'Focus Time', icon: Target, color: 'text-red-400' };
            case 'shortBreak':
                return { text: 'Short Break', icon: Coffee, color: 'text-green-400' };
            case 'longBreak':
                return { text: 'Long Break', icon: Coffee, color: 'text-blue-400' };
            default:
                return { text: 'Focus Time', icon: Target, color: 'text-red-400' };
        }
    };

    const mode = getModeDisplay();

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    className="mb-6 sm:mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                                {getGreeting()}
                            </h1>
                            <p className="text-white/70 text-base sm:text-lg">
                                Ready to focus and be productive?
                            </p>
                        </div>
                        <div className="hidden sm:block">
                            <ClockDisplay />
                        </div>
                    </div>
                </motion.div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {/* Timer Card */}
                    <motion.div
                        className="lg:col-span-2"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <div className="glass rounded-2xl p-4 sm:p-6 lg:p-8 text-center">
                            {/* Mode Indicator */}
                            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                                <mode.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${mode.color}`} />
                                <h2 className="text-xl sm:text-2xl font-bold text-white">{mode.text}</h2>
                            </div>

                            {/* Timer Display */}
                            <motion.div
                                className="mb-6 sm:mb-8"
                                animate={isRunning ? { scale: [1, 1.02, 1] } : {}}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                <div className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold font-jetbrains text-white mb-3 sm:mb-4">
                                    {formatTime(timeRemaining)}
                                </div>

                                {/* Progress Ring */}
                                <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6">
                                    <svg className="w-24 h-24 sm:w-32 sm:h-32 transform -rotate-90" viewBox="0 0 120 120">
                                        <circle
                                            cx="60"
                                            cy="60"
                                            r="50"
                                            stroke="rgba(255,255,255,0.1)"
                                            strokeWidth="8"
                                            fill="none"
                                        />
                                        <motion.circle
                                            cx="60"
                                            cy="60"
                                            r="50"
                                            stroke="url(#gradient)"
                                            strokeWidth="8"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeDasharray={`${2 * Math.PI * 50}`}
                                            strokeDashoffset={`${2 * Math.PI * 50 * (timeRemaining / (settings.focusDuration * 60))}`}
                                            transition={{ duration: 0.5 }}
                                        />
                                        <defs>
                                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#f97316" />
                                                <stop offset="100%" stopColor="#ef4444" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </motion.div>

                            {/* Controls */}
                            <div className="flex items-center justify-center gap-3 sm:gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={isRunning ? pauseTimer : startTimer}
                                    className="flex items-center gap-2 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold text-sm sm:text-base lg:text-lg hover:shadow-lg transition-shadow"
                                >
                                    {isRunning ? <Pause className="h-5 w-5 sm:h-6 sm:w-6" /> : <Play className="h-5 w-5 sm:h-6 sm:w-6" />}
                                    <span className="hidden sm:inline">{isRunning ? 'Pause' : 'Start'}</span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={resetTimer}
                                    className="p-3 sm:p-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                                >
                                    <RotateCcw className="h-5 w-5 sm:h-6 sm:w-6" />
                                </motion.button>
                            </div>

                            {/* Current Task */}
                            {currentTask && (
                                <motion.div
                                    className="mt-4 sm:mt-6 p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="flex items-center gap-2 text-white/70 mb-1">
                                        <Target className="h-4 w-4" />
                                        <span className="text-sm">Current Task</span>
                                    </div>
                                    <div className="text-white font-medium">{currentTask.title}</div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    {/* Stats & Quick Actions */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <motion.div
                            className="glass rounded-2xl p-6"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-green-400" />
                                Today's Progress
                            </h3>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-white/70">Pomodoros</span>
                                    <span className="text-2xl font-bold text-white">{stats.todayPomodoros}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-white/70">Tasks Done</span>
                                    <span className="text-2xl font-bold text-white">{completedToday.length}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-white/70">Focus Time</span>
                                    <span className="text-lg font-bold text-white">
                                        {Math.floor(stats.todayPomodoros * settings.focusDuration / 60)}h {(stats.todayPomodoros * settings.focusDuration) % 60}m
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            className="glass rounded-2xl p-6"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>

                            <div className="space-y-3">
                                <Link
                                    to="/timer"
                                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-white"
                                >
                                    <Timer className="h-5 w-5 text-orange-400" />
                                    <span>Full Timer</span>
                                </Link>

                                <Link
                                    to="/tasks"
                                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-white"
                                >
                                    <CheckSquare className="h-5 w-5 text-green-400" />
                                    <span>Manage Tasks</span>
                                </Link>

                                <Link
                                    to="/settings"
                                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-white"
                                >
                                    <Settings className="h-5 w-5 text-gray-400" />
                                    <span>Settings</span>
                                </Link>

                                <button
                                    onClick={nextBackground}
                                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-white w-full"
                                >
                                    <Shuffle className="h-5 w-5 text-purple-400" />
                                    <span>Change Background</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Tasks Preview */}
                <motion.div
                    className="glass rounded-2xl p-6 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <CheckSquare className="h-5 w-5 text-green-400" />
                            Pending Tasks ({pendingTasks.length})
                        </h3>
                        <Link
                            to="/tasks"
                            className="text-orange-400 hover:text-orange-300 transition-colors"
                        >
                            View All
                        </Link>
                    </div>

                    {pendingTasks.length === 0 ? (
                        <div className="text-center py-8 text-white/50">
                            <CheckSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No pending tasks. Great job!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {pendingTasks.slice(0, 6).map((task, index) => (
                                <motion.div
                                    key={task.id}
                                    className="p-4 bg-white/5 rounded-lg border border-white/10"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="text-white font-medium mb-1">{task.title}</h4>
                                            <p className="text-white/60 text-sm line-clamp-2">{task.description}</p>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-xs font-medium ${task.priority === 'high' ? 'bg-red-400/20 text-red-400' :
                                            task.priority === 'medium' ? 'bg-yellow-400/20 text-yellow-400' :
                                                'bg-green-400/20 text-green-400'
                                            }`}>
                                            {task.priority}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Quote Display */}
                <QuoteDisplay />
            </div>
        </div>
    );
};

export default HomePage;
