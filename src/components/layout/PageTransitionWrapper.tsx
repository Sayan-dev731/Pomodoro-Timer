import React, { useRef, useEffect } from 'react';
import gsap from '../../utils/gsapInit';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface PageTransitionWrapperProps {
    children: React.ReactNode;
    staggerDelay?: number;
    scrollAnimation?: boolean;
}

const PageTransitionWrapper: React.FC<PageTransitionWrapperProps> = ({
    children,
    staggerDelay = 0.08,
    scrollAnimation = true
}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const elementsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!wrapperRef.current || !elementsRef.current) return;

        // Get all direct child elements
        const childElements = elementsRef.current.children;
        const childElementsArray = Array.from(childElements);

        // Reset initial states - use simpler initial state to prevent wiggle
        gsap.set(wrapperRef.current, { autoAlpha: 0 });
        gsap.set(childElementsArray, {
            y: 20,
            opacity: 0
        });

        // Animate the container first
        const mainTl = gsap.timeline({
            defaults: { ease: "power3.out" }
        });

        mainTl.to(wrapperRef.current, {
            duration: 0.4,
            autoAlpha: 1,
            clearProps: "all"
        });

        // Then animate each child with a stagger effect - simplified animation
        mainTl.to(
            childElementsArray,
            {
                duration: 0.5,
                y: 0,
                opacity: 1,
                stagger: staggerDelay,
                ease: "power2.out",
                onComplete: () => {
                    // Ensure all children are fully visible
                    childElementsArray.forEach(element => {
                        gsap.set(element, {
                            opacity: 1,
                            y: 0,
                            clearProps: "transform,opacity"
                        });
                    });
                }
            },
            "-=0.2" // Start slightly before the parent animation finishes
        );

        // Optional: Add scroll animations for elements further down the page
        if (scrollAnimation && childElementsArray.length > 0) {
            // Find elements that are below the fold
            childElementsArray.forEach((element, index) => {
                const rect = element.getBoundingClientRect();
                const isOffscreen = rect.top > window.innerHeight - 100;

                if (isOffscreen && index > 2) { // Skip first few elements as they're handled by initial animation
                    gsap.set(element, {
                        y: 30,
                        opacity: 0
                    });

                    ScrollTrigger.create({
                        trigger: element,
                        start: "top bottom-=100",
                        onEnter: () => {
                            gsap.to(element, {
                                y: 0,
                                opacity: 1,
                                duration: 0.5,
                                ease: "power2.out",
                                onComplete: () => {
                                    // Ensure element is fully visible after scroll animation
                                    gsap.set(element, {
                                        opacity: 1,
                                        y: 0,
                                        clearProps: "transform,opacity"
                                    });
                                }
                            });
                        },
                        once: true
                    });
                }
            });
        }

        return () => {
            // Cleanup
            mainTl.kill();
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [staggerDelay, scrollAnimation]);

    return (
        <div ref={wrapperRef} className="page-transition-wrapper w-full">
            <div ref={elementsRef} className="elements-container">
                {children}
            </div>
        </div>
    );
};

export default PageTransitionWrapper;
