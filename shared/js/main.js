import { initializeSiteMenus } from './menu.js';
import { initializeSiteTheme } from './theme.js';
import { initializeContrastControls } from './contrast.js';

// Keep shared enhancements independent from story-specific runtimes.
initializeSiteTheme();
initializeContrastControls();
initializeSiteMenus();
