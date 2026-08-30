const RESIZE_SETTLE_DELAY = 250;
const SCROLL_SETTLE_DELAY = 180;
const COARSE_POINTER_QUERY = '(hover: none) and (pointer: coarse)';
let largestObservedViewportHeight = 0;

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

        if (widthChanged) {
            resetStableViewportHeightTracking();
        }

        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(async () => {
            updateStableViewportHeight();
            await refreshStoryLayout();
        }, RESIZE_SETTLE_DELAY);
    });
}

/**
 * Stores the stable viewport height that scroll-driven scenes size their ScrollTrigger scroll
 * distance against — not the height visible content itself renders at.
 *
 * Coarse-pointer browsers resolve `lvh`, `dvh`, and `window.innerHeight` live as their toolbar
 * retracts or reappears, including continuously throughout an in-progress scroll gesture, not
 * only on discrete resize events. Feeding that moving target into ScrollTrigger geometry made
 * scroll distance drift out of sync with actual scroll position the longer a session ran, and
 * updating it reactively on every scroll settle left it stale for the entire duration of an
 * active scroll — undersized relative to the real, currently-retracted toolbar state — which
 * both left a visible gap under sticky content and shrank each scene's effective scroll
 * distance enough that a fast flick could blow through an entire reveal in too few frames to
 * render. This value only updates on load and once a genuine resize (not a toolbar-only one)
 * settles, so ScrollTrigger's cached geometry is never invalidated mid-gesture. The sticky
 * scene stages that render this height on screen use a separately live `dvh` value instead
 * (see the coarse-pointer rules in splash-transitions.css/narrative.css), so they always fill
 * the actual current viewport with no gap regardless of how stale this value is mid-session.
 *
 * @returns {void}
 */
function updateStableViewportHeight() {
    largestObservedViewportHeight = Math.max(largestObservedViewportHeight, window.innerHeight);

    const useStableMobileViewport = window.matchMedia(COARSE_POINTER_QUERY).matches;
    const viewportHeight = useStableMobileViewport ? `${largestObservedViewportHeight}px` : `${window.innerHeight}px`;

    document.body.style.setProperty('--story-viewport-height', viewportHeight);
}

/**
 * Forgets the tracked large-viewport height so a genuine resize (not a toolbar retraction)
 * can establish a new baseline instead of keeping a stale, larger value.
 *
 * @returns {void}
 */
function resetStableViewportHeightTracking() {
    largestObservedViewportHeight = 0;
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
