/* global gsap, ScrollTrigger, shouldResetStory6Reload */

const pinnedScrollScrub = 0.6;
const animationsAvailable = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

if (animationsAvailable) {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
} else {
  document.body.classList.add('story-animations-unavailable');
}

const storyNavigation = document.querySelector('.dropdown');
const storyNavigationButton = storyNavigation.querySelector('.dropbtn');

/**
 * Updates the open state exposed visually and to assistive technology.
 *
 * @param {boolean} isOpen Whether the story navigation should be open
 * @returns {void}
 */
function setStoryNavigationOpen(isOpen) {
  storyNavigation.classList.toggle('is-open', isOpen);
  storyNavigationButton.setAttribute('aria-expanded', String(isOpen));
  storyNavigationButton.setAttribute('aria-label', `${isOpen ? 'Close' : 'Open'} story navigation`);
}

storyNavigationButton.addEventListener('click', () => {
  setStoryNavigationOpen(storyNavigationButton.getAttribute('aria-expanded') !== 'true');
});

storyNavigation.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setStoryNavigationOpen(false);
    storyNavigationButton.focus();
  }
});

document.addEventListener('click', (event) => {
  if (!storyNavigation.contains(event.target)) {
    setStoryNavigationOpen(false);
  }
});

const screenSizeNotice = document.querySelector('.screen-size-notice');
const screenSizeNoticeClose = document.querySelector('.screen-size-notice__close');

screenSizeNoticeClose.addEventListener('click', () => {
  screenSizeNotice.hidden = true;
});

let cdeModulePromise;

/**
 * Loads the Cell Distance Explorer definition once and waits until it is ready.
 *
 * @returns {Promise<CustomElementConstructor>} A promise that resolves with the defined custom element constructor
 */
function loadCdeModule() {
  cdeModulePromise ??= import('https://cdn.humanatlas.io/ui/cde-visualization-wc/wc.js')
    .then(() => customElements.whenDefined('cde-visualization'))
    .catch((error) => {
      cdeModulePromise = undefined;
      throw error;
    });

  return cdeModulePromise;
}

/**
 * Adds a Cell Distance Explorer instance from its template.
 *
 * @param {HTMLElement} container The section containing the template and launch button
 * @param {string} templateSelector The selector for the visualization template
 * @param {HTMLButtonElement} placeholder The launch button to replace after loading
 * @returns {Promise<HTMLElement|null>} The rendered visualization, or null when no render is needed
 */
async function renderCdeTemplate(container, templateSelector, placeholder) {
  const template = container.querySelector(templateSelector);
  const existingVisualization = container.querySelector('cde-visualization');

  if (!template || existingVisualization) {
    return existingVisualization;
  }

  await loadCdeModule();
  container.append(template.content.cloneNode(true));
  const visualization = container.querySelector('cde-visualization');

  if (placeholder) {
    placeholder.remove();
  }

  return visualization;
}

/**
 * Creates a pinned transition with a shared text-card entrance and exit.
 *
 * @param {string} trigger The selector for the transition section
 * @returns {gsap.core.Timeline} The configured GSAP timeline
 */
function createTextboxTransition(trigger) {
  const section = document.querySelector(trigger);
  const textbox = section.querySelector('.textbox-transition');
  const background = section.querySelector('.transition__background');
  const overlay = section.querySelector('.transition__overlay');
  const driftDirection = Number(section.dataset.drift) || 1;

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 72px',
      end: '+=240%',
      pin: true,
      scrub: pinnedScrollScrub,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  timeline
    .fromTo(
      background,
      { scale: 1.07, xPercent: -1.5 * driftDirection },
      { scale: 1.04, xPercent: 1.5 * driftDirection, duration: 3.2, ease: 'none', force3D: true },
      0,
    );

  return addTextboxChoreography(timeline, textbox, overlay, 0.15, 0.25, 0.72);
}

/**
 * Adds the shared transition-card entrance, hold, and exit to a timeline.
 *
 * @param {gsap.core.Timeline} timeline Timeline receiving the transition sequence
 * @param {HTMLElement} textbox Question card shown over the transition background
 * @param {HTMLElement|null} overlay Darkening layer behind the question card, or null when the background handles its own transition
 * @param {string|number|null} overlayPosition Position where the background begins to darken, or null when no overlay is used
 * @param {string|number} textboxPosition Position where the question card begins to enter
 * @param {string|number} pulsePosition Position where the question card begins its settling pulse
 * @returns {gsap.core.Timeline} The updated timeline
 */
