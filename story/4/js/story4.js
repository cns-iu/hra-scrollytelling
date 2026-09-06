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
import { setupParticles } from './app.js';
import { setupDiagramOverview } from './diagram-overview.js';
import { setupDiagramDetail } from './diagram-detail.js';

if (window.hraStory4MotionEnabled) {
    if (window.gsap && window.ScrollTrigger) {
        setupDiagramOverview();
        setupDiagramDetail();
    }

    setupParticles();
}
