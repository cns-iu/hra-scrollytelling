import { setupStoryAnimations } from './js/animations.js';
import { setupBackToTopAnimationReset, setupLayoutStability } from './js/layout.js';
import { setupTissueImagePreparation } from './js/media.js';
import { setupContentReveals } from './js/reveals.js';

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const animationsAvailable = Boolean(gsap && ScrollTrigger);
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const animationsEnabled = animationsAvailable && !prefersReducedMotion;

if (animationsAvailable) {
  gsap.registerPlugin(ScrollTrigger);
} else {
  document.body.classList.add('story-animations-unavailable');
}

if (animationsEnabled) {
  document.body.classList.add('story-animations-enabled');
}

setupContentReveals(prefersReducedMotion);
setupTissueImagePreparation();
setupLayoutStability(animationsAvailable ? ScrollTrigger : null);
setupBackToTopAnimationReset(animationsAvailable ? ScrollTrigger : null);

setupStoryAnimations({
  gsap,
  ScrollTrigger,
  prefersReducedMotion,
});