function addTextboxChoreography(timeline, textbox, overlay, overlayPosition, textboxPosition, pulsePosition) {
  if (overlay && overlayPosition !== null) {
    timeline.to(overlay, { opacity: 0.2, duration: 0.55, ease: 'power1.out' }, overlayPosition);
  }

  timeline
    .fromTo(
      textbox,
      { autoAlpha: 0, y: 32, scale: 0.94 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: 'power2.out', force3D: true },
      textboxPosition,
    )
    .to(textbox, { scale: 1.015, duration: 0.12, ease: 'power1.out' }, pulsePosition)
    .to(textbox, { scale: 1, duration: 0.12, ease: 'power1.inOut' })
    .to(textbox, { autoAlpha: 1, duration: 1.35, ease: 'none' })
    .to(textbox, { autoAlpha: 0, y: 32, scale: 0.94, duration: 0.45, ease: 'power2.in', force3D: true });

  if (overlay) {
    timeline.to(overlay, { opacity: 0, duration: 0.45, ease: 'power1.in' }, '<');
  }

  return timeline;
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Reveals narrative illustrations once as they enter the viewport.
 *
 * @returns {void}
 */
function setupIllustrationReveals() {
  const illustrations = document.querySelectorAll('.story-illustration');

  if (prefersReducedMotion || !('IntersectionObserver' in window) || illustrations.length === 0) {
    return;
  }

  document.body.classList.add('illustration-reveals-enabled');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -10%' },
  );

  illustrations.forEach((illustration) => observer.observe(illustration));
}

setupIllustrationReveals();

if (!prefersReducedMotion && animationsAvailable) {
  gsap.set('.textbox-transition1', { autoAlpha: 0 });

  const headerTimeline = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: '.page-header',
      start: 'top 72px',
      end: '+=325%',
      pin: true,
      scrub: pinnedScrollScrub,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  headerTimeline
    // Keep the splash and title card visible before beginning the transition.
    .to('.splash-image', { autoAlpha: 1, duration: 1 })
    .addLabel('headerTransition')
    .to('.splash-image', { autoAlpha: 0.25, duration: 1 }, 'headerTransition')
    .to('.title-card', { y: () => -window.innerHeight, duration: 1 }, 'headerTransition')
    .addLabel('headerQuestion')
    .to('.splash-image', { autoAlpha: 0.25, duration: 3.2 }, 'headerQuestion');

  addTextboxChoreography(
    headerTimeline,
    document.querySelector('.textbox-transition1'),
    null,
    null,
    'headerQuestion+=0.25',
    'headerQuestion+=0.72',
  );

  gsap.set('.picture2', { autoAlpha: 0 });

  gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '.section2',
        start: 'top 72px',
        end: '+=250%',
        pin: true,
        scrub: pinnedScrollScrub,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })
  // Hold picture 1 before starting the crossfade.
    .to('.picture2', {
      autoAlpha: 0,
      duration: 1,
    })
  // Crossfade to picture 2.
    .to('.picture2', {
      autoAlpha: 1,
      duration: 0.5,
    })
  // Keep picture 2 visible for one more viewport before unpinning.
    .to('.picture2', {
      autoAlpha: 1,
      duration: 1,
    });

  createTextboxTransition('.transition1');

  gsap.set('.thymus, .liver, .spleen, .pancreas', { autoAlpha: 0 });
  gsap.set('.all', { autoAlpha: 1 });

  gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '.section3',
        start: 'top 72px',
        end: '+=500%',
        pin: true,
        scrub: pinnedScrollScrub,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })
  // Hold the complete mouse for the first viewport.
    .to('.all', { autoAlpha: 1, duration: 1 })
  // Crossfade the complete mouse into the first organ.
    .to('.all', { autoAlpha: 0, duration: 0.2 })
    .to('.thymus', { autoAlpha: 1, duration: 0.2 }, '<')
  // Crossfade each organ into the next organ.
    .to('.thymus', { autoAlpha: 1, duration: 0.8 })
    .to('.thymus', { autoAlpha: 0, duration: 0.2 })
    .to('.liver', { autoAlpha: 1, duration: 0.2 }, '<')
    .to('.liver', { autoAlpha: 1, duration: 0.8 })
    .to('.liver', { autoAlpha: 0, duration: 0.2 })
    .to('.spleen', { autoAlpha: 1, duration: 0.2 }, '<')
    .to('.spleen', { autoAlpha: 1, duration: 0.8 })
    .to('.spleen', { autoAlpha: 0, duration: 0.2 })
    .to('.pancreas', { autoAlpha: 1, duration: 0.2 }, '<')
    .set('.scroll-instruction', { autoAlpha: 0 })
    .to('.pancreas', { autoAlpha: 1, duration: 0.8 });

  createTextboxTransition('.transition2');

  gsap.timeline({
    scrollTrigger: {
      trigger: '.section4',
      start: 'top 72px',
      end: '+=100%',
      pin: true,
      anticipatePin: 1,
    },
  });

  createTextboxTransition('.transition3');
}

const section5CdeContainers = Array.from(document.querySelectorAll('.section5 .cde'));

/**
 * Keeps the young-mouse visualization hidden until its tutorial sequence is complete.
 *
 * @returns {void}
 */
function syncSection5CdeVisibility() {
  section5CdeContainers.forEach((container) => {
    const tutorialImages = container.querySelector('.tutorial-images');
    const cdeVisualization = container.querySelector('cde-visualization');

    if (!tutorialImages || !cdeVisualization) {
      return;
    }

    const visualizationDisplay = tutorialImages.style.display === 'none' ? '' : 'none';

    if (cdeVisualization.style.display !== visualizationDisplay) {
      cdeVisualization.style.display = visualizationDisplay;
    }
  });
}

