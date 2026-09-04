const story4MotionQuery = window.matchMedia(
    "(prefers-reduced-motion: no-preference) and (min-height: 30.01rem)",
);
const story4ReducedTransparency = window.matchMedia("(prefers-reduced-transparency: reduce)");
const story4ForcedColors = window.matchMedia("(forced-colors: active)");

/**
 * Updates the document classes used by Story 4's enhanced and linear layouts.
 *
 * @param {boolean} enabled Whether scroll-driven motion may run
 * @returns {void}
 */
function setStory4MotionMode(enabled) {
    const root = document.documentElement;

    window.hraStory4MotionEnabled = enabled;
    root.classList.toggle("story4-motion-enabled", enabled);
    root.classList.toggle("story4-flowing", !enabled);
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

    if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach((trigger) => trigger.kill(true));
    }

    if (window.gsap) {
        window.gsap.globalTimeline.clear();
    }

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

    if (!window.hraStory4MotionEnabled) {
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
