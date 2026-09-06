/*
 * Applies the stored appearance and contrast preferences before first paint.
 *
 * This must run as a blocking classic script in <head>, ahead of the
 * stylesheets: a `type="module"` script is deferred, which would let the page
 * paint in the system appearance and then flash to the stored one. Every
 * maintained page loads this same file, and
 * tools/check-maintained-pages.mjs asserts that it does.
 */

(() => {
  try {
    const savedTheme = localStorage.getItem("hra-landing-theme");
    const savedContrast = localStorage.getItem("hra-high-contrast");
    const systemTheme =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    const activeTheme =
      savedTheme === "light" || savedTheme === "dark"
        ? savedTheme
        : systemTheme;
    const themeColor = document.querySelector('meta[name="theme-color"]');

    if (
      savedTheme === "system" ||
      savedTheme === "light" ||
      savedTheme === "dark"
    ) {
      document.documentElement.dataset.themeMode = savedTheme;
      if (savedTheme === "light" || savedTheme === "dark") {
        document.documentElement.dataset.theme = savedTheme;
      }
    }

    if (savedContrast === "more" || savedContrast === "standard") {
      document.documentElement.dataset.contrast = savedContrast;
    }

    if (themeColor) {
      themeColor.content =
        activeTheme === "dark"
          ? themeColor.dataset.darkColor
          : themeColor.dataset.lightColor;
    }
  } catch {
    // The system theme remains the fallback when storage is unavailable.
  }
})();
