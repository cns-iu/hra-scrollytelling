import { setupStoryAnimations } from './js/animations.js';
import { setupBackToTopAnimationReset, setupLayoutStability } from './js/layout.js';
import { setupStoryImagePreparation } from './js/media.js';
import { setupContentReveals } from './js/reveals.js';

const STORY_MOTION_QUERY = '(prefers-reduced-motion: no-preference)';
const STORY_HEIGHT_QUERY = '(min-height: 36rem)';
const COARSE_POINTER_QUERY = '(hover: none) and (pointer: coarse)';
const MINIMUM_ANIMATION_HEIGHT = 36 * 16;
const ORIENTATION_SETTLE_DELAY = 350;
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const animationsAvailable = Boolean(gsap && ScrollTrigger);

if (animationsAvailable) {
    gsap.registerPlugin(ScrollTrigger);
} else {
    document.body.classList.add('story-animations-unavailable');
}

setupContentReveals();
const refreshStoryLayout = setupLayoutStability(animationsAvailable ? ScrollTrigger : null);
setupStoryImagePreparation({ onMouseImagesPrepared: refreshStoryLayout });
setupBackToTopAnimationReset(animationsAvailable ? ScrollTrigger : null);

if (animationsAvailable) {
    setupResponsiveStoryAnimations(gsap, ScrollTrigger, refreshStoryLayout);
}

/**
 * Enables pinned animation only when motion and viewport conditions can support it.
 *
 * @param {object} gsapRuntime GSAP animation runtime
 * @param {object} scrollTriggerRuntime GSAP ScrollTrigger plugin
 * @param {() => Promise<void>} refreshLayout Function that refreshes geometry after scrolling settles
 * @returns {void}
 */
function setupResponsiveStoryAnimations(gsapRuntime, scrollTriggerRuntime, refreshLayout) {
    const motionQuery = window.matchMedia(STORY_MOTION_QUERY);
    const heightQuery = window.matchMedia(STORY_HEIGHT_QUERY);
    const coarsePointerQuery = window.matchMedia(COARSE_POINTER_QUERY);
    let teardownAnimations = null;
    let orientationTimer;

    const syncAnimationState = () => {
        const hasSufficientHeight = coarsePointerQuery.matches
            ? measureStableViewportHeight() >= MINIMUM_ANIMATION_HEIGHT
            : heightQuery.matches;
        const animationsShouldRun = motionQuery.matches && hasSufficientHeight;

        if (!animationsShouldRun) {
            document.body.classList.remove('story-animations-enabled');

            if (teardownAnimations) {
                teardownAnimations();
                teardownAnimations = null;
                void refreshLayout();
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
            void refreshLayout();
        } catch (error) {
            document.body.classList.remove('story-animations-enabled');
            document.body.classList.add('story-animations-unavailable');
            teardownAnimations?.();
            teardownAnimations = null;
            console.error('Story 6 animations could not be initialized', error);
        }
    };

    syncAnimationState();
    addMediaQueryListener(motionQuery, syncAnimationState);
    addMediaQueryListener(coarsePointerQuery, syncAnimationState);
    addMediaQueryListener(heightQuery, () => {
        if (!coarsePointerQuery.matches) {
            syncAnimationState();
        }
    });

    window.addEventListener('orientationchange', () => {
        window.clearTimeout(orientationTimer);
        orientationTimer = window.setTimeout(syncAnimationState, ORIENTATION_SETTLE_DELAY);
    });
}

/**
 * Measures the stable Story 6 viewport role instead of the browser chrome-sensitive visual viewport.
 *
 * @returns {number} Stable viewport height in CSS pixels
 */
function measureStableViewportHeight() {
    const probe = document.createElement('div');

    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText =
        'position:fixed;inset:0 auto auto 0;width:1px;height:var(--story-viewport-height);visibility:hidden;pointer-events:none;';
    document.body.append(probe);

    const height = probe.getBoundingClientRect().height;
    probe.remove();

    return height;
}

/**
 * Registers a media-query listener with compatibility for older mobile browsers.
 *
 * @param {MediaQueryList} query Media query to observe
 * @param {() => void} listener Function called when the query result changes
 * @returns {void}
 */
function addMediaQueryListener(query, listener) {
    if (typeof query.addEventListener === 'function') {
        query.addEventListener('change', listener);
    } else {
        query.addListener(listener);
    }
}
