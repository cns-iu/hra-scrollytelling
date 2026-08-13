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
            target.focus({ preventScroll: true });
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        });
    });
};
