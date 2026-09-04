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
 * Wires a scroll reveal that follows live motion preferences.
 *
 * Both Story 6 reveals share this scaffolding: an enabling class on the body,
 * an IntersectionObserver created only while motion is allowed, and a live
 * `change` subscription so toggling the preference takes effect immediately.
 * They differ only in what they observe and when the observer is finished.
 *
 * @param {object} options Reveal configuration
 * @param {Element[]} options.targets Elements to observe
 * @param {string} options.bodyClass Class marking the reveal as enabled
 * @param {boolean} [options.disconnectOnFirst] Stop after the first intersection
 *     instead of unobserving each target individually
 * @param {() => boolean} [options.alreadyRevealed] Skip re-arming when true
 * @returns {void}
 */
function createScrollReveal({ targets, bodyClass, disconnectOnFirst = false, alreadyRevealed }) {
    if (!('IntersectionObserver' in window) || targets.length === 0) {
        return;
    }

    const motionPreference = window.matchMedia(REDUCED_MOTION_QUERY);
    let observer = null;

    const disableReveal = () => {
        document.body.classList.remove(bodyClass);
        observer?.disconnect();
        observer = null;
    };

    const enableReveal = () => {
        if (observer || alreadyRevealed?.()) {
            return;
        }

        document.body.classList.add(bodyClass);
        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add('is-visible');

                    if (disconnectOnFirst) {
                        observer?.disconnect();
                        observer = null;
                    } else {
                        observer?.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -10%' },
        );

        targets.forEach((target) => observer.observe(target));
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

/**
 * Reveals narrative illustrations once while following live motion preferences.
 *
 * @returns {void}
 */
function setupIllustrationReveals() {
    createScrollReveal({
        targets: [...document.querySelectorAll('.story-illustration')],
        bodyClass: 'illustration-reveals-enabled',
    });
}

/**
 * Reveals the two cell networks and their shared legend as one coordinated group.
 *
 * @returns {void}
 */
function setupCdeComparisonReveal() {
    const comparison = document.querySelector('.cde-network-comparison');

    createScrollReveal({
        targets: comparison ? [comparison] : [],
        bodyClass: 'cde-comparison-reveals-enabled',
        disconnectOnFirst: true,
        alreadyRevealed: () => comparison.classList.contains('is-visible'),
    });
}
