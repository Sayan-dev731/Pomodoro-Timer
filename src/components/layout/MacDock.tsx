import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { gsap } from 'gsap';
import {
    Home,
    Timer,
    CheckSquare,
    BarChart3,
    FileText,
    Music,
    Settings,
} from 'lucide-react';

interface MacDockProps {
    isVisible: boolean;
    isFullscreen?: boolean;
    dockPosition?: 'bottom' | 'top' | 'left' | 'right';
}

const MacDock: React.FC<MacDockProps> = ({
    isVisible,
    isFullscreen = false,
    dockPosition = 'bottom'
}) => {
    const [isMobile, setIsMobile] = useState(false);
    const dockRef = useRef<HTMLDivElement>(null);
    const prevPositionRef = useRef<string>('');

    // Check if mobile device
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024); // lg breakpoint
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Animate dock position changes with GSAP
    useEffect(() => {
        if (!dockRef.current || isMobile || !isVisible) return;

        const dock = dockRef.current;
        const prevPosition = prevPositionRef.current;

        // Only animate if position actually changed and it's not the initial render
        if (prevPosition !== dockPosition && prevPosition !== '') {
            // Clear any existing transforms
            gsap.set(dock, { clearProps: "all" });

            // Get the new position configuration
            const newConfig = getPositionStyles();

            // Create animation timeline for smooth transition
            const tl = gsap.timeline();

            // First, scale down and fade slightly
            tl.to(dock, {
                scale: 0.8,
                opacity: 0.5,
                duration: 0.2,
                ease: "power2.in"
            })
                // Then update the classes during the scaled state
                .call(() => {
                    dock.className = `${newConfig.position} z-50`;
                })
                // Finally, scale back up and animate to new position with bounce
                .to(dock, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.6,
                    ease: "back.out(1.4)"
                });
        } else if (prevPosition === '') {
            // Initial render - just set the position without animation
            const config = getPositionStyles();
            dock.className = `${config.position} z-50`;
        }

        // Update the previous position reference
        prevPositionRef.current = dockPosition;
    }, [dockPosition, isMobile, isVisible]);

    // Don't render dock on mobile
    if (isMobile) {
        return null;
    }

    const getPositionStyles = () => {
        switch (dockPosition) {
            // case 'top':
            //     return {
            //         position: 'fixed top-4 left-0 right-0 flex justify-center', 
            //         container: 'flex-row',
            //         containerClass: 'flex flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3',
            //         itemClass: 'w-10 h-10 sm:w-12 sm:h-12'
            //     };
            case 'left':
                return {
                    position: 'fixed left-4 top-0 bottom-0 flex items-center', 
                    container: 'flex-col',
                    containerClass: 'flex flex-col items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 sm:py-4',
                    itemClass: 'w-10 h-10 sm:w-12 sm:h-12'
                };
            // case 'right':
            //     return {
            //         position: 'fixed right-4 top-0 bottom-0 flex items-center', 
            //         container: 'flex-col',
            //         containerClass: 'flex flex-col items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 sm:py-4',
            //         itemClass: 'w-10 h-10 sm:w-12 sm:h-12'
            //     };
            case 'bottom':
            default:
                return {
                    position: 'fixed bottom-4 left-0 right-0 flex justify-center', 
                    container: 'flex-row',
                    containerClass: 'flex flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3',
                    itemClass: 'w-10 h-10 sm:w-12 sm:h-12'
                };
        }
    };



    const dockItems = [
        { to: '/', icon: Home, label: 'Home', color: 'from-blue-400 to-blue-600' },
        { to: '/timer', icon: Timer, label: 'Timer', color: 'from-orange-400 to-red-500' },
        { to: '/tasks', icon: CheckSquare, label: 'Tasks', color: 'from-green-400 to-emerald-500' },
        { to: '/stats', icon: BarChart3, label: 'Stats', color: 'from-purple-400 to-violet-500' },
        { to: '/notes', icon: FileText, label: 'Notes', color: 'from-yellow-400 to-amber-500' },
        { to: '/music', icon: Music, label: 'Music', color: 'from-pink-400 to-rose-500' },
        // Only show settings when not in fullscreen
        ...(!isFullscreen ? [{ to: '/settings', icon: Settings, label: 'Settings', color: 'from-gray-400 to-gray-600' }] : []),
    ];

    const positionConfig = getPositionStyles();

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    ref={dockRef}
                    initial={{
                        y: dockPosition === 'bottom' ? 100 : dockPosition === 'top' ? -100 : 0,
                        x: dockPosition === 'left' ? -100 : dockPosition === 'right' ? 100 : 0,
                        opacity: 0
                    }}
                    animate={{ y: 0, x: 0, opacity: 1 }}
                    exit={{
                        y: dockPosition === 'bottom' ? 100 : dockPosition === 'top' ? -100 : 0,
                        x: dockPosition === 'left' ? -100 : dockPosition === 'right' ? 100 : 0,
                        opacity: 0
                    }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className={`${positionConfig.position} z-50`}
                >
                    <div className={`${positionConfig.containerClass} bg-white/10 backdrop-blur-2xl rounded-xl sm:rounded-2xl border border-white/20 shadow-2xl transition-all duration-300`}>
                        {dockItems.map((item, index) => (
                            <motion.div
                                key={item.to}
                                className="dock-item"
                                initial={{ scale: 0, [dockPosition === 'bottom' || dockPosition === 'top' ? 'y' : 'x']: 20 }}
                                animate={{ scale: 1, y: 0, x: 0 }}
                                transition={{
                                    type: 'spring',
                                    damping: 15,
                                    stiffness: 300,
                                    delay: index * 0.05
                                }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <NavLink
                                    to={item.to}
                                    className={({ isActive }) =>
                                        `group relative flex items-center justify-center ${positionConfig.itemClass} rounded-lg sm:rounded-xl transition-all duration-300 ${isActive
                                            ? `bg-gradient-to-br ${item.color} shadow-lg scale-110`
                                            : 'hover:bg-white/20 hover:scale-105'
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <item.icon
                                                className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/80'
                                                    }`}
                                            />

                                            {/* Tooltip */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                                whileHover={{ opacity: 1, y: -5, scale: 1 }}
                                                className={`absolute ${dockPosition === 'bottom' ? 'bottom-full mb-2' :
                                                    dockPosition === 'top' ? 'top-full mt-2' :
                                                        dockPosition === 'left' ? 'left-full ml-2' : 'right-full mr-2'
                                                    } px-2 py-1 bg-black/80 text-white text-xs rounded-lg whitespace-nowrap pointer-events-none hidden sm:block`}
                                            >
                                                {item.label}
                                                <div className={`absolute ${dockPosition === 'bottom' ? 'top-full left-1/2 transform -translate-x-1/2 border-t-black/80 border-t-4' :
                                                    dockPosition === 'top' ? 'bottom-full left-1/2 transform -translate-x-1/2 border-b-black/80 border-b-4' :
                                                        dockPosition === 'left' ? 'right-full top-1/2 transform -translate-y-1/2 border-l-black/80 border-l-4' :
                                                            'left-full top-1/2 transform -translate-y-1/2 border-r-black/80 border-r-4'
                                                    } w-0 h-0 border-l-4 border-r-4 border-transparent`}></div>
                                            </motion.div>

                                            {/* Active indicator dot */}
                                            {isActive && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className={`absolute ${dockPosition === 'bottom' ? '-bottom-1' :
                                                        dockPosition === 'top' ? '-top-1' :
                                                            dockPosition === 'left' ? '-left-1' : '-right-1'
                                                        } ${dockPosition === 'left' || dockPosition === 'right' ? 'top-1/2 transform -translate-y-1/2' : 'left-1/2 transform -translate-x-1/2'} w-1 h-1 bg-white rounded-full`}
                                                />
                                            )}

                                            {/* Reflection effect */}
                                            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent rounded-lg sm:rounded-xl opacity-40 pointer-events-none" />
                                        </>
                                    )}
                                </NavLink>
                            </motion.div>
                        ))}
                    </div>

                    {/* Dock reflection - only for bottom position */}
                    {dockPosition === 'bottom' && (
                        <div
                            className="absolute top-full left-0 right-0 h-8 opacity-30 transform scale-y-[-1]"
                            style={{
                                background: 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)',
                                maskImage: 'linear-gradient(to bottom, black, transparent)',
                                WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)',
                            }}
                        />
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MacDock;
