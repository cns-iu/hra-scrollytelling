import { setupStoryAnimations } from './js/animations.js';
import { setupLayoutStability } from './js/layout.js';
import { setupTissueImagePreparation } from './js/media.js';
import { setupContentReveals } from './js/reveals.js';
import { setupStoryUi } from './js/ui.js';

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const animationsAvailable = Boolean(gsap && ScrollTrigger);
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (animationsAvailable) {
  gsap.registerPlugin(ScrollTrigger);
} else {
  document.body.classList.add('story-animations-unavailable');
}

setupStoryUi();
setupContentReveals(prefersReducedMotion);
setupTissueImagePreparation();
setupLayoutStability(animationsAvailable ? ScrollTrigger : null);

setupStoryAnimations({
  gsap,
  ScrollTrigger,
  prefersReducedMotion,
});
