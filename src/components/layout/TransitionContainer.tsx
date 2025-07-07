import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

interface TransitionContainerProps {
    children: React.ReactNode;
}

const TransitionContainer: React.FC<TransitionContainerProps> = ({ children }) => {
    const location = useLocation();
    const containerRef = useRef<HTMLDivElement>(null);
    const [displayLocation, setDisplayLocation] = useState(location);
    const [transitionStage, setTransitionStage] = useState('fadeIn');

    useEffect(() => {
        if (location.pathname !== displayLocation.pathname) {
            // Start exit animation
            setTransitionStage('fadeOut');

            // Create exit animation with GSAP
            const tl = gsap.timeline({
                onComplete: () => {
                    // Update location after exit animation completes
                    setDisplayLocation(location);
                    setTransitionStage('fadeIn');

                    // Clear any lingering effects from the exit animation
                    if (containerRef.current) {
                        gsap.set(containerRef.current, { clearProps: "transform,filter" });
                    }
                }
            });

            // Simple fade out effect without scale or blur to avoid wiggle
            tl.to(containerRef.current, {
                duration: 0.3,
                opacity: 0,
                ease: "power2.inOut"
            });
        }
    }, [location, displayLocation]);

    useEffect(() => {
        if (transitionStage === 'fadeIn') {
            // Create entry animation with GSAP
            const tl = gsap.timeline({
                // Ensure properties are reset after animation completes
                onComplete: () => {
                    // Explicitly set final state to ensure content is fully visible
                    if (containerRef.current) {
                        // First explicitly set required properties
                        gsap.set(containerRef.current, {
                            opacity: 1,
                            filter: "blur(0px)",
                            scale: 1,
                            y: 0
                        });

                        // Then clear all transform-related props to prevent any lingering effects
                        setTimeout(() => {
                            gsap.set(containerRef.current, { clearProps: "transform,opacity,filter" });
                        }, 50);
                    }
                }
            });

            // Simple fade-in animation without scale or blur to match fade out
            tl.fromTo(
                containerRef.current,
                {
                    opacity: 0
                },
                {
                    duration: 0.3,
                    opacity: 1,
                    ease: "power2.inOut"
                }
            );
        }
    }, [transitionStage]);

    return (
        <div
            ref={containerRef}
            className="transition-container w-full h-full"
            style={{
                transformOrigin: 'center center',
                willChange: 'opacity, transform, filter'
            }}
        >
            {React.Children.map(children, child => {
                // Clone the child element to pass props
                return React.isValidElement(child) ? React.cloneElement(child) : child;
            })}
        </div>
    );
};

export default TransitionContainer;
