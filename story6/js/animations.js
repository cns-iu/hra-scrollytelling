const PINNED_SCROLL_SCRUB = 0.6;

/**
 * Creates all pinned Story 6 timelines.
 *
 * @param {object} options Animation dependencies and state
 * @param {object} options.gsap GSAP runtime
 * @param {object} options.ScrollTrigger GSAP ScrollTrigger plugin
 * @param {boolean} options.prefersReducedMotion Whether the user requests reduced motion
 * @returns {void}
 */
export function setupStoryAnimations({ gsap, ScrollTrigger, prefersReducedMotion }) {
  if (prefersReducedMotion || !gsap || !ScrollTrigger) {
    return;
  }

  setupHeaderTimeline(gsap);
  setupCellIntroductionTimeline(gsap);
  createTextboxTransition(gsap, '.transition1');
  setupMouseTimeline(gsap);
  createTextboxTransition(gsap, '.transition2');
  createTextboxTransition(gsap, '.transition3');
  setupCdeTutorialTimeline(gsap);
  createTextboxTransition(gsap, '.transition5');
}

/**
 * Builds the splash-to-question timeline.
 *
 * @param {object} gsap GSAP runtime
 * @returns {void}
 */
function setupHeaderTimeline(gsap) {
  const question = document.querySelector('.textbox-transition1');

  gsap.set(question, { autoAlpha: 0 });

  const timeline = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: createPinnedTrigger('.page-header', '+=325%'),
  });

  timeline
    .to('.splash-image', { autoAlpha: 1, duration: 1 })
    .addLabel('headerTransition')
    .to('.splash-image', { autoAlpha: 0.25, duration: 1 }, 'headerTransition')
    .to('.title-card', { y: () => -window.innerHeight, duration: 1 }, 'headerTransition')
    .addLabel('headerQuestion')
    .to('.splash-image', { autoAlpha: 0.25, duration: 3.2 }, 'headerQuestion');

  addTextboxChoreography(timeline, question, null, null, 'headerQuestion+=0.25', 'headerQuestion+=0.72');
}

/**
 * Builds the initial cell-image crossfade.
 *
 * @param {object} gsap GSAP runtime
 * @returns {void}
 */
function setupCellIntroductionTimeline(gsap) {
  gsap.set('.picture2', { autoAlpha: 0 });

  gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: createPinnedTrigger('.section2', '+=250%'),
    })
    .to('.picture2', { autoAlpha: 0, duration: 1 })
    .to('.picture2', { autoAlpha: 1, duration: 0.5 })
    .to('.picture2', { autoAlpha: 1, duration: 1 });
}

/**
 * Builds the mouse-organ sequence.
 *
 * @param {object} gsap GSAP runtime
 * @returns {void}
 */
function setupMouseTimeline(gsap) {
  gsap.set('.thymus, .liver, .spleen, .pancreas', { autoAlpha: 0 });
  gsap.set('.all', { autoAlpha: 1 });

  gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: createPinnedTrigger('.section3', '+=500%'),
    })
    .to('.all', { autoAlpha: 1, duration: 1 })
    .to('.all', { autoAlpha: 0, duration: 0.2 })
    .to('.thymus', { autoAlpha: 1, duration: 0.2 }, '<')
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
}

/**
 * Builds the Cell Distance Explorer tutorial sequence.
 *
 * @param {object} gsap GSAP runtime
 * @returns {void}
 */
function setupCdeTutorialTimeline(gsap) {
  // Keep every ordered-list item in the accessibility tree while its visual
  // presentation is sequenced by scroll position.
  gsap.set('.tutorial-callout', { opacity: 0 });
  gsap.set('.section5 .tutorial', { autoAlpha: 0 });
  gsap.set('.section5 .tutorial1', { autoAlpha: 1 });
  gsap.set('.section5 .tutorial-images', { display: 'block' });

  const timeline = gsap.timeline({
    scrollTrigger: createScrubbedTrigger('.section5', 'bottom bottom', true),
  });

  const tutorialSteps = [
    { callout: '.tutorial-callout--1', image: '.tutorial1' },
    { callout: '.tutorial-callout--2', image: '.tutorial2' },
    { callout: '.tutorial-callout--3', image: '.tutorial3' },
    { callout: '.tutorial-callout--4', image: '.tutorial4' },
    { callout: '.tutorial-callout--5', image: '.tutorial5' },
  ];

  tutorialSteps.forEach(({ callout, image }, index) => {
    if (index === 1) {
      timeline
        .to(tutorialSteps[index - 1].image, { autoAlpha: 0, duration: 0.18, ease: 'power1.inOut' })
        .to(image, { autoAlpha: 1, duration: 0.18, ease: 'power1.inOut' }, '<');
    } else if (index > 1) {
      timeline.set(tutorialSteps[index - 1].image, { autoAlpha: 0 }).set(image, { autoAlpha: 1 }, '<');
    }

    timeline
      .fromTo(callout, { opacity: 0, y: 8, scale: 0.985 }, { opacity: 1, y: 0, scale: 1, duration: 0.18, ease: 'power2.out' })
      .fromTo(
        `${callout} .tutorial-callout__icon`,
        { autoAlpha: 0, scale: 0.9 },
        { autoAlpha: 1, scale: 1, duration: 0.14, ease: 'power2.out' },
        '<0.04',
      )
      .to(callout, { opacity: 1, duration: 0.68, ease: 'none' })
      .to(callout, { opacity: 0, y: -6, scale: 0.995, duration: 0.16, ease: 'power1.in' });
  });
}

