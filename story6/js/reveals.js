/**
 * Initializes lightweight, non-pinned Story 6 reveal effects.
 *
 * @param {boolean} prefersReducedMotion Whether the user has requested reduced motion
 * @returns {void}
 */
export function setupContentReveals(prefersReducedMotion) {
  setupIllustrationReveals(prefersReducedMotion);
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
