(function () {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reducedTransparency = window.matchMedia('(prefers-reduced-transparency: reduce)');
    const forcedColors = window.matchMedia('(forced-colors: active)');
    const supportedViewport = window.matchMedia('(min-height: 30.01rem)');
    const coarsePointer = window.matchMedia('(pointer: coarse)');
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
            applyNarrativeMode(false);
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

    /**
     * Ignores height-only mobile browser chrome resizes while preserving orientation refreshes.
     *
     * @returns {void}
     */
    function stabilizeMobileScrollGeometry() {
        if (coarsePointer.matches && window.ScrollTrigger) {
            window.ScrollTrigger.config({
                autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
            });
            window.addEventListener('resize', refreshAfterCoarseWidthChange, { passive: true });
        }
    }

    /**
     * Makes autoplaying narrative media user-controlled in the flowing layout.
     *
     * @returns {void}
     */
    function makeNarrativeMediaUserControlled() {
        document.querySelectorAll('.story-narrative video').forEach((video) => {
            video.autoplay = false;
            video.controls = true;
            video.pause();
        });
    }

    /**
     * Stops active scroll animation when user or viewport settings require flow.
     *
     * @returns {void}
     */
    function stopNarrativeMotion() {
        if (window.ScrollTrigger) {
            window.ScrollTrigger.getAll().forEach((trigger) => trigger.kill(true));
        }

        if (window.gsap) {
            window.gsap.globalTimeline.clear();
        }

        makeNarrativeMediaUserControlled();
    }

    /**
     * Applies the appropriate narrative mode for the current user preferences.
     *
     * @param {boolean} allowEnhancement Whether an enhanced layout can be activated
     * @returns {void}
     */
    function applyNarrativeMode(allowEnhancement) {
        const canEnhance =
            allowEnhancement &&
            !reducedMotion.matches &&
            !reducedTransparency.matches &&
            !forcedColors.matches &&
            supportedViewport.matches;

        window.hraStoryMotionEnabled = canEnhance;
        root.classList.toggle('story-motion-enabled', canEnhance);
        root.classList.toggle('story-flowing', !canEnhance);

        if (!canEnhance && document.readyState !== 'loading') {
            stopNarrativeMotion();
        }
    }

    applyNarrativeMode(true);

    document.addEventListener('DOMContentLoaded', () => {
        if (window.hraStoryMotionEnabled && (!window.gsap || !window.ScrollTrigger)) {
            applyNarrativeMode(false);
        } else {
            stabilizeMobileScrollGeometry();
        }

        if (!window.hraStoryMotionEnabled) {
            makeNarrativeMediaUserControlled();
        }
    });

    reducedMotion.addEventListener('change', () => applyNarrativeMode(false));
    reducedTransparency.addEventListener('change', () => applyNarrativeMode(false));
    forcedColors.addEventListener('change', () => applyNarrativeMode(false));
    supportedViewport.addEventListener('change', (event) => {
        if (!event.matches && !coarsePointer.matches) {
            applyNarrativeMode(false);
        }
    });
})();
