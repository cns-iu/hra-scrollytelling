import { initializeSiteMenus } from './menu.js';
import { initializeBackToTopLinks } from './back-to-top.js';

// Navigation-only consumers expose the shared Menu without appearance preferences.
initializeSiteMenus();
initializeBackToTopLinks();
