import { initializeSiteMenus } from './menu.js';
import { initializeSiteTheme } from './theme.js';
import { initializeContrastControls } from './contrast.js';
import { initializeBackToTopLinks } from './back-to-top.js';

// Keep shared enhancements independent from story-specific runtimes.
initializeSiteTheme();
initializeContrastControls();
initializeSiteMenus();
initializeBackToTopLinks();
