/**
 * Enhances footer links so returning to the page start also moves keyboard focus.
 *
 * @returns {void}
 */
export const initializeBackToTopLinks = () => {
    document.querySelectorAll('[data-back-to-top]').forEach((link) => {
        const target = document.querySelector(link.hash);

        if (!target) {
            return;
        }

        link.addEventListener('click', (event) => {
            event.preventDefault();
            const root = document.documentElement;
            const previousScrollBehavior = root.style.scrollBehavior;

            root.style.scrollBehavior = 'auto';

            try {
                target.focus({ preventScroll: true });
                window.scrollTo(0, 0);
            } finally {
                root.style.scrollBehavior = previousScrollBehavior;
            }
        });
    });
};
