import { initializeSiteMenu } from './menu.js';
import { initializeThemeControls } from './theme.js';
import { initializeContrastControls } from '../../shared/js/contrast.js';

// Keep feature initialization explicit so modules remain independently maintainable.
initializeThemeControls();
initializeContrastControls();
initializeSiteMenu();
