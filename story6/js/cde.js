const CDE_MODULE_URL = 'https://cdn.humanatlas.io/ui/cde-visualization-wc/wc.js';
const CDE_STYLESHEET_URL = 'https://cdn.humanatlas.io/ui/cde-visualization-wc/styles.css';
const CDE_APP_URL = 'https://apps.humanatlas.io/cde/';
const CDE_DATA_TIMEOUT = 90000;
const CDE_NATIVE_WIDTH = 1391;
const CDE_MINIMUM_FIT_SCALE = 0.92;
const CDE_PRELOAD_FALLBACK_DELAY = 4000;

let cdeModulePromise;
let cdeStylesheetPromise;
let cdeRenderPromise;
const cdeStageCleanups = new WeakMap();

/**
 * Initializes preloading and the launch control for the young mouse CDE.
 *
 * @returns {() => void} A callback that synchronizes the CDE with its tutorial state
 */
export function setupCde() {
  const container = document.querySelector('.section5 .cde');

  if (!container) {
    return () => {};
  }

  setupCdeLauncher(container, '.mouse-young');
  scheduleCdePreload(container, '.mouse-young', document.querySelector('.section5') ?? container);

  return () => syncCdeVisibility(container);
}

/**
 * Loads the CDE custom-element definition once.
 *
 * @returns {Promise<CustomElementConstructor>} The defined CDE custom element
 */
function loadCdeModule() {
  cdeModulePromise ??= import(CDE_MODULE_URL)
    .then(() => customElements.whenDefined('cde-visualization'))
    .catch((error) => {
      cdeModulePromise = undefined;
      throw error;
    });

  return cdeModulePromise;
}

/**
 * Loads the CDE stylesheet once when explorer preparation begins.
 *
 * @returns {Promise<HTMLLinkElement>} The loaded stylesheet link
 */
function loadCdeStylesheet() {
  if (cdeStylesheetPromise) {
    return cdeStylesheetPromise;
  }

  cdeStylesheetPromise = new Promise((resolve, reject) => {
    const link = document.createElement('link');

    link.rel = 'stylesheet';
    link.href = CDE_STYLESHEET_URL;
    link.dataset.story6CdeStyles = '';
    link.addEventListener('load', () => resolve(link), { once: true });
    link.addEventListener(
      'error',
      () => {
        link.remove();
        cdeStylesheetPromise = undefined;
        reject(new Error('The CDE stylesheet could not be loaded'));
      },
      { once: true },
    );
    document.head.append(link);
  });

  return cdeStylesheetPromise;
}

/**
 * Creates the CDE offscreen so its data can load before the launch step.
 *
 * @param {HTMLElement} container The CDE section container
 * @param {string} templateSelector The visualization template selector
 * @returns {Promise<HTMLElement|null>} The rendered visualization
 */
function ensureCdeRendered(container, templateSelector) {
  if (cdeRenderPromise) {
    return cdeRenderPromise;
  }

  cdeRenderPromise ??= renderCdeTemplate(container, templateSelector).catch((error) => {
    resetCdeRender(container);
    cdeRenderPromise = undefined;
    throw error;
  });

  return cdeRenderPromise;
}

/**
 * Adds a measurable but inaccessible CDE instance from its template.
 *
 * @param {HTMLElement} container The CDE section container
 * @param {string} templateSelector The visualization template selector
 * @returns {Promise<HTMLElement|null>} The rendered visualization
 */
async function renderCdeTemplate(container, templateSelector) {
  const template = container.querySelector(templateSelector);
  const shell = template?.parentElement;

  if (!template || !shell) {
    return null;
  }

  await Promise.all([loadCdeModule(), loadCdeStylesheet()]);
  prepareShellForPreload(shell);
  const content = template.content.cloneNode(true);
  const visualization = content.querySelector('cde-visualization');

  if (!visualization) {
    throw new Error('The CDE template does not contain a visualization');
  }

  resolveCdeDataUrls(visualization);
  const dataReady = waitForCdeData(visualization);

  shell.append(content);
  setupCdeStageSizing(shell);
  await dataReady;

  return visualization;
}

