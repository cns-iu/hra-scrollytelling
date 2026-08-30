const RESIZE_SETTLE_DELAY = 250;
const SCROLL_SETTLE_DELAY = 180;
const COARSE_POINTER_QUERY = '(hover: none) and (pointer: coarse)';

/**
 * Configures stable ScrollTrigger measurement and responsive refresh behavior.
 *
 * @param {object|null} ScrollTrigger GSAP ScrollTrigger plugin, or null when unavailable
 * @returns {() => Promise<void>} Function that refreshes story geometry after scrolling and layout settle
 */
export function setupLayoutStability(ScrollTrigger) {
    const refreshStoryLayout = createSettledLayoutRefresh(ScrollTrigger);

    updateStableViewportHeight();
    setupSettledResizeRefresh(refreshStoryLayout);

    if (!ScrollTrigger) {
        return refreshStoryLayout;
    }

    ScrollTrigger.config({
        ignoreMobileResize: true,
        autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
    });

    setupInitialLayoutRefresh(refreshStoryLayout);

    return refreshStoryLayout;
}

/**
 * Coalesces geometry updates and keeps ScrollTrigger from rebuilding pin spacers during active scrolling.
 *
 * @param {object|null} ScrollTrigger GSAP ScrollTrigger plugin, or null when unavailable
 * @returns {() => Promise<void>} Function that requests one refresh after scrolling and layout settle
 */
function createSettledLayoutRefresh(ScrollTrigger) {
    let isScrolling = false;
    let refreshRunning = false;
    let scrollTimer;
    let pendingResolvers = [];

    const flushRefresh = async () => {
        if (isScrolling || refreshRunning || pendingResolvers.length === 0) {
            return;
        }

        refreshRunning = true;
        await nextPaint();

        if (isScrolling) {
            refreshRunning = false;
            return;
        }

        ScrollTrigger?.refresh();

        const completedResolvers = pendingResolvers;
        pendingResolvers = [];
        refreshRunning = false;
        completedResolvers.forEach((resolve) => resolve());

        if (pendingResolvers.length > 0) {
            void flushRefresh();
        }
    };

    window.addEventListener(
        'scroll',
        () => {
            isScrolling = true;
            window.clearTimeout(scrollTimer);
            scrollTimer = window.setTimeout(() => {
                isScrolling = false;
                void flushRefresh();
            }, SCROLL_SETTLE_DELAY);
        },
        { passive: true },
    );

    return () =>
        new Promise((resolve) => {
            pendingResolvers.push(resolve);
            void flushRefresh();
        });
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
 * @param {() => Promise<void>} refreshStoryLayout Function that refreshes story geometry after paint
 * @returns {void}
 */
function setupInitialLayoutRefresh(refreshStoryLayout) {
    const refreshInitialLayout = async () => {
        if (document.fonts?.ready) {
            await document.fonts.ready;
        }

        await refreshStoryLayout();
    };

    void refreshInitialLayout();

    if (document.readyState !== 'complete') {
        window.addEventListener('load', refreshInitialLayout, { once: true });
    }
}

/**
 * Debounces resize measurement so pinned scenes are not rebuilt every frame.
 *
 * @param {() => Promise<void>} refreshStoryLayout Function that refreshes story geometry after paint
 * @returns {void}
 */
function setupSettledResizeRefresh(refreshStoryLayout) {
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
            await refreshStoryLayout();
        }, RESIZE_SETTLE_DELAY);
    });
}

/**
 * Stores a stable viewport height that never changes mid-scroll.
 *
 * Coarse-pointer browsers resolve `svh`, `lvh`, `dvh`, and `window.innerHeight` live as their
 * toolbar retracts or reappears, including continuously throughout an in-progress scroll
 * gesture, not only on discrete resize events — this is true even of `lvh`/`svh`, which per
 * spec should be static. Feeding any of those into ScrollTrigger geometry drifts scroll
 * distance out of sync with actual scroll position over a session, and using one as a sticky
 * stage's own `height` makes that stage visibly grow or shrink in real time while GSAP is
 * simultaneously animating scroll-driven transforms inside it — most visible right at the
 * splash, where the reader's very first scroll gesture is also typically the first moment the
 * toolbar starts retracting.
 *
 * This value is always the exact measured viewport, with no added margin, because every sticky
 * stage (`.page-header`, `.fadeimage`, `.scene5-1`, `.transition__stage`, `.cde-tutorial-stage`)
 * renders its own box at this height — inflating it here would make those boxes taller than the
 * real viewport and push their centered or bottom-aligned content visibly downward. A scene's
 * outer scroll-distance box needs a safety margin instead, added in CSS only against the
 * `--story-scroll-safety-margin` token so it never reaches the stage's own height. This value
 * only updates on load and once a genuine resize (not a toolbar-only one) settles, so it never
 * changes mid-scroll.
 *
 * @returns {void}
 */
function updateStableViewportHeight() {
    document.body.style.setProperty('--story-viewport-height', `${window.innerHeight}px`);
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
