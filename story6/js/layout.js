const RESIZE_SETTLE_DELAY = 250;

/**
 * Configures stable ScrollTrigger measurement and responsive refresh behavior.
 *
 * @param {object|null} ScrollTrigger GSAP ScrollTrigger plugin, or null when unavailable
 * @returns {void}
 */
export function setupLayoutStability(ScrollTrigger) {
  updateStableViewportHeight();
  setupSettledResizeRefresh(ScrollTrigger);

  if (!ScrollTrigger) {
    return;
  }

  ScrollTrigger.config({
    ignoreMobileResize: true,
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
  });

  setupInitialLayoutRefresh(ScrollTrigger);
}

/**
 * Refreshes the measured layout after fonts and page assets settle.
 *
 * @param {object} ScrollTrigger GSAP ScrollTrigger plugin
 * @returns {void}
 */
function setupInitialLayoutRefresh(ScrollTrigger) {
  const refreshInitialLayout = async () => {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    await nextPaint();
    ScrollTrigger.refresh();
  };

  if (document.readyState === 'complete') {
    void refreshInitialLayout();
    return;
  }

  window.addEventListener('load', refreshInitialLayout, { once: true });
}

/**
 * Debounces resize measurement so pinned scenes are not rebuilt every frame.
 *
 * @param {object|null} ScrollTrigger GSAP ScrollTrigger plugin, or null when unavailable
 * @returns {void}
 */
function setupSettledResizeRefresh(ScrollTrigger) {
  const coarsePointer = window.matchMedia('(hover: none) and (pointer: coarse)');
  let previousWidth = window.innerWidth;
  let resizeTimer;

  window.addEventListener('resize', () => {
    const currentWidth = window.innerWidth;
    const widthChanged = Math.abs(currentWidth - previousWidth) > 1;

    if (coarsePointer.matches && !widthChanged) {
      return;
    }

    previousWidth = currentWidth;
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(async () => {
      updateStableViewportHeight();
      await nextPaint();
      ScrollTrigger?.refresh();
    }, RESIZE_SETTLE_DELAY);
  });
}

/**
 * Stores a viewport height that changes only when responsive layout has settled.
 *
 * @returns {void}
 */
function updateStableViewportHeight() {
  document.body.style.setProperty('--story-viewport-height', `${window.innerHeight}px`);
}

/**
 * Waits until the browser has completed the next layout and paint cycle.
 *
 * @returns {Promise<void>} A promise resolved after two animation frames
 */
function nextPaint() {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(resolve));
  });
}
