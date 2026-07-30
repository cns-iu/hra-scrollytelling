import { initializeSiteMenu } from './menu.js';
import { initializeThemeControls } from './theme.js';

// Keep feature initialization explicit so modules remain independently maintainable.
initializeThemeControls();
initializeSiteMenu();
