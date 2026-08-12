/**
 * Initializes Story 6 navigation and utility links.
 *
 * @returns {void}
 */
export function setupStoryUi() {
  setupStoryNavigation();
  setupBackToTop();
}

/**
 * Initializes the accessible story-navigation menu.
 *
 * @returns {void}
 */
function setupStoryNavigation() {
  const navigation = document.querySelector('.dropdown');
  const button = navigation?.querySelector('.dropbtn');

  if (!navigation || !button) {
    return;
  }

  /**
   * Updates the menu state visually and for assistive technology.
   *
   * @param {boolean} isOpen Whether the navigation should be open
   * @returns {void}
   */
  function setOpen(isOpen) {
    navigation.classList.toggle('is-open', isOpen);
    button.setAttribute('aria-expanded', String(isOpen));
    button.setAttribute('aria-label', `${isOpen ? 'Close' : 'Open'} story navigation`);
  }

  button.addEventListener('click', () => {
    setOpen(button.getAttribute('aria-expanded') !== 'true');
  });

  navigation.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setOpen(false);
      button.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (!navigation.contains(event.target)) {
      setOpen(false);
    }
  });
}

/**
 * Makes the footer's back-to-top action immediate and predictable.
 *
 * @returns {void}
 */
function setupBackToTop() {
  const link = document.querySelector('.story-footer__back-to-top');

  link?.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  });
}