/**
 * Fits the native CDE into the shared tutorial stage when controls remain large enough.
 *
 * @param {HTMLElement} shell The responsive visualization shell
 * @returns {void}
 */
function setupCdeStageSizing(shell) {
  cdeStageCleanups.get(shell)?.();

  const update = () => {
    const fitScale = Math.min(1, shell.clientWidth / CDE_NATIVE_WIDTH);
    const canFitAccessibly = fitScale >= CDE_MINIMUM_FIT_SCALE;

    shell.style.setProperty('--cde-scale', String(canFitAccessibly ? fitScale : 1));
    shell.classList.toggle('cde-fits-stage', canFitAccessibly);
  };

  update();

  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(update);

    observer.observe(shell);
    cdeStageCleanups.set(shell, () => observer.disconnect());
  } else {
    window.addEventListener('resize', update);
    cdeStageCleanups.set(shell, () => window.removeEventListener('resize', update));
  }
}

/**
 * Converts page-relative dataset attributes into unambiguous absolute URLs.
 *
 * @param {HTMLElement} visualization The CDE custom element
 * @returns {void}
 */
function resolveCdeDataUrls(visualization) {
  for (const attribute of ['nodes', 'edges']) {
    const value = visualization.getAttribute(attribute);

    if (value) {
      visualization.setAttribute(attribute, new URL(value, document.baseURI).href);
    }
  }
}

/**
 * Waits for the component to confirm that both datasets were accepted.
 *
 * @param {HTMLElement} visualization The CDE custom element
 * @returns {Promise<void>} A promise resolved after node and edge data load
 */
function waitForCdeData(visualization) {
  const loaded = Promise.all([
    waitForCdeEvent(visualization, 'nodes'),
    waitForCdeEvent(visualization, 'edges'),
  ]).then(() => undefined);
  const timedOut = new Promise((_, reject) => {
    window.setTimeout(() => reject(new Error('The CDE datasets did not finish loading in time')), CDE_DATA_TIMEOUT);
  });

  return Promise.race([loaded, timedOut]);
}

/**
 * Resolves after one CDE dataset event containing nonempty data.
 *
 * @param {HTMLElement} visualization The CDE custom element
 * @param {'nodes'|'edges'} eventName Dataset event name
 * @returns {Promise<void>} A promise resolved when the dataset loads
 */
function waitForCdeEvent(visualization, eventName) {
  return new Promise((resolve) => {
    visualization.addEventListener(
      eventName,
      (event) => {
        if (Array.isArray(event.detail) && event.detail.length > 0) {
          resolve();
        }
      },
      { once: true },
    );
  });
}

/**
 * Removes an unsuccessful visualization so the launch button can retry.
 *
 * @param {HTMLElement} container The CDE section container
 * @returns {void}
 */
function resetCdeRender(container) {
  const shell = container.querySelector('.cde-visualization-shell');

  container.querySelector('cde-visualization')?.remove();

  if (shell) {
    cdeStageCleanups.get(shell)?.();
    cdeStageCleanups.delete(shell);
    shell.classList.remove('is-preloading');
    shell.classList.remove('cde-fits-stage');
    shell.style.removeProperty('--cde-scale');
    shell.removeAttribute('aria-hidden');
    shell.inert = false;
    shell.tabIndex = 0;
    shell.hidden = true;
  }
}

/**
 * Keeps the preloaded visualization measurable without exposing it prematurely.
 *
 * @param {HTMLElement} shell The responsive visualization shell
 * @returns {void}
 */
function prepareShellForPreload(shell) {
  shell.hidden = false;
  shell.classList.add('is-preloading');
  shell.setAttribute('aria-hidden', 'true');
  shell.inert = true;
  shell.tabIndex = -1;
}

/**
 * Exposes the prepared visualization for interaction.
 *
 * @param {HTMLElement} shell The responsive visualization shell
 * @returns {void}
 */
function revealCdeShell(shell) {
  shell.classList.remove('is-preloading');
  shell.removeAttribute('aria-hidden');
  shell.inert = false;
  shell.tabIndex = 0;
  shell.hidden = false;
}

