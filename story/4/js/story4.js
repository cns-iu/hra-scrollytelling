/*
 * Story 4 entry point.
 *
 * Mirrors story/6/js/story6.js: one module per concern, each exporting a single
 * setup function, and one place that decides whether any of them run.
 *
 * The gate lives here rather than in each module. Previously every file opened
 * with the same `if (window.hraStory4MotionEnabled)` wrapper, so the decision
 * was restated in each one and could drift.
 */
const GSAP_BASE = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5';

/**
 * Loads a classic script and resolves once its global is available.
 *
 * @param {string} source Script URL
 * @returns {Promise<void>} Settles when the script has run, or failed to
 */
function loadScript(source) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');

        script.src = source;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${source}`));
        document.head.append(script);
    });
}

/*
 * Nothing below runs unless the motion gate allows it, so nothing below is
 * downloaded either. GSAP, ScrollTrigger and particles.js used to be declared in
 * index.html, which fetched roughly 150 KB for every visitor - including the
 * reduced-motion readers whose whole experience is the static document.
 *
 * ScrollTrigger has to arrive after GSAP, which registers the global it extends.
 */
if (window.hraStory4MotionEnabled) {
    try {
        await loadScript(`${GSAP_BASE}/gsap.min.js`);
        await loadScript(`${GSAP_BASE}/ScrollTrigger.min.js`);

        if (window.gsap && window.ScrollTrigger) {
            const { setupDiagramOverview } = await import('./diagram-overview.js');
            const { setupDiagramDetail } = await import('./diagram-detail.js');

            setupDiagramOverview();
            setupDiagramDetail();
        }
    } catch (error) {
        /* The static document is the fallback, so a CDN failure is survivable. */
        console.warn('Story 4 scroll animation unavailable:', error);
    }

    try {
        await loadScript('js/particles.js');

        const { setupParticles } = await import('./app.js');

        setupParticles();
    } catch (error) {
        console.warn('Story 4 ambient particles unavailable:', error);
    }
}