/**
 * Connects a launch button to one lazily loaded Cell Distance Explorer.
 *
 * @param {HTMLElement} container The section containing the launch button and template
 * @param {string} templateSelector The selector for the visualization template
 * @param {() => void} afterRender Work to run after the visualization is added
 * @returns {void}
 */
function setupCdeLauncher(container, templateSelector, afterRender = () => {}) {
  const placeholder = container.querySelector('.cde-placeholder');
  const status = container.querySelector('.cde-status');

  if (!placeholder) {
    return;
  }

  placeholder.addEventListener('click', async () => {
    placeholder.disabled = true;
    container.setAttribute('aria-busy', 'true');
    status.classList.add('visually-hidden');
    status.textContent = 'Loading the Cell Distance Explorer…';

    try {
      const visualization = await renderCdeTemplate(container, templateSelector, placeholder);
      afterRender();
      status.textContent = 'The Cell Distance Explorer loaded successfully.';
      visualization?.focus();
    } catch (error) {
      console.error('CDE loading failed:', error);
      placeholder.disabled = false;
      status.classList.remove('visually-hidden');
      status.textContent = 'The Cell Distance Explorer could not be loaded. Please try again or use the downloadable data links.';
      placeholder.focus();
    } finally {
      container.removeAttribute('aria-busy');
    }
  });
}

section5CdeContainers.forEach((container) => {
  setupCdeLauncher(container, '.mouse-young', syncSection5CdeVisibility);
});

document.querySelectorAll('.section6 .cde').forEach((container) => {
  setupCdeLauncher(container, '.mouse-old');
});

if (!prefersReducedMotion && animationsAvailable) {
  gsap.set('.blurb', { autoAlpha: 0 });
  gsap.set('.section5 .tutorial, .section5 .cde-placeholder', { autoAlpha: 0 });
  gsap.set('.section5 .tutorial-images', { display: 'block' });
  gsap.set('.section5 .cde-placeholder', { display: 'none' });

  const section5Timeline = gsap.timeline({
    onUpdate: syncSection5CdeVisibility,
    scrollTrigger: {
      trigger: '.section5',
      start: 'top 72px',
      end: '+=600%',
      pin: true,
      scrub: pinnedScrollScrub,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  section5Timeline
    .to('.tutorial1', { autoAlpha: 1, duration: 0.1 })
    .to('.tutorial1', { autoAlpha: 1, duration: 0.8 })
    .to('.tutorial1', { autoAlpha: 0, duration: 0.1 })
    .to('.blurb1, .tutorial2', { autoAlpha: 1, duration: 0.1 }, '<')
    .to('.blurb1, .tutorial2', { autoAlpha: 1, duration: 0.8 })
    .to('.blurb1, .tutorial2', { autoAlpha: 0, duration: 0.1 })
    .to('.blurb2, .tutorial3', { autoAlpha: 1, duration: 0.1 }, '<')
    .to('.blurb2, .tutorial3', { autoAlpha: 1, duration: 0.8 })
    .to('.blurb2, .tutorial3', { autoAlpha: 0, duration: 0.1 })
    .to('.blurb3, .tutorial4', { autoAlpha: 1, duration: 0.1 }, '<')
    .to('.blurb3, .tutorial4', { autoAlpha: 1, duration: 0.8 })
    .to('.blurb3, .tutorial4', { autoAlpha: 0, duration: 0.1 })
    .to('.blurb4, .tutorial5', { autoAlpha: 1, duration: 0.1 }, '<')
    .to('.blurb4, .tutorial5', { autoAlpha: 1, duration: 0.8 })
    .to('.blurb4, .tutorial5', { autoAlpha: 0, duration: 0.1 })
    .set('.section5 .tutorial-images', { display: 'none' })
    .set('.section5 .cde-placeholder', { display: 'block' })
    .to('.section5 .cde-placeholder', { autoAlpha: 1, duration: 0.1 }, '<')
    .to('.section5 .cde-placeholder', { autoAlpha: 1, duration: 0.9 });

  createTextboxTransition('.transition4');

  gsap.timeline({
    scrollTrigger: {
      trigger: '.section6',
      start: 'top 72px',
      end: '+=100%',
      pin: true,
      anticipatePin: 1,
    },
  });

  createTextboxTransition('.transition5');
}

const backToTopLink = document.querySelector('.story-footer__back-to-top');

backToTopLink?.addEventListener('click', (event) => {
  event.preventDefault();
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
});

/**
 * Refreshes pinned-scene measurements after assets load and resets plain reloads.
 *
 * @returns {void}
 */
function finalizeStoryLayout() {
  if (shouldResetStory6Reload) {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    window.history.scrollRestoration = 'auto';
  }

  if (animationsAvailable) {
    ScrollTrigger.refresh();
  }
}

window.addEventListener('load', finalizeStoryLayout, { once: true });
