/*
 * Shared motion-preference primitives.
 *
 * shared/js/narrative-motion.js (Stories 2, 3 and 5) and story/4/js/motion.js
 * each gate scroll animation on the same user and viewport preferences, toggle
 * an enabled/flowing class pair, and tear down GSAP the same way. That common
 * core lives here; each caller keeps only what is genuinely its own - narrative
 * media handling for the shared gate, SMIL pausing and the ambient-animation
 * toggle for Story 4.
 *
 * Loaded as a classic script before its consumers.
 */
window.hraMotionPreferences = (() => {
    const QUERY = {
        reducedMotion: '(prefers-reduced-motion: reduce)',
        noPreferenceMotion: '(prefers-reduced-motion: no-preference)',
        reducedTransparency: '(prefers-reduced-transparency: reduce)',
        forcedColors: '(forced-colors: active)',
        supportedViewport: '(min-height: 30.01rem)',
        coarsePointer: '(pointer: coarse)',
    };

    /**
     * Publishes the current motion mode as a global flag and a class pair.
     *
     * @param {object} options Motion state
     * @param {string} options.flag Global flag name story runtimes read
     * @param {string} options.enabledClass Class applied while motion may run
     * @param {string} options.flowingClass Class applied for the linear layout
     * @param {boolean} options.enabled Whether scroll-driven motion may run
     * @returns {void}
     */
    function setMotionState({ flag, enabledClass, flowingClass, enabled }) {
        const root = document.documentElement;

        window[flag] = enabled;
        root.classList.toggle(enabledClass, enabled);
        root.classList.toggle(flowingClass, !enabled);
    }

    /**
     * Tears down every active GSAP timeline and ScrollTrigger.
     *
     * @returns {void}
     */
    function haltAnimation() {
        if (window.ScrollTrigger) {
            window.ScrollTrigger.getAll().forEach((trigger) => trigger.kill(true));
        }

        if (window.gsap) {
            window.gsap.globalTimeline.clear();
        }
    }

    /**
     * Ignores height-only mobile browser chrome resizes while preserving orientation refreshes.
     *
     * Mobile browsers fire `resize` when their chrome collapses on scroll, which
     * makes ScrollTrigger recompute pinned geometry mid-scroll and jump. Only a
     * real width change is treated as a layout change.
     *
     * @param {object} options Stabilization hooks
     * @param {() => void} options.onUnsupportedViewport Called when the viewport
     *     becomes too short for the enhanced layout
     * @returns {void}
     */
    function stabilizeScrollGeometry({ onUnsupportedViewport }) {
        const coarsePointer = window.matchMedia(QUERY.coarsePointer);
        const supportedViewport = window.matchMedia(QUERY.supportedViewport);
        let coarseViewportWidth = window.innerWidth;
        let coarseResizeFrame = 0;

        /**
         * Refreshes pinned geometry after a real coarse-pointer width change.
         *
         * @returns {void}
         */
        function refreshAfterCoarseWidthChange() {
            if (window.innerWidth === coarseViewportWidth) {
                return;
            }

            coarseViewportWidth = window.innerWidth;

            if (!supportedViewport.matches) {
                onUnsupportedViewport();
                return;
            }

            if (!window.ScrollTrigger) {
                return;
            }

            window.cancelAnimationFrame(coarseResizeFrame);
            coarseResizeFrame = window.requestAnimationFrame(() => {
                window.ScrollTrigger.refresh();
            });
        }

        if (coarsePointer.matches && window.ScrollTrigger) {
            window.ScrollTrigger.config({
                autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
            });
            window.addEventListener('resize', refreshAfterCoarseWidthChange, { passive: true });
        }
    }

    return { QUERY, setMotionState, haltAnimation, stabilizeScrollGeometry };
})();