/**
 * Keeps the CDE hidden while the tutorial artwork is active.
 *
 * @param {HTMLElement} container The CDE section container
 * @returns {void}
 */
function syncCdeVisibility(container) {
  const tutorial = container.querySelector('.tutorial-images');
  const shell = container.querySelector('.cde-visualization-shell');

  if (!tutorial || !shell || shell.classList.contains('is-preloading')) {
    return;
  }

  const display = getComputedStyle(tutorial).display === 'none' ? '' : 'none';

  if (shell.style.display !== display) {
    shell.style.display = display;
  }
}

/**
 * Connects the launch button to the prepared CDE.
 *
 * @param {HTMLElement} container The CDE section container
 * @param {string} templateSelector The visualization template selector
 * @returns {void}
 */
function setupCdeLauncher(container, templateSelector) {
  const placeholder = container.querySelector('.cde-placeholder');
  const status = container.querySelector('.cde-status');
  const shell = container.querySelector('.cde-visualization-shell');

  if (!placeholder || !status || !shell) {
    return;
  }

  placeholder.addEventListener('click', async () => {
    placeholder.disabled = true;
    container.setAttribute('aria-busy', 'true');
    status.classList.add('visually-hidden');
    status.textContent = 'Preparing the Cell Distance Explorer…';

    try {
      const visualization = await ensureCdeRendered(container, templateSelector);

      revealCdeShell(shell);
      placeholder.remove();
      syncCdeVisibility(container);
      status.textContent = 'The Cell Distance Explorer is ready.';
      visualization?.focus();
    } catch (error) {
      console.error('CDE loading failed:', error);
      placeholder.disabled = false;
      status.classList.remove('visually-hidden');
      showCdeLoadFailure(status);
      placeholder.focus();
    } finally {
      container.removeAttribute('aria-busy');
    }
  });
}

/**
 * Presents an accessible retry alternative when the embedded explorer fails.
 *
 * @param {HTMLElement} status The polite live region that reports CDE loading state
 * @returns {void}
 */
function showCdeLoadFailure(status) {
  const link = document.createElement('a');

  link.href = CDE_APP_URL;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'open the standalone Cell Distance Explorer';

  status.replaceChildren(
    document.createTextNode('The embedded Cell Distance Explorer could not be loaded. Please try again, or '),
    link,
    document.createTextNode(' (opens in a new tab).'),
  );
}

/**
 * Starts CDE loading as the reader approaches the explorer narrative.
 *
 * @param {HTMLElement} container The CDE section container
 * @param {string} templateSelector The visualization template selector
 * @param {Element} preloadTarget The tutorial boundary used to trigger preparation
 * @returns {void}
 */
function scheduleCdePreload(container, templateSelector, preloadTarget) {
  const preload = () => {
    ensureCdeRendered(container, templateSelector).catch((error) => {
      console.warn('CDE preload deferred until launch:', error);
    });
  };
  const preloadAfterInitialUi = () => preloadWhenNoticeIsReady(preload);
  const preloadAfterPinSettles = () => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(preloadAfterInitialUi));
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        observer.disconnect();
        preloadAfterPinSettles();
      }
    });

    observer.observe(preloadTarget);
    return;
  }

  window.setTimeout(() => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(preloadAfterInitialUi, { timeout: 2000 });
    } else {
      preloadAfterInitialUi();
    }
  }, CDE_PRELOAD_FALLBACK_DELAY);
}

/**
 * Keeps heavy CDE preparation from delaying dismissal of a visible size notice.
 *
 * @param {() => void} preload Starts CDE preparation
 * @returns {void}
 */
function preloadWhenNoticeIsReady(preload) {
  const notice = document.querySelector('.screen-size-notice');
  const noticeIsVisible = notice && !notice.hidden && getComputedStyle(notice).display !== 'none';

  if (!noticeIsVisible) {
    preload();
    return;
  }

  document.addEventListener('story6:screen-size-notice-dismissed', preload, { once: true });
}
