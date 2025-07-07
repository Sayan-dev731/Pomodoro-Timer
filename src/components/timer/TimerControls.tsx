import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimerControlsProps {
    isRunning: boolean;
    onStart: () => void;
    onPause: () => void;
    onReset: () => void;
    gradient: string;
}

const TimerControls: React.FC<TimerControlsProps> = ({
    isRunning,
    onStart,
    onPause,
    onReset,
    gradient,
}) => {
    return (
        <div className="flex items-center justify-center gap-6">
            {/* Main Play/Pause Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isRunning ? onPause : onStart}
                className={`flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${gradient} text-white font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300`}
                style={{
                    boxShadow: `0 0 30px ${gradient.includes('red') ? 'rgba(239, 68, 68, 0.4)' : gradient.includes('green') ? 'rgba(16, 185, 129, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`,
                }}
            >
                <motion.div
                    initial={false}
                    animate={{ rotate: isRunning ? 0 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {isRunning ? (
                        <Pause className="h-8 w-8" />
                    ) : (
                        <Play className="h-8 w-8 ml-1" />
                    )}
                </motion.div>
            </motion.button>

            {/* Reset Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onReset}
                className="flex items-center justify-center w-14 h-14 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/20"
            >
                <RotateCcw className="h-6 w-6" />
            </motion.button>
        </div>
    );
};

export default TimerControls;
