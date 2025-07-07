import React from 'react';
import { motion } from 'framer-motion';

interface ProgressRingProps {
    progress: number;
    size: number;
    strokeWidth: number;
    color: string;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
    progress,
    size,
    strokeWidth,
    color
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg
                className="transform -rotate-90"
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
            >
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="drop-shadow-sm"
                />

                {/* Progress circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={`url(#gradient-${color.replace(/[^a-zA-Z0-9]/g, '')})`}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="drop-shadow-lg"
                    style={{
                        filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))',
                    }}
                />

                {/* Gradient definitions */}
                <defs>
                    <linearGradient id={`gradient-${color.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={color.includes('red') ? '#ef4444' : color.includes('green') ? '#10b981' : '#3b82f6'} />
                        <stop offset="100%" stopColor={color.includes('red') ? '#f97316' : color.includes('green') ? '#059669' : '#1d4ed8'} />
                    </linearGradient>
                </defs>
            </svg>

            {/* Glow effect */}
            <div
                className="absolute inset-0 rounded-full opacity-20 blur-xl"
                style={{
                    background: `conic-gradient(from 0deg, transparent ${(100 - progress) * 3.6}deg, ${color.includes('red') ? '#f97316' : color.includes('green') ? '#10b981' : '#3b82f6'
                        } ${progress * 3.6}deg)`,
                }}
            />
        </div>
    );
};

export default ProgressRing;
