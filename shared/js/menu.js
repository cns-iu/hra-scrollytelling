// Progressive enhancement for each native shared Menu disclosure.
export const initializeSiteMenus = () => {
    document.querySelectorAll('[data-site-menu]').forEach((menu) => {
        const summary = menu.querySelector(':scope > summary');
        const panel = menu.querySelector('[data-site-menu-panel]');
        const closeButton = menu.querySelector('[data-site-menu-close]');

        if (!summary || !panel || !closeButton) {
            return;
        }

        const closeMenu = ({ restoreFocus = true } = {}) => {
            if (!menu.open) {
                return;
            }

            menu.open = false;

            if (restoreFocus) {
                summary.focus();
            }
        };

        menu.addEventListener('toggle', () => {
            if (menu.open) {
                window.requestAnimationFrame(() => panel.focus());
            }
        });

        closeButton.addEventListener('click', () => closeMenu());

        panel.querySelectorAll('a[href]').forEach((link) => {
            link.addEventListener('click', () => closeMenu({ restoreFocus: false }));
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && menu.open) {
                event.preventDefault();
                closeMenu();
            }
        });

        document.addEventListener('pointerdown', (event) => {
            if (menu.open && !menu.contains(event.target)) {
                closeMenu({ restoreFocus: false });
            }
        });

        menu.dataset.enhanced = '';
    });
};
