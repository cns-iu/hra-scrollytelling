/*
 * Holds an opaque veil over the page until its first paint is trustworthy.
 *
 * This must run as a blocking classic script in <head>, ahead of the
 * stylesheets and immediately after theme-bootstrap.js: a `type="module"`
 * script is deferred, which would let the page paint bare and then flash.
 * Every maintained page loads this same file, and
 * tools/check-maintained-pages.mjs asserts that it does.
 *
 * The veil is added here rather than in CSS so that a reader without
 * JavaScript never sees it; shared/css/loading-gate.css owns its appearance.
 *
 * Pages configure it from the script tag itself:
 *
 *   data-page-classes   space-separated classes to set on <html> before first
 *                       paint. Stories 1 and 5 use this for state their
 *                       deferred modules used to apply after painting, which
 *                       made content appear and then blink out.
 *   data-preload-image  a {theme} placeholder is replaced with the resolved
 *                       appearance, so the landing page's hero starts loading
 *                       during head parsing instead of after CSS has parsed.
 *   data-watchdog       milliseconds before the veil lifts regardless.
 */

(() => {
    const root = document.documentElement;
    const script = document.currentScript;
    const settings = script ? script.dataset : {};
    const DEFAULT_WATCHDOG = 2000;
    const FADE_MS = 1250;
    const REDUCED_FADE_MS = 1;
    const CLEANUP_SLACK_MS = 150;

    const prefersReducedMotion = () =>
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // theme-bootstrap.js has already resolved the stored appearance.
    const activeTheme = () => {
        if (root.dataset.theme === "dark" || root.dataset.theme === "light") {
            return root.dataset.theme;
        }

        return typeof window.matchMedia === "function" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    };

    if (settings.pageClasses) {
        root.classList.add(...settings.pageClasses.split(/\s+/u).filter(Boolean));
    }

    if (settings.preloadImage) {
        const link = document.createElement("link");

        link.rel = "preload";
        link.as = "image";
        link.href = settings.preloadImage.replace("{theme}", activeTheme());
        link.fetchPriority = "high";
        document.head.append(link);
    }

    root.classList.add("hra-loading");

    let released = false;
    let watchdogTimer;
    let status = null;
    let content = [];

    /*
     * Lifts the veil. Safe to call repeatedly: the watchdog and the page's own
     * readiness signal race, and whichever arrives first wins.
     */
    const release = () => {
        if (released) {
            return;
        }

        released = true;
        window.clearTimeout(watchdogTimer);

        const fade = prefersReducedMotion() ? REDUCED_FADE_MS : FADE_MS;

        root.style.setProperty("--hra-loading-fade", `${fade}ms`);
        root.classList.add("hra-ready");

        if (status) {
            status.textContent = "Page ready.";
        }

        // Removing .hra-loading releases the scroll lock and stops the veil
        // painting; it must not happen before the fade has finished.
        window.setTimeout(() => {
            root.classList.remove("hra-loading", "hra-ready");
            root.style.removeProperty("--hra-loading-fade");
            content.forEach((element) => element.removeAttribute("inert"));
            root.removeAttribute("aria-busy");

            if (status) {
                status.textContent = "";
            }
        }, fade + CLEANUP_SLACK_MS);
    };

    /*
     * Keyboard focus must not land on content hidden behind the veil, and a
     * screen reader should not read a page that is still settling. `inert`
     * covers both, and is removed again on release.
     */
    const holdContent = () => {
        // A page that released before the body parsed needs no hold, and
        // applying one here would leave inert content behind for good.
        if (released) {
            return;
        }

        content = Array.from(document.body.children).filter(
            (element) => element !== status,
        );
        content.forEach((element) => element.setAttribute("inert", ""));
        root.setAttribute("aria-busy", "true");
    };

    const announce = () => {
        if (released) {
            return;
        }

        status = document.createElement("div");
        status.className = "site-chrome-visually-hidden";
        status.setAttribute("role", "status");
        status.setAttribute("aria-live", "polite");
        document.body.prepend(status);
        // Announced after the region exists, so it is read as a change.
        window.setTimeout(() => {
            if (!released && status) {
                status.textContent = "Loading page…";
            }
        }, 0);
    };

    document.addEventListener("DOMContentLoaded", () => {
        announce();
        holdContent();
    });

    watchdogTimer = window.setTimeout(
        release,
        Number(settings.watchdog) || DEFAULT_WATCHDOG,
    );

    window.hraLoadingGate = {
        release,
        // Pages await their own readiness, then hand the veil back.
        ready(...signals) {
            const settled = signals
                .filter(Boolean)
                .map((signal) => (typeof signal === "function" ? signal() : signal));

            // allSettled, never all: a failed decode must not strand the veil.
            return Promise.allSettled(settled).then(release, release);
        },
    };
})();
