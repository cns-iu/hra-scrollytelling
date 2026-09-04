const storyRoot = document.querySelector('#one');
const scaleReveal = storyRoot?.querySelector('[data-story-reveal="scale"]');
const sequenceGroup = storyRoot?.querySelector('[data-story-reveal-group="sequence"]');
const sequenceReveals = sequenceGroup
    ? [...sequenceGroup.querySelectorAll('[data-story-reveal="sequence"]')]
    : [];
const revealTargets = [scaleReveal, ...sequenceReveals].filter(Boolean);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/**
 * Marks one reveal target as visible
 *
 * @param {Element} element Story element to reveal
 * @returns {void}
 */
const revealElement = (element) => {
    element.dataset.revealState = 'revealed';
};

/**
 * Reveals every Story 1 target without waiting for scroll position
 *
 * @returns {void}
 */
const revealAll = () => {
    revealTargets.forEach(revealElement);
};

if (storyRoot && revealTargets.length > 0) {
    revealTargets.forEach((element) => {
        element.dataset.revealState = 'waiting';
    });
    document.documentElement.classList.add('story1-reveals-enhanced');

    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
        revealAll();
    } else {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                if (entry.target === sequenceGroup) {
                    sequenceReveals.forEach(revealElement);
                } else {
                    revealElement(entry.target);
                }

                observer.unobserve(entry.target);
            });
        }, {
            rootMargin: '0px 0px -12% 0px',
            threshold: 0.05,
        });

        if (scaleReveal) {
            observer.observe(scaleReveal);
        }

        if (sequenceGroup) {
            observer.observe(sequenceGroup);
        }

        reducedMotion.addEventListener?.('change', (event) => {
            if (event.matches) {
                observer.disconnect();
                revealAll();
            }
        });
    }
}
