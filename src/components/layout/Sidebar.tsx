import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import {
    Home,
    Timer,
    CheckSquare,
    BarChart3,
    FileText,
    Music,
    Settings,
    Coffee,
    Target,
    TrendingUp
} from 'lucide-react';
import { usePomodoroStore } from '../../stores/pomodoroStore';
import { formatTime } from '../../utils/helpers';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    currentTheme: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
    const {
        timeRemaining,
        currentMode,
        isRunning,
        stats,
        settings
    } = usePomodoroStore();

    const navItems = [
        { to: '/', icon: Home, label: 'Home', color: 'text-blue-400' },
        { to: '/timer', icon: Timer, label: 'Timer', color: 'text-orange-400' },
        { to: '/tasks', icon: CheckSquare, label: 'Tasks', color: 'text-green-400' },
        { to: '/stats', icon: BarChart3, label: 'Stats', color: 'text-purple-400' },
        { to: '/notes', icon: FileText, label: 'Notes', color: 'text-yellow-400' },
        { to: '/music', icon: Music, label: 'Music', color: 'text-pink-400' },
        { to: '/settings', icon: Settings, label: 'Settings', color: 'text-gray-400' },
    ];

    const getModeIcon = (mode: string) => {
        switch (mode) {
            case 'focus':
                return <Target className="h-4 w-4" />;
            case 'shortBreak':
                return <Coffee className="h-4 w-4" />;
            case 'longBreak':
                return <Coffee className="h-4 w-4" />;
            default:
                return <Timer className="h-4 w-4" />;
        }
    };

    const getModeColor = (mode: string) => {
        switch (mode) {
            case 'focus':
                return 'text-red-400 bg-red-400/10';
            case 'shortBreak':
                return 'text-green-400 bg-green-400/10';
            case 'longBreak':
                return 'text-blue-400 bg-blue-400/10';
            default:
                return 'text-gray-400 bg-gray-400/10';
        }
    };

    return (
        <motion.div
            className={`w-80 h-full ${settings.clearMode
                ? 'bg-black/90'
                : 'bg-white/5'
                } backdrop-blur-2xl border-r border-white/10 text-white`}
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{
                type: 'spring',
                damping: 25,
                stiffness: 200,
                opacity: { duration: 0.3 }
            }}
            style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
        >
            <div className="p-6">
                {/* Logo */}
                <motion.div
                    className="flex items-center gap-3 mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                        <Timer className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">Focus Flow</h1>
                        <p className="text-sm text-white/60">Pomodoro Timer</p>
                    </div>
                </motion.div>

                {/* Current Session Status */}
                {(isRunning || timeRemaining < (settings.focusDuration * 60)) && (
                    <motion.div
                        className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className={`flex items-center gap-2 px-2 py-1 rounded-lg ${getModeColor(currentMode)}`}>
                                {getModeIcon(currentMode)}
                                <span className="text-xs font-medium capitalize">
                                    {currentMode === 'shortBreak' ? 'Short Break' :
                                        currentMode === 'longBreak' ? 'Long Break' : 'Focus'}
                                </span>
                            </div>
                            {isRunning && (
                                <motion.div
                                    className="h-2 w-2 rounded-full bg-green-400"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            )}
                        </div>
                        <div className="text-2xl font-bold font-jetbrains">
                            {formatTime(timeRemaining)}
                        </div>
                        <div className="mt-2 w-full bg-white/10 rounded-full h-1">
                            <motion.div
                                className="h-1 rounded-full bg-gradient-to-r from-orange-400 to-red-500"
                                style={{
                                    width: `${((settings.focusDuration * 60 - timeRemaining) / (settings.focusDuration * 60)) * 100}%`
                                }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </motion.div>
                )}

                {/* Quick Stats */}
                <motion.div
                    className="mb-6 grid grid-cols-2 gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="h-4 w-4 text-green-400" />
                            <span className="text-xs text-white/60">Today</span>
                        </div>
                        <div className="text-lg font-bold">{stats.todayPomodoros}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2 mb-1">
                            <Target className="h-4 w-4 text-blue-400" />
                            <span className="text-xs text-white/60">Total</span>
                        </div>
                        <div className="text-lg font-bold">{stats.totalPomodoros}</div>
                    </div>
                </motion.div>

                {/* Navigation */}
                <nav className="space-y-1">
                    {navItems.map((item, index) => (
                        <motion.div
                            key={item.to}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.05 }}
                        >
                            <NavLink
                                to={item.to}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                        ? 'bg-white/15 text-white border border-white/20 shadow-lg'
                                        : 'text-white/70 hover:bg-white/10 hover:text-white hover:scale-105'
                                    }`
                                }
                            >
                                <motion.div
                                    whileHover={{ scale: 1.2, rotate: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                                >
                                    <item.icon className={`h-5 w-5 ${item.color} drop-shadow-lg`} />
                                </motion.div>
                                <motion.span
                                    className="font-medium"
                                    whileHover={{ x: 2 }}
                                    transition={{ type: 'spring', damping: 20, stiffness: 400 }}
                                >
                                    {item.label}
                                </motion.span>
                            </NavLink>
                        </motion.div>
                    ))}
                </nav>
            </div>
        </motion.div>
    );
};

export default Sidebar;