/**
 * Creates a pinned transition with the shared editorial-heading choreography.
 *
 * @param {object} gsap GSAP runtime
 * @param {string} selector The transition section selector
 * @returns {object|null} The configured GSAP timeline
 */
function createTextboxTransition(gsap, selector) {
  const section = document.querySelector(selector);
  const textbox = section?.querySelector('.textbox-transition');

  if (!section || !textbox) {
    return null;
  }

  const overlay = section.querySelector('.transition__overlay');
  const timeline = gsap.timeline({
    scrollTrigger: createPinnedTrigger(section, '+=240%'),
  });

  return addTextboxChoreography(timeline, textbox, overlay, 0.15, 0.25, 0.72);
}

/**
 * Adds the shared editorial-heading entrance, emphasis, hold, and exit to a timeline.
 *
 * @param {object} timeline Timeline receiving the sequence
 * @param {HTMLElement} textbox Heading shown over the transition
 * @param {HTMLElement|null} overlay Contrast layer behind the heading
 * @param {string|number|null} overlayPosition Position where darkening begins
 * @param {string|number} textboxPosition Position where the heading enters
 * @param {string|number} emphasisPosition Position where the emphasis underline draws
 * @returns {object} The updated GSAP timeline
 */
function addTextboxChoreography(timeline, textbox, overlay, overlayPosition, textboxPosition, emphasisPosition) {
  const emphasis = textbox.querySelector('.transition-emphasis');

  if (overlay && overlayPosition !== null) {
    timeline.to(overlay, { opacity: 1, duration: 0.55, ease: 'power1.out' }, overlayPosition);
  }

  timeline.fromTo(
    textbox,
    { autoAlpha: 0, y: 24 },
    { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out', force3D: true },
    textboxPosition,
  );

  if (emphasis) {
    timeline.fromTo(
      emphasis,
      { backgroundSize: '0% 0.12em' },
      { backgroundSize: '100% 0.12em', duration: 0.45, ease: 'power2.out' },
      emphasisPosition,
    );
  }

  timeline
    .to(textbox, { autoAlpha: 1, duration: 1.35, ease: 'none' })
    .to(textbox, { autoAlpha: 0, y: -16, duration: 0.45, ease: 'power2.in', force3D: true });

  if (overlay) {
    timeline.to(overlay, { opacity: 0, duration: 0.45, ease: 'power1.in' }, '<');
  }

  return timeline;
}

/**
 * Returns the shared ScrollTrigger settings for a pinned scene.
 *
 * @param {string|HTMLElement} trigger Scene selector or element
 * @param {string} end Scroll distance for the pinned scene
 * @returns {object} ScrollTrigger configuration
 */
function createPinnedTrigger(trigger, end) {
  return {
    ...createScrubbedTrigger(trigger, end),
    pin: true,
    anticipatePin: 1,
  };
}

/**
 * Returns shared ScrollTrigger settings for a scrubbed scene.
 *
 * @param {string|HTMLElement} trigger Scene selector or element
 * @param {string} end Scroll distance or end position for the scene
 * @param {number|boolean} [scrub=PINNED_SCROLL_SCRUB] Scroll-to-animation synchronization behavior
 * @returns {object} ScrollTrigger configuration
 */
function createScrubbedTrigger(trigger, end, scrub = PINNED_SCROLL_SCRUB) {
  return {
    trigger,
    start: 'top 72px',
    end,
    scrub,
    invalidateOnRefresh: true,
  };
}
