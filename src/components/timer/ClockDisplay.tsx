import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const ClockDisplay: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString([], {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <motion.div
            className="text-right"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
        >
            <div className="flex items-center justify-end gap-3 mb-2">
                <Clock className="h-5 w-5 text-white/60" />
                <div className="text-3xl font-bold font-jetbrains text-white tick-animation">
                    {formatTime(currentTime)}
                </div>
            </div>
            <div className="text-white/60 text-sm">
                {formatDate(currentTime)}
            </div>
        </motion.div>
    );
};

export default ClockDisplay;
