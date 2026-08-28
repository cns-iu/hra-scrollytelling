const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Initializes lightweight, non-pinned Story 6 reveal effects.
 *
 * @returns {void}
 */
export function setupContentReveals() {
    setupIllustrationReveals();
    setupCdeComparisonReveal();
}

/**
 * Reveals narrative illustrations once while following live motion preferences.
 *
 * @returns {void}
 */
function setupIllustrationReveals() {
    const illustrations = document.querySelectorAll('.story-illustration');

    if (!('IntersectionObserver' in window) || illustrations.length === 0) {
        return;
    }

    const motionPreference = window.matchMedia(REDUCED_MOTION_QUERY);
    let observer = null;

    const disableReveals = () => {
        document.body.classList.remove('illustration-reveals-enabled');
        observer?.disconnect();
        observer = null;
    };

    const enableReveals = () => {
        if (observer) {
            return;
        }

        document.body.classList.add('illustration-reveals-enabled');
        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer?.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -10%' },
        );

        illustrations.forEach((illustration) => observer.observe(illustration));
    };

    const syncRevealState = () => {
        if (motionPreference.matches) {
            disableReveals();
        } else {
            enableReveals();
        }
    };

    syncRevealState();

    if (typeof motionPreference.addEventListener === 'function') {
        motionPreference.addEventListener('change', syncRevealState);
    } else {
        motionPreference.addListener(syncRevealState);
    }
}

/**
 * Reveals the two cell networks and their shared legend as one coordinated group.
 *
 * @returns {void}
 */
function setupCdeComparisonReveal() {
    const comparison = document.querySelector('.cde-network-comparison');

    if (!comparison || !('IntersectionObserver' in window)) {
        return;
    }

    const motionPreference = window.matchMedia(REDUCED_MOTION_QUERY);
    let observer = null;

    const disableReveal = () => {
        document.body.classList.remove('cde-comparison-reveals-enabled');
        observer?.disconnect();
        observer = null;
    };

    const enableReveal = () => {
        if (observer || comparison.classList.contains('is-visible')) {
            return;
        }

        document.body.classList.add('cde-comparison-reveals-enabled');
        observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry?.isIntersecting) {
                    return;
                }

                comparison.classList.add('is-visible');
                observer?.disconnect();
                observer = null;
            },
            { threshold: 0.15, rootMargin: '0px 0px -10%' },
        );
        observer.observe(comparison);
    };

    const syncRevealState = () => {
        if (motionPreference.matches) {
            disableReveal();
        } else {
            enableReveal();
        }
    };

    syncRevealState();

    if (typeof motionPreference.addEventListener === 'function') {
        motionPreference.addEventListener('change', syncRevealState);
    } else {
        motionPreference.addListener(syncRevealState);
    }
}
