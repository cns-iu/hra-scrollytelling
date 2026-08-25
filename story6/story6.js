import { setupStoryAnimations } from './js/animations.js';
import { setupBackToTopAnimationReset, setupLayoutStability } from './js/layout.js';
import { setupStoryImagePreparation } from './js/media.js';
import { setupContentReveals } from './js/reveals.js';

const STORY_ANIMATION_QUERY = '(prefers-reduced-motion: no-preference) and (min-height: 36rem)';
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const animationsAvailable = Boolean(gsap && ScrollTrigger);

if (animationsAvailable) {
    gsap.registerPlugin(ScrollTrigger);
} else {
    document.body.classList.add('story-animations-unavailable');
}

setupContentReveals();
setupStoryImagePreparation();
setupLayoutStability(animationsAvailable ? ScrollTrigger : null);
setupBackToTopAnimationReset(animationsAvailable ? ScrollTrigger : null);

if (animationsAvailable) {
    setupResponsiveStoryAnimations(gsap, ScrollTrigger);
}

/**
 * Enables pinned animation only when motion and viewport conditions can support it.
 *
 * @param {object} gsapRuntime GSAP animation runtime
 * @param {object} scrollTriggerRuntime GSAP ScrollTrigger plugin
 * @returns {void}
 */
function setupResponsiveStoryAnimations(gsapRuntime, scrollTriggerRuntime) {
    const animationQuery = window.matchMedia(STORY_ANIMATION_QUERY);
    let teardownAnimations = null;

    const syncAnimationState = () => {
        if (!animationQuery.matches) {
            document.body.classList.remove('story-animations-enabled');

            if (teardownAnimations) {
                teardownAnimations();
                teardownAnimations = null;
                scrollTriggerRuntime.refresh();
            }

            return;
        }

        if (teardownAnimations) {
            return;
        }

        try {
            teardownAnimations = setupStoryAnimations({
                gsap: gsapRuntime,
                ScrollTrigger: scrollTriggerRuntime,
            });
            document.body.classList.remove('story-animations-unavailable');
            document.body.classList.add('story-animations-enabled');
            scrollTriggerRuntime.refresh();
        } catch (error) {
            document.body.classList.remove('story-animations-enabled');
            document.body.classList.add('story-animations-unavailable');
            teardownAnimations?.();
            teardownAnimations = null;
            console.error('Story 6 animations could not be initialized', error);
        }
    };

    syncAnimationState();

    if (typeof animationQuery.addEventListener === 'function') {
        animationQuery.addEventListener('change', syncAnimationState);
    } else {
        animationQuery.addListener(syncAnimationState);
    }
}
