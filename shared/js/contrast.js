// Persistent high-contrast controls shared by the landing page and maintained page chrome.
const contrastStorageKey = 'hra-high-contrast';
const supportedContrastModes = ['more', 'standard'];

export const initializeContrastControls = () => {
    const root = document.documentElement;
    const controlGroups = Array.from(document.querySelectorAll('[data-contrast-controls]'));
    const contrastToggles = Array.from(document.querySelectorAll('[data-contrast-toggle]'));
    const systemContrast = typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-contrast: more)')
        : null;

    if (controlGroups.length === 0 || contrastToggles.length === 0) {
        return;
    }

    const readStoredContrast = () => {
        try {
            const storedContrast = localStorage.getItem(contrastStorageKey);
            return supportedContrastModes.includes(storedContrast) ? storedContrast : 'system';
        } catch {
            return 'system';
        }
    };

    const isContrastEnabled = (contrastMode) => contrastMode === 'more'
        || (contrastMode === 'system' && Boolean(systemContrast?.matches));

    const applyContrast = (contrastMode) => {
        const safeContrastMode = contrastMode === 'system'
            || supportedContrastModes.includes(contrastMode)
            ? contrastMode
            : 'system';
        const contrastEnabled = isContrastEnabled(safeContrastMode);

        if (safeContrastMode === 'system') {
            root.removeAttribute('data-contrast');
        } else {
            root.dataset.contrast = safeContrastMode;
        }

        contrastToggles.forEach((toggle) => {
            toggle.setAttribute('aria-checked', String(contrastEnabled));
            const visibleState = toggle.querySelector('[data-contrast-state]');

            if (visibleState) {
                visibleState.textContent = contrastEnabled ? 'On' : 'Off';
            }
        });

        return safeContrastMode;
    };

    const saveContrast = (contrastMode) => {
        try {
            localStorage.setItem(contrastStorageKey, contrastMode);
        } catch {
            // The selected contrast still applies for this page view.
        }
    };

    let activeContrastMode = applyContrast(readStoredContrast());

    contrastToggles.forEach((toggle) => {
        toggle.addEventListener('click', () => {
            const nextContrastMode = isContrastEnabled(activeContrastMode) ? 'standard' : 'more';

            activeContrastMode = applyContrast(nextContrastMode);
            saveContrast(nextContrastMode);
        });
    });

    const handleSystemContrastChange = () => {
        if (activeContrastMode === 'system') {
            applyContrast('system');
        }
    };

    if (typeof systemContrast?.addEventListener === 'function') {
        systemContrast.addEventListener('change', handleSystemContrastChange);
    } else if (typeof systemContrast?.addListener === 'function') {
        systemContrast.addListener(handleSystemContrastChange);
    }

    controlGroups.forEach((controlGroup) => {
        controlGroup.hidden = false;
    });
};
