(function () {
    const { QUERY, setMotionState, haltAnimation, stabilizeScrollGeometry } = window.hraMotionPreferences;
    const reducedMotion = window.matchMedia(QUERY.reducedMotion);
    const reducedTransparency = window.matchMedia(QUERY.reducedTransparency);
    const forcedColors = window.matchMedia(QUERY.forcedColors);
    const supportedViewport = window.matchMedia(QUERY.supportedViewport);
    const coarsePointer = window.matchMedia(QUERY.coarsePointer);

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
        haltAnimation();
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

        setMotionState({
            flag: 'hraStoryMotionEnabled',
            enabledClass: 'story-motion-enabled',
            flowingClass: 'story-flowing',
            enabled: canEnhance,
        });

        if (!canEnhance && document.readyState !== 'loading') {
            stopNarrativeMotion();
        }
    }

    applyNarrativeMode(true);

    document.addEventListener('DOMContentLoaded', () => {
        if (window.hraStoryMotionEnabled && (!window.gsap || !window.ScrollTrigger)) {
            applyNarrativeMode(false);
        } else {
            stabilizeScrollGeometry({ onUnsupportedViewport: () => applyNarrativeMode(false) });
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
