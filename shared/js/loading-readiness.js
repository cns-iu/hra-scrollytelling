/*
 * Readiness signals shared by the pages that use the loading gate.
 *
 * shared/js/loading-gate.js raises the veil; this module supplies the promises
 * a page waits on before handing it back. Each helper is written so that a
 * missing capability resolves rather than rejects — the gate uses
 * `Promise.allSettled`, but a page that awaits one of these directly should
 * not have to guard it.
 */

/**
 * Waits until the browser has completed the next layout and paint cycle.
 *
 * @returns {Promise<void>} A promise resolved after two animation frames
 */
export function nextPaint() {
    return new Promise((resolve) => {
        window.requestAnimationFrame(() => window.requestAnimationFrame(resolve));
    });
}

/**
 * Waits for the web fonts, so text is measured in its final metrics.
 *
 * @returns {Promise<void>} A promise resolved once fonts have settled
 */
export function fontsReady() {
    return document.fonts?.ready ?? Promise.resolve();
}

/**
 * Waits for the page's nominated hero artwork to be decoded and paintable.
 *
 * Pages mark their own with `data-loading-gate-hero`; a page with no hero
 * resolves immediately rather than holding the veil for artwork it lacks.
 *
 * @returns {Promise<void>} A promise resolved once the hero can paint
 */
export function heroReady() {
    const hero = document.querySelector('[data-loading-gate-hero]');

    if (typeof hero?.decode !== 'function') {
        return Promise.resolve();
    }

    return hero.decode().catch(() => undefined);
}

/**
 * Releases the loading gate once fonts, hero artwork, and any page-supplied
 * settle step have finished.
 *
 * @param {...(Promise|Function)} extra Additional page-specific settle steps
 * @returns {Promise<void>} A promise resolved after the veil begins lifting
 */
export function releaseWhenReady(...extra) {
    const gate = window.hraLoadingGate;

    if (!gate) {
        return Promise.resolve();
    }

    return gate.ready(fontsReady(), heroReady(), ...extra);
}
