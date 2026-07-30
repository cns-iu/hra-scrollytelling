import { initializeSiteMenus } from './menu.js';
import { initializeSiteTheme } from './theme.js';

// Keep shared enhancements independent from story-specific runtimes.
initializeSiteTheme();
initializeSiteMenus();
