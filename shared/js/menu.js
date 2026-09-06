/*
 * Publishes the page's usable width as --site-viewport-width.
 *
 * 100vw includes the classic scrollbar, so a panel sized from it overhangs the
 * page and scrolls it sideways. documentElement.clientWidth is the width the
 * content actually gets. navigation.css falls back to 100vw when this has not
 * run, so the panel stays usable without JavaScript.
 */
const publishViewportWidth = () => {
    const set = () => document.documentElement.style.setProperty(
        '--site-viewport-width',
        `${document.documentElement.clientWidth}px`,
    );

    set();
    window.addEventListener('resize', set, { passive: true });
    window.addEventListener('orientationchange', set, { passive: true });
};

// Progressive enhancement for each native shared Menu disclosure.
export const initializeSiteMenus = () => {
    publishViewportWidth();

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
                closeMenu();
            }
        });

        menu.dataset.enhanced = '';
    });
};
