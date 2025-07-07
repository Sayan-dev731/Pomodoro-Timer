import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register GSAP plugins
gsap.registerPlugin(
    ScrollTrigger,
    Flip,
    TextPlugin,
    ScrollToPlugin
);

// Configure GSAP defaults
gsap.config({
    nullTargetWarn: false, // Suppress console warnings for null targets
    autoKillThreshold: 0.001 // Small threshold for auto kill to prevent lingering animations
});

// Set default animation settings
gsap.defaults({
    overwrite: "auto",
    ease: "power2.out",
    duration: 0.3
});

export default gsap;
