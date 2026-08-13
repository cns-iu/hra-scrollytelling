import { initializeSiteMenus } from '../../shared/js/menu.js';
import { initializeSiteTheme } from '../../shared/js/theme.js';
import { initializeContrastControls } from '../../shared/js/contrast.js';
import { initializeBackToTopLinks } from '../../shared/js/back-to-top.js';

// Keep feature initialization explicit so modules remain independently maintainable.
initializeSiteTheme();
initializeContrastControls();
initializeSiteMenus();
initializeBackToTopLinks();
