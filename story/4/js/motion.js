const { QUERY, setMotionState, haltAnimation, stabilizeScrollGeometry } = window.hraMotionPreferences;
const story4MotionQuery = window.matchMedia(
    `${QUERY.noPreferenceMotion} and ${QUERY.supportedViewport}`,
);
const story4ReducedTransparency = window.matchMedia(QUERY.reducedTransparency);
const story4ForcedColors = window.matchMedia(QUERY.forcedColors);

/**
 * Updates the document classes used by Story 4's enhanced and linear layouts.
 *
 * @param {boolean} enabled Whether scroll-driven motion may run
 * @returns {void}
 */
function setStory4MotionMode(enabled) {
    setMotionState({
        flag: 'hraStory4MotionEnabled',
        enabledClass: 'story4-motion-enabled',
        flowingClass: 'story4-flowing',
        enabled,
    });
}

/**
 * Pauses inline SVG animation when Story 4 is using its static presentation.
 *
 * @returns {void}
 */
function pauseStory4SvgAnimation() {
    document.querySelectorAll("svg").forEach((svg) => {
        if (typeof svg.pauseAnimations === "function") {
            svg.pauseAnimations();
        }
    });
}

/**
 * Stops active Story 4 timelines and exposes the static document layout.
 *
 * @returns {void}
 */
function stopStory4Motion() {
    setStory4MotionMode(false);
    haltAnimation();
    pauseStory4SvgAnimation();
}

/**
 * Synchronizes the ambient-animation toggle's visible and accessible state.
 *
 * @param {HTMLButtonElement} button Story 4's ambient-animation toggle
 * @param {boolean} hidden Whether ambient animation is hidden
 * @returns {void}
 */
function updateAmbientToggle(button, hidden) {
    document.documentElement.classList.toggle("story4-ambient-hidden", hidden);
    button.setAttribute("aria-pressed", String(hidden));
    button.textContent = hidden ? "Show ambient animation" : "Hide ambient animation";
}

setStory4MotionMode(
    story4MotionQuery.matches &&
    !story4ReducedTransparency.matches &&
    !story4ForcedColors.matches,
);

document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector("[data-story4-ambient-toggle]");

    if (window.hraStory4MotionEnabled) {
        stabilizeScrollGeometry({ onUnsupportedViewport: stopStory4Motion });
    } else {
        pauseStory4SvgAnimation();
    }

    if (!(button instanceof HTMLButtonElement)) {
        return;
    }

    updateAmbientToggle(button, false);
    button.addEventListener("click", () => {
        updateAmbientToggle(button, button.getAttribute("aria-pressed") !== "true");
    });
});

story4MotionQuery.addEventListener("change", (event) => {
    if (!event.matches) {
        stopStory4Motion();
    }
});

[story4ReducedTransparency, story4ForcedColors].forEach((query) => {
    query.addEventListener("change", (event) => {
        if (event.matches) {
            stopStory4Motion();
        }
    });
});
