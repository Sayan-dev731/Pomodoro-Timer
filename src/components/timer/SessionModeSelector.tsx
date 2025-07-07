import React from 'react';
import { motion } from 'framer-motion';
import { Target, Coffee } from 'lucide-react';
import type { TimerMode } from '../../types';

interface SessionModeSelectorProps {
    currentMode: TimerMode;
    onModeChange: (mode: TimerMode) => void;
    disabled?: boolean;
}

const SessionModeSelector: React.FC<SessionModeSelectorProps> = ({
    currentMode,
    onModeChange,
    disabled = false,
}) => {
    const modes = [
        {
            key: 'focus' as TimerMode,
            label: 'Focus',
            icon: Target,
            color: 'from-red-500 to-orange-500',
            bgColor: 'bg-red-500/20',
            textColor: 'text-red-400',
        },
        {
            key: 'shortBreak' as TimerMode,
            label: 'Short Break',
            icon: Coffee,
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-500/20',
            textColor: 'text-green-400',
        },
        {
            key: 'longBreak' as TimerMode,
            label: 'Long Break',
            icon: Coffee,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-500/20',
            textColor: 'text-blue-400',
        },
    ];

    return (
        <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1 backdrop-blur-sm">
            {modes.map((mode) => {
                const isActive = currentMode === mode.key;
                return (
                    <motion.button
                        key={mode.key}
                        whileHover={!disabled ? { scale: 1.02 } : {}}
                        whileTap={!disabled ? { scale: 0.98 } : {}}
                        onClick={() => !disabled && onModeChange(mode.key)}
                        disabled={disabled}
                        className={`relative flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${isActive
                                ? `bg-gradient-to-r ${mode.color} text-white shadow-lg`
                                : 'text-white/70 hover:text-white hover:bg-white/10'
                            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeMode"
                                className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-md"
                                initial={false}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                            />
                        )}

                        <mode.icon className={`h-4 w-4 relative z-10 ${isActive ? 'text-white' : mode.textColor}`} />
                        <span className="text-sm font-medium relative z-10">{mode.label}</span>
                    </motion.button>
                );
            })}
        </div>
    );
};

export default SessionModeSelector;
