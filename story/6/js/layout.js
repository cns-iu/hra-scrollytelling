const RESIZE_SETTLE_DELAY = 250;
const SCROLL_SETTLE_DELAY = 180;
const COARSE_POINTER_QUERY = '(hover: none) and (pointer: coarse)';
const MOBILE_CHROME_SAFETY_MARGIN_PX = 150;

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
 * Stores a stable viewport height that never changes mid-scroll, for both a scene's
 * ScrollTrigger scroll distance and the sticky stage that visibly renders it.
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
 * A fixed safety margin is added on top of the measured height so the value is generously
 * larger than the true viewport even once the toolbar fully retracts, rather than trying to
 * track that growth. Overshooting only crops slightly off-screen on an `overflow: hidden`
 * stage, which is invisible; undershooting leaves a visible gap. This value only updates on
 * load and once a genuine resize (not a toolbar-only one) settles, so it never changes mid-scroll.
 *
 * @returns {void}
 */
function updateStableViewportHeight() {
    const useStableMobileViewport = window.matchMedia(COARSE_POINTER_QUERY).matches;
    const viewportHeight = useStableMobileViewport
        ? `${window.innerHeight + MOBILE_CHROME_SAFETY_MARGIN_PX}px`
        : `${window.innerHeight}px`;

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
