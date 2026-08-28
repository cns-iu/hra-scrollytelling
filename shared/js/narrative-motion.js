(function () {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reducedTransparency = window.matchMedia('(prefers-reduced-transparency: reduce)');
    const forcedColors = window.matchMedia('(forced-colors: active)');
    const supportedViewport = window.matchMedia(
        '(min-width: 48.01rem) and (min-height: 40.01rem)'
    );

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
        if (!window.hraStoryMotionEnabled) {
            makeNarrativeMediaUserControlled();
        }
    });

    reducedMotion.addEventListener('change', () => applyNarrativeMode(false));
    reducedTransparency.addEventListener('change', () => applyNarrativeMode(false));
    forcedColors.addEventListener('change', () => applyNarrativeMode(false));
    supportedViewport.addEventListener('change', (event) => {
        if (!event.matches) {
            applyNarrativeMode(false);
        }
    });
})();
