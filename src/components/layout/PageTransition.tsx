import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from '../../utils/gsapInit';

// Import GSAP effects
import gsapEffects from '../../utils/gsapEffects';

interface PageTransitionProps {
    children: React.ReactNode;
    transitionType?: 'fade' | 'slide' | 'zoom' | 'flip' | 'ripple' | 'sweep' | 'particles' | 'random';
}

const PageTransition: React.FC<PageTransitionProps> = ({
    children,
    transitionType = 'random'
}) => {
    const location = useLocation();
    const pageRef = useRef<HTMLDivElement>(null);
    const prevPathRef = useRef<string>(location.pathname);
    const overlayRef = useRef<HTMLDivElement>(null);
    const [transitionEffect, setTransitionEffect] = useState<string>(transitionType);

    useEffect(() => {
        if (transitionType === 'random') {
            const effects = ['fade', 'slide', 'zoom', 'flip', 'ripple', 'sweep', 'particles'];
            const randomEffect = effects[Math.floor(Math.random() * effects.length)];
            setTransitionEffect(randomEffect);
        } else {
            setTransitionEffect(transitionType);
        }
    }, [location.pathname, transitionType]);

    useEffect(() => {
        if (prevPathRef.current !== location.pathname && pageRef.current) {
            // Create timeline for the transition
            const tl = gsap.timeline({
                defaults: {
                    ease: "power3.inOut",
                    duration: 0.75
                },
                onComplete: () => {
                    // Ensure content is visible after any transition by explicitly resetting all properties
                    if (pageRef.current) {
                        gsap.set(pageRef.current, {
                            opacity: 1,
                            scale: 1,
                            x: 0,
                            y: 0,
                            rotationX: 0,
                            rotationY: 0,
                            filter: "blur(0px)"
                        });

                        // Use a small delay to ensure GSAP has completed all operations
                        setTimeout(() => {
                            gsap.set(pageRef.current, { clearProps: "transform,filter,opacity" });
                        }, 50);
                    }
                }
            });

            // Apply different transition based on the selected effect
            switch (transitionEffect) {
                case 'fade':
                    // Simple clean fade transition without scale or blur to avoid wiggle
                    tl.to(pageRef.current, {
                        opacity: 0,
                        duration: 0.3,
                        ease: "power2.inOut"
                    })
                        .add(() => { prevPathRef.current = location.pathname; })
                        .fromTo(
                            pageRef.current,
                            { opacity: 0 },
                            { opacity: 1, duration: 0.3, ease: "power2.inOut" }
                        );
                    break;

                case 'slide':
                    // Direction-aware slide effect (slide out to opposite of where we're going)
                    const prevIndex = getRouteIndex(prevPathRef.current);
                    const currentIndex = getRouteIndex(location.pathname);
                    const direction = prevIndex > currentIndex ? 1 : -1;

                    tl.to(pageRef.current, {
                        x: direction * -window.innerWidth * 0.3,
                        opacity: 0,
                        scale: 0.9,
                        duration: 0.5,
                    })
                        .add(() => { prevPathRef.current = location.pathname; })
                        .fromTo(
                            pageRef.current,
                            { x: direction * window.innerWidth * 0.3, opacity: 0, scale: 0.9 },
                            { x: 0, opacity: 1, scale: 1, duration: 0.6 }
                        );
                    break;

                case 'zoom':
                    // Zoom transition with depth effect
                    tl.to(pageRef.current, {
                        opacity: 0,
                        scale: 1.5,
                        filter: "blur(20px)",
                        duration: 0.5,
                    })
                        .add(() => { prevPathRef.current = location.pathname; })
                        .fromTo(
                            pageRef.current,
                            { opacity: 0, scale: 0.7, filter: "blur(10px)" },
                            { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.6 }
                        );
                    break;

                case 'flip':
                    // 3D flip with perspective
                    if (overlayRef.current) {
                        gsap.set(pageRef.current, { transformPerspective: 1000 });

                        tl.to(pageRef.current, {
                            rotationY: 90,
                            opacity: 0,
                            duration: 0.5,
                            ease: "power1.in"
                        })
                            .to(overlayRef.current, { opacity: 0.8, duration: 0.3 }, "-=0.3")
                            .add(() => { prevPathRef.current = location.pathname; })
                            .to(overlayRef.current, { opacity: 0, duration: 0.3 })
                            .fromTo(
                                pageRef.current,
                                { rotationY: -90, opacity: 0 },
                                { rotationY: 0, opacity: 1, duration: 0.5, ease: "power1.out" }
                            );
                    }
                    break;

                case 'ripple':
                    // Ripple effect using the utility
                    tl.to(pageRef.current, {
                        opacity: 0,
                        scale: 0.95,
                        duration: 0.4,
                    })
                        .add(() => {
                            prevPathRef.current = location.pathname;
                            gsapEffects.rippleIn(undefined, 0.8);
                        })
                        .fromTo(
                            pageRef.current,
                            { opacity: 0, scale: 1.05 },
                            { opacity: 1, scale: 1, duration: 0.6, delay: 0.2 }
                        );
                    break;

                case 'sweep':
                    // Page sweep effect with direction based on navigation
                    const prevIdxSweep = getRouteIndex(prevPathRef.current);
                    const currentIdxSweep = getRouteIndex(location.pathname);
                    const sweepDirection = prevIdxSweep > currentIdxSweep ? 'right' : 'left';

                    tl.to(pageRef.current, {
                        opacity: 0,
                        duration: 0.3,
                    })
                        .add(() => {
                            prevPathRef.current = location.pathname;
                            gsapEffects.pageSweep(sweepDirection as any, 'rgba(255, 255, 255, 0.2)', 0.8);
                        })
                        .fromTo(
                            pageRef.current,
                            { opacity: 0 },
                            { opacity: 1, duration: 0.5, delay: 0.3 }
                        );
                    break;

                case 'particles':
                    // Particles explosion effect
                    if (pageRef.current) {
                        tl.to(pageRef.current, {
                            opacity: 0,
                            scale: 0.95,
                            duration: 0.4,
                        })
                            .add(() => {
                                prevPathRef.current = location.pathname;
                                // Create a temporary element at the center of the screen for particles
                                const tempElement = document.createElement('div');
                                tempElement.style.position = 'fixed';
                                tempElement.style.top = '50%';
                                tempElement.style.left = '50%';
                                tempElement.style.width = '10px';
                                tempElement.style.height = '10px';
                                document.body.appendChild(tempElement);

                                // Create particle explosion
                                gsapEffects.particlesExplode(tempElement, 30, 1.2);

                                // Remove temp element
                                setTimeout(() => document.body.removeChild(tempElement), 100);
                            })
                            .fromTo(
                                pageRef.current,
                                { opacity: 0, scale: 0.9 },
                                { opacity: 1, scale: 1, duration: 0.7, delay: 0.3 }
                            );
                    }
                    break;

                default:
                    // Default smooth fade transition
                    tl.to(pageRef.current, {
                        opacity: 0,
                        duration: 0.3,
                        ease: "power2.inOut"
                    })
                        .add(() => { prevPathRef.current = location.pathname; })
                        .fromTo(
                            pageRef.current,
                            { opacity: 0 },
                            { opacity: 1, duration: 0.3, ease: "power2.inOut" }
                        );
            }
        }
    }, [location.pathname, transitionEffect]);

    // Helper function to get route index for direction-aware transitions
    const getRouteIndex = (path: string): number => {
        const routes = ['/', '/timer', '/tasks', '/stats', '/notes', '/music', '/settings'];
        const index = routes.indexOf(path);
        return index !== -1 ? index : 0;
    };

    return (
        <>
            {/* Transition overlay for certain effects */}
            <div
                ref={overlayRef}
                className="fixed inset-0 bg-black pointer-events-none z-50 opacity-0"
            />

            {/* Main content container */}
            <div
                ref={pageRef}
                className="page-transition w-full h-full min-h-screen"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {children}
            </div>
        </>
    );
};

export default PageTransition;
