import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

interface AnimatedRouteProps {
    children: React.ReactNode;
    routePath: string;
}

const AnimatedRoute: React.FC<AnimatedRouteProps> = ({ children, routePath }) => {
    const location = useLocation();
    const elementRef = useRef<HTMLDivElement>(null);
    const isActive = location.pathname === routePath;

    useEffect(() => {
        if (isActive && elementRef.current) {
            // Set initial state
            gsap.set(elementRef.current, {
                opacity: 0,
                y: 30,
                filter: "blur(5px)"
            });

            // Create entrance animation
            gsap.to(elementRef.current, {
                duration: 0.6,
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                ease: "power3.out",
                stagger: {
                    amount: 0.3,
                    from: "start"
                }
            });
        }
    }, [isActive]);

    return (
        <div
            ref={elementRef}
            style={{ display: isActive ? 'block' : 'none' }}
            className="animated-route"
        >
            {children}
        </div>
    );
};

export default AnimatedRoute;
