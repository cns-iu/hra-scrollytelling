// Accessible disclosure behavior for the landing-page navigation panel.
export const initializeSiteMenu = () => {
    const controls = document.querySelector('.site-controls');
    const panel = document.querySelector('#site-menu');
    const menuButton = document.querySelector('.site-controls-toggle');
    const closeButton = document.querySelector('.site-controls-close');

    if (!controls || !panel || !menuButton || !closeButton) {
        return;
    }

    const isMenuOpen = () => menuButton.getAttribute('aria-expanded') === 'true';

    const openMenu = () => {
        panel.hidden = false;
        menuButton.setAttribute('aria-expanded', 'true');
        window.requestAnimationFrame(() => panel.focus());
    };

    const closeMenu = ({ restoreFocus = true } = {}) => {
        if (!isMenuOpen()) {
            return;
        }

        panel.hidden = true;
        menuButton.setAttribute('aria-expanded', 'false');

        if (restoreFocus) {
            menuButton.focus();
        }
    };

    menuButton.addEventListener('click', () => {
        if (isMenuOpen()) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    closeButton.addEventListener('click', () => closeMenu());

    panel.querySelectorAll('a[href]').forEach((link) => {
        link.addEventListener('click', () => closeMenu({ restoreFocus: false }));
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isMenuOpen()) {
            event.preventDefault();
            closeMenu();
        }
    });

    document.addEventListener('pointerdown', (event) => {
        if (isMenuOpen() && !controls.contains(event.target)) {
            closeMenu();
        }
    });

    panel.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.hidden = false;
};
