const storyRoot = document.querySelector('#one');
const controlContainer = storyRoot?.querySelector('[data-story-motion-control-container]');
const control = storyRoot?.querySelector('[data-story-motion-control]');
const controlLabel = control?.querySelector('[data-story-motion-control-label]');
const videos = storyRoot ? [...storyRoot.querySelectorAll('[data-story-motion="video"]')] : [];
const animatedGifs = storyRoot ? [...storyRoot.querySelectorAll('[data-story-motion="gif"]')] : [];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/**
 * Replaces an animated GIF with a canvas-captured still of its current frame
 *
 * @param {HTMLImageElement} image Animated GIF to freeze
 * @returns {void}
 */
const freezeGif = (image) => {
    const source = image.dataset.motionSource || image.getAttribute('src');

    if (!source || image.dataset.motionFrame === 'frozen') {
        return;
    }

    image.dataset.motionSource = source;

    if (!image.complete || image.naturalWidth === 0 || image.naturalHeight === 0) {
        if (image.dataset.motionFrame !== 'waiting') {
            image.dataset.motionFrame = 'waiting';
            image.addEventListener('load', () => {
                if (storyRoot?.dataset.motionState === 'paused') {
                    freezeGif(image);
                }
            }, { once: true });
        }
        return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d');

    if (!context) {
        return;
    }

    try {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        image.src = canvas.toDataURL('image/png');
        image.dataset.motionFrame = 'frozen';
    } catch {
        // The paused-state CSS keeps the GIF hidden if a browser cannot capture it safely.
    }
};

/**
 * Restores a frozen GIF to its original animated source
 *
 * @param {HTMLImageElement} image GIF image to restore
 * @returns {void}
 */
const restoreGif = (image) => {
    const source = image.dataset.motionSource;

    delete image.dataset.motionFrame;

    if (source && image.getAttribute('src') !== source) {
        image.src = source;
    }
};

/**
 * Synchronizes the page-level motion state, control label, animated GIF visibility, and video playback
 *
 * @param {boolean} isPaused Whether Story 1 motion should be paused or hidden
 * @returns {void}
 */
const setMotionPaused = (isPaused) => {
    if (!storyRoot || !control || !controlLabel) {
        return;
    }

    if (isPaused) {
        animatedGifs.forEach(freezeGif);
    } else {
        storyRoot.dataset.motionState = 'running';
        animatedGifs.forEach(restoreGif);
    }

    storyRoot.dataset.motionState = isPaused ? 'paused' : 'running';
    controlLabel.textContent = isPaused ? 'Resume animations' : 'Pause animations';

    videos.forEach((video) => {
        if (isPaused) {
            video.pause();
            return;
        }

        video.play().catch(() => {
            // Muted inline autoplay can still be blocked by browser or user preferences.
        });
    });
};

if (storyRoot && controlContainer && control) {
    controlContainer.hidden = false;
    setMotionPaused(reducedMotion.matches);

    control.addEventListener('click', () => {
        setMotionPaused(storyRoot.dataset.motionState !== 'paused');
    });

    reducedMotion.addEventListener?.('change', (event) => {
        if (event.matches) {
            setMotionPaused(true);
        }
    });
}
