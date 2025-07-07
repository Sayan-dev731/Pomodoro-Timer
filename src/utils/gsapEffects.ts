import { gsap } from 'gsap';

/**
 * GSAP animation utility functions for page transitions and effects
 */
export const gsapEffects = {
    /**
     * Creates a ripple effect from the center of the page
     * @param origin Optional click event or element to start the ripple from
     * @param duration Animation duration in seconds
     */
    rippleIn: (origin?: MouseEvent | HTMLElement, duration: number = 0.8) => {
        // Create the overlay
        const overlay = document.createElement('div');
        overlay.className = 'gsap-ripple-overlay';

        // Get position for ripple origin
        let startX = window.innerWidth / 2;
        let startY = window.innerHeight / 2;

        // If origin is provided, use its position
        if (origin instanceof MouseEvent) {
            startX = origin.clientX;
            startY = origin.clientY;
        } else if (origin instanceof HTMLElement) {
            const rect = origin.getBoundingClientRect();
            startX = rect.left + rect.width / 2;
            startY = rect.top + rect.height / 2;
        }

        // Style the overlay
        Object.assign(overlay.style, {
            position: 'fixed',
            top: `${startY}px`,
            left: `${startX}px`,
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)',
            transform: 'translate(-50%, -50%)',
            zIndex: '9999',
            pointerEvents: 'none'
        });

        // Add to DOM
        document.body.appendChild(overlay);

        // Animate
        gsap.to(overlay, {
            width: window.innerWidth * 2.5,
            height: window.innerWidth * 2.5,
            opacity: 0,
            duration,
            ease: 'power2.out',
            onComplete: () => {
                // Remove from DOM when done
                document.body.removeChild(overlay);
            }
        });
    },

    /**
     * Creates a staggered fade-in animation for multiple elements
     * @param elements Elements to animate
     * @param staggerAmount Time between each element's animation
     */
    staggerFadeIn: (elements: HTMLElement[] | NodeListOf<Element>, staggerAmount: number = 0.1) => {
        gsap.fromTo(
            elements,
            {
                y: 20,
                opacity: 0,
                filter: 'blur(5px)'
            },
            {
                y: 0,
                opacity: 1,
                filter: 'blur(0px)',
                duration: 0.7,
                stagger: staggerAmount,
                ease: 'power3.out',
                clearProps: 'transform,opacity,filter'
            }
        );
    },

    /**
     * Animates the background blur and opacity
     * @param element The element to animate
     * @param targetBlur The target blur amount in pixels
     */
    backgroundBlur: (element: HTMLElement, targetBlur: number = 10) => {
        gsap.fromTo(
            element,
            { backdropFilter: 'blur(0px)', backgroundColor: 'rgba(0, 0, 0, 0)' },
            {
                backdropFilter: `blur(${targetBlur}px)`,
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                duration: 0.5,
                ease: 'power2.out'
            }
        );
    },

    /**
     * Creates a 3D flip animation for page transitions
     * @param outgoingElement Element that's leaving
     * @param incomingElement Element that's entering
     */
    flip3D: (outgoingElement: HTMLElement, incomingElement: HTMLElement) => {
        // Hide new element initially
        gsap.set(incomingElement, { rotationY: 90, opacity: 0, display: 'none' });

        // Create timeline
        const tl = gsap.timeline();

        // Flip out the current element
        tl.to(outgoingElement, {
            duration: 0.5,
            rotationY: -90,
            opacity: 0,
            ease: 'power1.in',
            onComplete: () => {
                // Hide old element
                gsap.set(outgoingElement, { display: 'none' });
                // Show new element
                gsap.set(incomingElement, { display: 'block' });
            }
        });

        // Flip in the new element
        tl.to(incomingElement, {
            duration: 0.5,
            rotationY: 0,
            opacity: 1,
            ease: 'power1.out'
        });
    },

    /**
     * Creates a page sweep effect with a colored overlay
     * @param direction Direction of the sweep ('left', 'right', 'up', 'down')
     * @param color Color of the sweep overlay
     * @param duration Duration of the animation
     */
    pageSweep: (direction: 'left' | 'right' | 'up' | 'down' = 'right', color: string = '#ffffff', duration: number = 0.8) => {
        // Create the overlay
        const overlay = document.createElement('div');
        overlay.className = 'gsap-sweep-overlay';

        // Style based on direction
        let initialStyles = {};
        let animationStyles = {};

        if (direction === 'left' || direction === 'right') {
            initialStyles = {
                top: '0',
                [direction === 'right' ? 'left' : 'right']: '0',
                width: '0',
                height: '100%'
            };

            animationStyles = {
                width: '100%',
                x: direction === 'right' ? '100%' : '-100%'
            };
        } else {
            initialStyles = {
                left: '0',
                [direction === 'down' ? 'top' : 'bottom']: '0',
                width: '100%',
                height: '0'
            };

            animationStyles = {
                height: '100%',
                y: direction === 'down' ? '100%' : '-100%'
            };
        }

        // Style the overlay
        Object.assign(overlay.style, {
            position: 'fixed',
            backgroundColor: color,
            zIndex: '9999',
            pointerEvents: 'none',
            ...initialStyles
        });

        // Add to DOM
        document.body.appendChild(overlay);

        // Animate
        const tl = gsap.timeline({
            onComplete: () => {
                document.body.removeChild(overlay);
            }
        });

        // First grow
        tl.to(overlay, {
            ...animationStyles,
            duration: duration / 2,
            ease: 'power2.inOut'
        });

        // Then shrink
        tl.to(overlay, {
            opacity: 0,
            duration: duration / 2,
            ease: 'power2.in'
        });
    },

    /**
     * Creates a particles explosion effect from an element
     * @param sourceElement Element to create particles from
     * @param particleCount Number of particles to create
     * @param duration Duration of the effect
     */
    particlesExplode: (sourceElement: HTMLElement, particleCount: number = 20, duration: number = 1.5) => {
        const rect = sourceElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Create particles container
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '9999';
        document.body.appendChild(container);

        // Create particles
        const particles = [];
        const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3'];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 10 + 5;
            const color = colors[Math.floor(Math.random() * colors.length)];

            Object.assign(particle.style, {
                position: 'absolute',
                top: `${centerY}px`,
                left: `${centerX}px`,
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: color,
                borderRadius: '50%',
                opacity: Math.random() * 0.5 + 0.5
            });

            container.appendChild(particle);
            particles.push(particle);
        }

        // Animate particles
        particles.forEach(particle => {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 200 + 50;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;

            gsap.to(particle, {
                x: x - centerX,
                y: y - centerY,
                opacity: 0,
                duration: Math.random() * duration + 0.5,
                ease: 'power2.out',
                onComplete: () => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }
            });
        });

        // Clean up container after all particles are done
        gsap.delayedCall(duration + 1, () => {
            if (document.body.contains(container)) {
                document.body.removeChild(container);
            }
        });
    }
};

export default gsapEffects;
