/**
 * Initializes Story 6 utility links.
 *
 * @returns {void}
 */
export function setupStoryUi() {
  setupBackToTop();
}

/**
 * Makes the footer's back-to-top action immediate and predictable.
 *
 * @returns {void}
 */
function setupBackToTop() {
  const link = document.querySelector('.story-footer__back-to-top');
  const target = link ? document.querySelector(link.hash) : null;

  if (!link || !target) {
    return;
  }

  link.addEventListener('click', (event) => {
    event.preventDefault();
    target.focus({ preventScroll: true });
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  });
}
