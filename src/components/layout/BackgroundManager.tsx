import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BackgroundManagerProps {
    backgroundImage?: string;
    backgroundType?: 'static' | 'animated';
    theme: string;
    clearMode: boolean;
    backgroundEnabled: boolean;
    isFullscreen?: boolean;
}

const BackgroundManager: React.FC<BackgroundManagerProps> = ({
    backgroundImage,
    backgroundType = 'static',
    theme,
    clearMode,
    backgroundEnabled,
    isFullscreen = false,
}) => {
    const [currentImage, setCurrentImage] = useState<string | undefined>(backgroundImage);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        if (backgroundImage && backgroundImage !== currentImage) {
            setImageLoaded(false);
            // Preload the new image
            const img = new Image();
            img.onload = () => {
                setCurrentImage(backgroundImage);
                setImageLoaded(true);
            };
            img.src = backgroundImage;
        } else if (!backgroundImage) {
            setCurrentImage(undefined);
            setImageLoaded(false);
        }
    }, [backgroundImage, currentImage]);

    const getThemeGradient = (themeType: string) => {
        switch (themeType) {
            case 'focus':
                return 'from-blue-900/20 via-indigo-900/15 to-purple-900/20';
            case 'ambient':
                return 'from-purple-900/20 via-pink-900/15 to-indigo-900/20';
            default:
                return 'from-orange-900/20 via-red-900/15 to-pink-900/20';
        }
    };

    if (clearMode) {
        return (
            <div className="fixed inset-0 bg-black">
                {!isFullscreen && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-black/20" />
                )}
            </div>
        );
    }

    return (
        <div className="fixed inset-0">
            {/* Base gradient background - only when no image or as fallback */}
            <div className={`absolute inset-0 ${isFullscreen && !clearMode
                ? 'bg-black/40' // Less black overlay in fullscreen mode for better image visibility
                : isFullscreen
                    ? 'bg-black' // Full black in fullscreen + clear mode
                    : `bg-gradient-to-br ${getThemeGradient(theme)}`
                }`} />

            {/* Background image with conditional overlay */}
            <AnimatePresence mode="wait">
                {backgroundEnabled && currentImage && imageLoaded && (!clearMode || !isFullscreen) && (
                    <motion.div
                        key={currentImage}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 1.5, ease: 'easeInOut' }}
                        className="absolute inset-0"
                    >
                        {backgroundType === 'animated' ? (
                            <video
                                className="w-full h-full object-cover"
                                src={currentImage}
                                autoPlay
                                loop
                                muted
                                playsInline
                            />
                        ) : (
                            <div
                                className="w-full h-full bg-cover bg-center bg-no-repeat"
                                style={{ backgroundImage: `url(${currentImage})` }}
                            />
                        )}
                        {/* Lighter overlay in fullscreen mode for cleaner background */}
                        {!isFullscreen ? (
                            <div className="absolute inset-0 bg-black/10" />
                        ) : (
                            <div className="absolute inset-0 bg-black/5" />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Animated particles for ambience - hide in fullscreen for cleaner look */}
            {!isFullscreen && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white/20 rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -20, 0],
                                opacity: [0.2, 0.8, 0.2],
                                scale: [1, 1.5, 1],
                            }}
                            transition={{
                                duration: 3 + Math.random() * 4,
                                repeat: Infinity,
                                delay: Math.random() * 5,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Subtle gradient overlay for depth - only when not in fullscreen */}
            {!isFullscreen && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
            )}
        </div>
    );
};

export default BackgroundManager;
