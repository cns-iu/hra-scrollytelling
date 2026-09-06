import { initializeSiteMenus } from './menu.js';
import { initializeSiteTheme } from './theme.js';
import { initializeContrastControls } from './contrast.js';
import { initializeBackToTopLinks } from './back-to-top.js';
import { releaseWhenReady } from './loading-readiness.js';

// Keep shared enhancements independent from story-specific runtimes.
initializeSiteTheme();
initializeContrastControls();
initializeSiteMenus();
initializeBackToTopLinks();

/*
 * The default release: the veil lifts once the fonts and any nominated hero
 * artwork have settled. A page needing more than that releases the gate itself
 * before this runs — Story 6 waits for its pin geometry — and the first call
 * wins, so this is a no-op there rather than a second, later release.
 */
void releaseWhenReady();
