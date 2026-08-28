const story5MediaSequences = [
    { video: "sample", previous: "scrollupto1", next: "scrollto1" },
    { video: "sample2", previous: "scrollupto2", next: "scrollto3" },
    { video: "sample3", previous: "scrollupto3", next: "scrollto5" },
    { video: "sample4", previous: "scrollupto4", next: "scrollto7" },
    { video: "sample5", previous: "scrollupto5", next: "scrollto9" },
    { video: "sample6", previous: "scrollupto6", next: "scrollto11" },
];

const story5MediaObserver = "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const video = entry.target;

                if (!(video instanceof HTMLVideoElement)) {
                    return;
                }

                if (
                    entry.isIntersecting &&
                    entry.intersectionRatio >= 0.6 &&
                    window.hraStoryMotionEnabled &&
                    video.dataset.userPaused !== "true"
                ) {
                    video.play().catch(() => {
                        const toggle = video.closest(".vid")?.querySelector(
                            '[data-story5-action="toggle"]',
                        );

                        video.controls = true;
                        if (toggle instanceof HTMLButtonElement) {
                            updateStory5MediaToggle(toggle, video);
                        }
                    });
                } else {
                    video.pause();
                }
            });
        },
        { threshold: [0, 0.6] },
    )
    : null;

/**
 * Scrolls a story anchor into view without replacing native page scrolling.
 *
 * @param {string} id Target element ID
 * @param {ScrollLogicalPosition} block Vertical alignment for the target
 * @returns {void}
 */
function scrollToStory5Target(id, block) {
    document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block,
        inline: "nearest",
    });
}

/**
 * Updates the media toggle to describe the action it will perform.
 *
 * @param {HTMLButtonElement} button Media play/pause toggle
 * @param {HTMLVideoElement} video Controlled video
 * @returns {void}
 */
function updateStory5MediaToggle(button, video) {
    const isPaused = video.paused || video.ended;

    button.textContent = isPaused ? "Play animation" : "Pause animation";
    button.setAttribute("aria-pressed", String(isPaused));
}

story5MediaSequences.forEach((sequence) => {
    const video = document.getElementById(sequence.video);
    const container = video?.closest(".vid");
    const previousButton = container?.querySelector('[data-story5-action="previous"]');
    const nextButton = container?.querySelector('[data-story5-action="next"]');
    const replayButton = container?.querySelector('[data-story5-action="replay"]');
    const toggleButton = container?.querySelector('[data-story5-action="toggle"]');

    if (
        !(video instanceof HTMLVideoElement) ||
        !(previousButton instanceof HTMLButtonElement) ||
        !(nextButton instanceof HTMLButtonElement) ||
        !(replayButton instanceof HTMLButtonElement) ||
        !(toggleButton instanceof HTMLButtonElement)
    ) {
        return;
    }

    toggleButton.setAttribute("aria-controls", video.id);
    previousButton.addEventListener("click", () => {
        scrollToStory5Target(sequence.previous, "end");
    });
    nextButton.addEventListener("click", () => {
        scrollToStory5Target(sequence.next, "end");
    });
    replayButton.addEventListener("click", () => {
        video.dataset.userPaused = "false";
        video.currentTime = 0;
        video.play().catch(() => updateStory5MediaToggle(toggleButton, video));
    });
    toggleButton.addEventListener("click", () => {
        if (video.paused || video.ended) {
            video.dataset.userPaused = "false";
            video.play().catch(() => updateStory5MediaToggle(toggleButton, video));
        } else {
            video.dataset.userPaused = "true";
            video.pause();
        }
    });

    ["play", "pause", "ended"].forEach((eventName) => {
        video.addEventListener(eventName, () => {
            updateStory5MediaToggle(toggleButton, video);
        });
    });
    if (window.hraStoryMotionEnabled && story5MediaObserver) {
        video.controls = false;
        story5MediaObserver.observe(video);
    } else {
        video.controls = true;
    }
    updateStory5MediaToggle(toggleButton, video);
});
