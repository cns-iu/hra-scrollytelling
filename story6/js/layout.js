const RESIZE_SETTLE_DELAY = 250;
const COARSE_POINTER_QUERY = '(hover: none) and (pointer: coarse)';
const LARGE_VIEWPORT_HEIGHT = '100lvh';

/**
 * Configures stable ScrollTrigger measurement and responsive refresh behavior.
 *
 * @param {object|null} ScrollTrigger GSAP ScrollTrigger plugin, or null when unavailable
 * @returns {void}
 */
export function setupLayoutStability(ScrollTrigger) {
    updateStableViewportHeight();
    setupSettledResizeRefresh(ScrollTrigger);

    if (!ScrollTrigger) {
        return;
    }

    ScrollTrigger.config({
        ignoreMobileResize: true,
        autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
    });

    setupInitialLayoutRefresh(ScrollTrigger);
}

/**
 * Synchronizes scrubbed timelines with an instant shared back-to-top jump.
 *
 * @param {object|null} ScrollTrigger GSAP ScrollTrigger plugin, or null when unavailable
 * @returns {void}
 */
export function setupBackToTopAnimationReset(ScrollTrigger) {
    const backToTopLink = document.querySelector('[data-back-to-top]');

    if (!ScrollTrigger || !backToTopLink) {
        return;
    }

    backToTopLink.addEventListener('click', () => {
        window.requestAnimationFrame(() => {
            ScrollTrigger.update(true);
            ScrollTrigger.getAll().forEach((trigger) => {
                const scrubTween = trigger.getTween?.();

                if (typeof scrubTween?.progress === 'function') {
                    scrubTween.progress(1);
                }
            });
        });
    });
}

/**
 * Refreshes the measured layout after fonts and page assets settle.
 *
 * @param {object} ScrollTrigger GSAP ScrollTrigger plugin
 * @returns {void}
 */
function setupInitialLayoutRefresh(ScrollTrigger) {
    const refreshInitialLayout = async () => {
        if (document.fonts?.ready) {
            await document.fonts.ready;
        }

        await nextPaint();
        ScrollTrigger.refresh();
    };

    void refreshInitialLayout();

    if (document.readyState !== 'complete') {
        window.addEventListener('load', refreshInitialLayout, { once: true });
    }
}

/**
 * Debounces resize measurement so pinned scenes are not rebuilt every frame.
 *
 * @param {object|null} ScrollTrigger GSAP ScrollTrigger plugin, or null when unavailable
 * @returns {void}
 */
function setupSettledResizeRefresh(ScrollTrigger) {
    const coarsePointer = window.matchMedia(COARSE_POINTER_QUERY);
    let previousWidth = window.innerWidth;
    let resizeTimer;

    window.addEventListener('resize', () => {
        const currentWidth = window.innerWidth;
        const widthChanged = Math.abs(currentWidth - previousWidth) > 1;

        if (coarsePointer.matches && !widthChanged) {
            return;
        }

        previousWidth = currentWidth;
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(async () => {
            updateStableViewportHeight();
            await nextPaint();
            ScrollTrigger?.refresh();
        }, RESIZE_SETTLE_DELAY);
    });
}

/**
 * Stores a stable viewport height without exposing space behind retractable mobile browser controls.
 *
 * @returns {void}
 */
function updateStableViewportHeight() {
    const useLargeMobileViewport =
        window.matchMedia(COARSE_POINTER_QUERY).matches && typeof CSS !== 'undefined' && CSS.supports('height', LARGE_VIEWPORT_HEIGHT);
    const viewportHeight = useLargeMobileViewport ? LARGE_VIEWPORT_HEIGHT : `${window.innerHeight}px`;

    document.body.style.setProperty('--story-viewport-height', viewportHeight);
}

/**
 * Waits until the browser has completed the next layout and paint cycle.
 *
 * @returns {Promise<void>} A promise resolved after two animation frames
 */
function nextPaint() {
    return new Promise((resolve) => {
        window.requestAnimationFrame(() => window.requestAnimationFrame(resolve));
    });
}
