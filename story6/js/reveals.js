/**
 * Initializes lightweight, non-pinned Story 6 reveal effects.
 *
 * @param {boolean} prefersReducedMotion Whether the user has requested reduced motion
 * @returns {void}
 */
export function setupContentReveals(prefersReducedMotion) {
  setupIllustrationReveals(prefersReducedMotion);
  setupTakeawayReveal(prefersReducedMotion);
}

/**
 * Reveals narrative illustrations once as they enter the viewport.
 *
 * @param {boolean} prefersReducedMotion Whether the user has requested reduced motion
 * @returns {void}
 */
function setupIllustrationReveals(prefersReducedMotion) {
  const illustrations = document.querySelectorAll('.story-illustration');

  if (prefersReducedMotion || !('IntersectionObserver' in window) || illustrations.length === 0) {
    return;
  }

  document.body.classList.add('illustration-reveals-enabled');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -10%' },
  );

  illustrations.forEach((illustration) => observer.observe(illustration));
}

/**
 * Animates the tissue-comparison takeaway while it is in view.
 *
 * @param {boolean} prefersReducedMotion Whether the user has requested reduced motion
 * @returns {void}
 */
function setupTakeawayReveal(prefersReducedMotion) {
  const takeaway = document.querySelector('.tissue-comparison__takeaway');

  if (prefersReducedMotion || !('IntersectionObserver' in window) || !takeaway) {
    return;
  }

  document.body.classList.add('takeaway-reveal-enabled');

  const observer = new IntersectionObserver(
    ([entry]) => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    },
    { threshold: 0.2, rootMargin: '-5% 0px' },
  );

  observer.observe(takeaway);
}
