// System-aware appearance preferences shared by maintained public pages.
const themeStorageKey = 'hra-landing-theme';
const supportedThemeModes = ['system', 'light', 'dark'];

export const initializeSiteTheme = () => {
    const root = document.documentElement;
    const themeChoices = Array.from(document.querySelectorAll('[data-site-theme-choice]'));
    const preferenceStatus = document.querySelector('[data-site-theme-status]');
    const themeColor = document.querySelector('meta[name="theme-color"]');
    const systemTheme = typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null;

    if (themeChoices.length === 0) {
        return;
    }

    const readStoredTheme = () => {
        try {
            const storedTheme = localStorage.getItem(themeStorageKey);
            return supportedThemeModes.includes(storedTheme) ? storedTheme : 'system';
        } catch {
            return 'system';
        }
    };

    const getSystemTheme = () => systemTheme?.matches ? 'dark' : 'light';

    const applyTheme = (themeMode) => {
        const safeThemeMode = supportedThemeModes.includes(themeMode) ? themeMode : 'system';

        root.dataset.themeMode = safeThemeMode;

        if (safeThemeMode === 'system') {
            root.removeAttribute('data-theme');
        } else {
            root.dataset.theme = safeThemeMode;
        }

        themeChoices.forEach((choice) => {
            choice.checked = choice.value === safeThemeMode;
        });

        const activeTheme = safeThemeMode === 'system' ? getSystemTheme() : safeThemeMode;

        if (themeColor?.dataset.lightColor && themeColor?.dataset.darkColor) {
            themeColor.content = activeTheme === 'dark'
                ? themeColor.dataset.darkColor
                : themeColor.dataset.lightColor;
        }

        return activeTheme;
    };

    const saveTheme = (themeMode) => {
        try {
            localStorage.setItem(themeStorageKey, themeMode);
        } catch {
            // The selected appearance still applies for this page view.
        }
    };

    const announcePreference = (message) => {
        if (!preferenceStatus) {
            return;
        }

        preferenceStatus.textContent = '';
        window.requestAnimationFrame(() => {
            preferenceStatus.textContent = message;
        });
    };

    applyTheme(readStoredTheme());

    themeChoices.forEach((choice) => {
        choice.addEventListener('change', () => {
            if (!choice.checked) {
                return;
            }

            const activeTheme = applyTheme(choice.value);
            saveTheme(choice.value);

            const announcement = choice.value === 'system'
                ? `System settings selected. The current theme is ${activeTheme}.`
                : `${choice.value === 'dark' ? 'Dark' : 'Light'} theme selected.`;

            announcePreference(announcement);
        });
    });

    const handleSystemThemeChange = () => {
        if (root.dataset.themeMode === 'system') {
            applyTheme('system');
        }
    };

    if (typeof systemTheme?.addEventListener === 'function') {
        systemTheme.addEventListener('change', handleSystemThemeChange);
    } else if (typeof systemTheme?.addListener === 'function') {
        systemTheme.addListener(handleSystemThemeChange);
    }
};
