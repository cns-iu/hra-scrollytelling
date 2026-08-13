const DEFAULT_PRELOAD_MARGIN = '300% 0px';
const CONSTRAINED_PRELOAD_MARGIN = '100% 0px';

/**
 * Loads tissue maps before their comparison enters view and decodes them sequentially.
 *
 * @returns {void}
 */
export function setupTissueImagePreparation() {
  const comparison = document.querySelector('.tissue-comparison');
  const preloadTarget = document.querySelector('.transition2') ?? comparison;
  const images = Array.from(comparison?.querySelectorAll('.tissue-sample img') ?? []);

  if (!preloadTarget || images.length === 0) {
    return;
  }

  const prepareImages = () => {
    images.forEach((image) => {
      image.loading = 'eager';
    });

    void decodeImagesSequentially(images);
  };

  if (!('IntersectionObserver' in window)) {
    prepareImages();
    return;
  }

  const connection = navigator.connection;
  const constrainedConnection = connection?.saveData || connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g';
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        return;
      }

      observer.disconnect();
      prepareImages();
    },
    { rootMargin: constrainedConnection ? CONSTRAINED_PRELOAD_MARGIN : DEFAULT_PRELOAD_MARGIN },
  );

  observer.observe(preloadTarget);
}

/**
 * Decodes images one at a time to avoid a burst of competing main-thread work.
 *
 * @param {HTMLImageElement[]} images Images to decode in reading order
 * @returns {Promise<void>} Resolves after every available image has decoded or failed safely
 */
async function decodeImagesSequentially(images) {
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
 * Waits until one image has loaded or failed.
 *
 * @param {HTMLImageElement} image Image whose request should settle
 * @returns {Promise<void>} Resolves after the image load request settles
 */
function waitForImageLoad(image) {
  if (image.complete) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    image.addEventListener('load', resolve, { once: true });
    image.addEventListener('error', resolve, { once: true });
  });
}
