(function () {
  'use strict';

  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const themeLabel = themeButton?.querySelector('.theme-label');
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const noticeClose = document.querySelector('.screen-notice-close');
  const storedTheme = getStoredTheme();
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  let noticeDismissed = false;

  function getStoredTheme() {
    try {
      const value = localStorage.getItem('hra-story-theme');
      return value === 'light' || value === 'dark' ? value : null;
    } catch (_error) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem('hra-story-theme', theme);
    } catch (_error) {
      // The selected theme still works for this visit when storage is unavailable.
    }
  }

  function applyTheme(theme, persist) {
    const isDark = theme === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';
    const frameFragment = noticeDismissed ? (isDark ? '#dark-no-notice' : '#notice-hidden') : isDark ? '#dark-theme' : '';
    const frameSource = `img/story6-doc/SenM08072026.frames.svg?v=20260804-3${frameFragment}`;

    root.dataset.theme = theme;
    themeColor?.setAttribute('content', isDark ? '#161719' : '#fafbfc');

    if (themeButton) {
      themeButton.setAttribute('aria-pressed', String(isDark));
      themeButton.setAttribute('aria-label', `Switch to ${nextTheme} theme`);
      themeButton.dataset.nextTheme = nextTheme;
    }

    if (themeLabel) {
      themeLabel.textContent = nextTheme === 'dark' ? 'Dark' : 'Light';
    }

    document.querySelectorAll('.frame-source').forEach((image) => {
      image.setAttribute('href', frameSource);
    });

    if (persist) {
      storeTheme(theme);
    }
  }

  applyTheme(storedTheme || (systemPrefersDark.matches ? 'dark' : 'light'), false);

  themeButton?.addEventListener('click', () => {
    applyTheme(themeButton.dataset.nextTheme || 'dark', true);
  });

  noticeClose?.addEventListener('click', () => {
    noticeDismissed = true;
    noticeClose.hidden = true;
    applyTheme(root.dataset.theme || 'light', false);
  });

  systemPrefersDark.addEventListener?.('change', (event) => {
    if (!getStoredTheme()) {
      applyTheme(event.matches ? 'dark' : 'light', false);
    }
  });

  const dropdown = document.querySelector('.story-nav .dropdown');
  const menuButton = dropdown?.querySelector('.dropbtn');

  function setMenu(open) {
    dropdown?.classList.toggle('is-open', open);
    menuButton?.setAttribute('aria-expanded', String(open));
  }

  menuButton?.addEventListener('click', (event) => {
    event.stopPropagation();
    setMenu(!dropdown.classList.contains('is-open'));
  });

  document.addEventListener('click', (event) => {
    if (dropdown && !dropdown.contains(event.target)) {
      setMenu(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && dropdown?.classList.contains('is-open')) {
      setMenu(false);
      menuButton?.focus();
    }
  });
})();
