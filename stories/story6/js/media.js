const FAR_PRELOAD_MARGIN = '150% 0px';
const NEAR_PRELOAD_MARGIN = '75% 0px';
const CONSERVATIVE_PRELOAD_MARGIN = '50% 0px';
const DESTINATION_SETTLE_DELAY = 120;
const DESTINATION_POLL_DELAY = 1000;
const destinationChecks = new Set();
let destinationTimer;

/**
 * Stages Story 6 image requests by narrative sequence instead of requesting every layer at startup.
 *
 * @returns {void}
 */
export function setupStoryImagePreparation() {
    setupMouseImagePreparation();
    setupTissueImagePreparation();
    setupTutorialImagePreparation();
}

/**
 * Loads and decodes the mouse base and organ layers before the mouse transition completes.
 *
 * @returns {void}
 */
function setupMouseImagePreparation() {
    prepareWhenNear({
        targets: [document.querySelector('.transition1'), document.querySelector('.section3')],
        images: Array.from(document.querySelectorAll('.mouse-image img')),
        rootMargin: getConnectionAwareMargin(FAR_PRELOAD_MARGIN),
    });
}

/**
 * Loads one organ comparison at a time, with the first prepared from the preceding transition.
 *
 * @returns {void}
 */
function setupTissueImagePreparation() {
    const comparisons = Array.from(document.querySelectorAll('.organ-comparison'));

    comparisons.forEach((comparison, index) => {
        prepareWhenNear({
            targets: index === 0 ? [document.querySelector('.transition2'), comparison] : [comparison],
            images: Array.from(comparison.querySelectorAll('.tissue-sample img')),
            rootMargin: getConnectionAwareMargin(index === 0 ? FAR_PRELOAD_MARGIN : NEAR_PRELOAD_MARGIN),
        });
    });
}

/**
 * Loads the initial CDE pair ahead of the section, then prepares the remaining frames closer to use.
 *
 * @returns {void}
 */
function setupTutorialImagePreparation() {
    const images = Array.from(document.querySelectorAll('.tutorial-images img'));

    prepareWhenNear({
        targets: [document.querySelector('.transition3'), document.querySelector('.section5')],
        images: images.slice(0, 2),
        rootMargin: getConnectionAwareMargin(FAR_PRELOAD_MARGIN),
    });
    prepareWhenNear({
        targets: [document.querySelector('.setup3'), document.querySelector('.section5')],
        images: images.slice(2),
        rootMargin: getConnectionAwareMargin(NEAR_PRELOAD_MARGIN),
    });
}

/**
 * Prepares a group once an early trigger or its destination approaches.
 *
 * @param {object} options Preparation settings
 * @param {Array<Element|null>} options.targets Elements whose proximity starts preparation
 * @param {HTMLImageElement[]} options.images Images to request and decode in order
 * @param {string} options.rootMargin IntersectionObserver preload margin
 * @returns {void}
 */
function prepareWhenNear({ targets, images, rootMargin }) {
    const observedTargets = targets.filter(Boolean);

    if (observedTargets.length === 0 || images.length === 0) {
        return;
    }

    let prepared = false;
    let observer = null;
    let removeDestinationCheck = () => {};
    const prepare = () => {
        if (prepared) {
            return;
        }

        prepared = true;
        observer?.disconnect();
        removeDestinationCheck();
        void prepareImagesSequentially(images);
    };

    if (!('IntersectionObserver' in window)) {
        prepare();
        return;
    }

    observer = new IntersectionObserver(
        (entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) {
                return;
            }

            prepare();
        },
        { rootMargin },
    );

    observedTargets.forEach((target) => observer.observe(target));
    removeDestinationCheck = registerDestinationCheck(() => {
        const destinationIsVisible = observedTargets.some((target) => {
            const bounds = target.getBoundingClientRect();

            return bounds.bottom >= 0 && bounds.top <= window.innerHeight;
        });

        if (destinationIsVisible) {
            prepare();
        }
    });
}

/**
 * Adds a post-scroll destination check to the module's single debounced listener.
 *
 * @param {() => void} check Proximity check to run after scrolling settles
 * @returns {() => void} Function that unregisters the check
 */
function registerDestinationCheck(check) {
    destinationChecks.add(check);

    if (destinationChecks.size === 1) {
        window.addEventListener('scroll', scheduleDestinationChecks, { passive: true });
    }

    scheduleDestinationChecks();

    return () => {
        destinationChecks.delete(check);

        if (destinationChecks.size === 0) {
            window.removeEventListener('scroll', scheduleDestinationChecks);
            window.clearTimeout(destinationTimer);
        }
    };
}

/**
 * Defers destination geometry reads until scrolling has stopped briefly.
 *
 * @returns {void}
 */
function scheduleDestinationChecks() {
    window.clearTimeout(destinationTimer);
    destinationTimer = window.setTimeout(runDestinationChecks, DESTINATION_SETTLE_DELAY);
}

/**
 * Runs every pending destination check and retains one slow fallback poll while any remain.
 *
 * @returns {void}
 */
function runDestinationChecks() {
    destinationChecks.forEach((check) => check());

    if (destinationChecks.size > 0) {
        destinationTimer = window.setTimeout(runDestinationChecks, DESTINATION_POLL_DELAY);
    }
}

/**
 * Activates one nearby group, then decodes its images one at a time to avoid a main-thread burst.
 *
 * @param {HTMLImageElement[]} images Images to prepare in narrative order
 * @returns {Promise<void>} Resolves after every image has loaded and decoded or failed safely
 */
async function prepareImagesSequentially(images) {
    images.forEach((image) => {
        activateDeferredSource(image);
        image.loading = 'eager';
    });

    for (const image of images) {
        await waitForImageLoad(image);

        if (!image.naturalWidth || typeof image.decode !== 'function') {
            continue;
        }

        try {
            await image.decode();
        } catch {
            // The browser can still render an image when explicit decoding is unavailable.
        }
    }
}

/**
 * Copies staged source attributes onto an image immediately before its request should begin.
 *
 * @param {HTMLImageElement} image Image with optional data-src and data-srcset attributes
 * @returns {void}
 */
function activateDeferredSource(image) {
    if (image.dataset.srcset) {
        image.srcset = image.dataset.srcset;
        delete image.dataset.srcset;
    }

    if (image.dataset.src) {
        image.src = image.dataset.src;
        delete image.dataset.src;
    }
}

/**
 * Waits until one image has loaded or failed.
 *
 * @param {HTMLImageElement} image Image whose request should settle
 * @returns {Promise<void>} Resolves after the image load request settles
 */
function waitForImageLoad(image) {
    if (image.complete && image.currentSrc) {
        return Promise.resolve();
    }

    return new Promise((resolve) => {
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', resolve, { once: true });
    });
}

/**
 * Reduces speculative preload distance for data-saving and slow connections when exposed by the browser.
 *
 * @param {string} preferredMargin Default preload distance
 * @returns {string} Connection-appropriate preload distance
 */
function getConnectionAwareMargin(preferredMargin) {
    const connection = navigator.connection;
    const constrained = connection?.saveData || connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g';

    return constrained ? CONSERVATIVE_PRELOAD_MARGIN : preferredMargin;
}
