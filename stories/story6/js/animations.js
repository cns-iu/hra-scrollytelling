const PINNED_SCROLL_SCRUB = 0.6;
const DIRECT_TOUCH_SCROLL_QUERY = '(hover: none) and (pointer: coarse)';

/**
 * Creates all pinned Story 6 timelines.
 *
 * @param {object} options Animation dependencies and state
 * @param {object} options.gsap GSAP runtime
 * @param {object} options.ScrollTrigger GSAP ScrollTrigger plugin
 * @returns {() => void} Function that reverts every Story 6 animation
 */
export function setupStoryAnimations({ gsap, ScrollTrigger }) {
    if (!gsap || !ScrollTrigger) {
        return () => {};
    }

    const timelines = [];

    try {
        timelines.push(setupHeaderTimeline(gsap));
        timelines.push(setupCellIntroductionTimeline(gsap));
        timelines.push(createTextboxTransition(gsap, '.transition1'));
        timelines.push(setupMouseTimeline(gsap));
        timelines.push(createTextboxTransition(gsap, '.transition2'));
        timelines.push(createTextboxTransition(gsap, '.transition3'));
        timelines.push(setupCdeTutorialTimeline(gsap));
        timelines.push(createTextboxTransition(gsap, '.transition5'));
    } catch (error) {
        revertTimelines(timelines);
        throw error;
    }

    return () => revertTimelines(timelines);
}

/**
 * Builds the splash-to-question timeline.
 *
 * @param {object} gsap GSAP runtime
 * @returns {object} Configured GSAP timeline
 */
function setupHeaderTimeline(gsap) {
    const question = document.querySelector('.textbox-transition1');
    const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: createPinnedTrigger('.page-header', '+=325%'),
    });

    timeline
        .set(question, { opacity: 0 })
        .to('.splash-image', { autoAlpha: 1, duration: 1 })
        .addLabel('headerTransition')
        .to('.splash-image', { autoAlpha: 0.25, duration: 1 }, 'headerTransition')
        .to('.page-header', { '--story-splash-overlay-opacity': 1, duration: 1 }, 'headerTransition')
        .to('.title-card', { y: () => -window.innerHeight, duration: 1 }, 'headerTransition')
        .addLabel('headerQuestion')
        .to('.splash-image', { autoAlpha: 0.25, duration: 3.2 }, 'headerQuestion');

    return addTextboxChoreography(timeline, question, null, null, 'headerQuestion+=0.25', 'headerQuestion+=0.72');
}

/**
 * Builds the initial cell-image crossfade.
 *
 * @param {object} gsap GSAP runtime
 * @returns {object} Configured GSAP timeline
 */
function setupCellIntroductionTimeline(gsap) {
    return gsap
        .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: createPinnedTrigger('.section2', '+=250%'),
        })
        .set('.picture2', { autoAlpha: 0 })
        .to('.picture2', { autoAlpha: 0, duration: 1 })
        .to('.picture2', { autoAlpha: 1, duration: 0.5 })
        .to('.picture2', { autoAlpha: 1, duration: 1 });
}

/**
 * Builds the mouse-organ sequence.
 *
 * @param {object} gsap GSAP runtime
 * @returns {object} Configured GSAP timeline
 */
function setupMouseTimeline(gsap) {
    return gsap
        .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: createPinnedTrigger('.section3', '+=500%'),
        })
        .set('.thymus, .liver, .spleen, .pancreas', { autoAlpha: 0 })
        .set('.all', { autoAlpha: 1 })
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
        .to('.pancreas', { autoAlpha: 1, duration: 0.8 });
}

/**
 * Builds the Cell Distance Explorer tutorial sequence.
 *
 * @param {object} gsap GSAP runtime
 * @returns {object} Configured GSAP timeline
 */
function setupCdeTutorialTimeline(gsap) {
    // Keep every ordered-list item in the accessibility tree while its visual
    // presentation is sequenced by scroll position.
    const timeline = gsap.timeline({
        scrollTrigger: createScrubbedTrigger('.section5', 'bottom bottom', true),
    });

    timeline
        .set('.tutorial-callout', { opacity: 0 })
        .set('.section5 .tutorial', { autoAlpha: 0 })
        .set('.section5 .tutorial1', { autoAlpha: 1 })
        .set('.section5 .tutorial-images', { display: 'block' });

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

    return timeline;
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
 * @param {HTMLElement} textbox Text shown over the transition
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
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', force3D: true },
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
        .to(textbox, { opacity: 1, duration: 1.35, ease: 'none' })
        .to(textbox, { opacity: 0, y: -16, duration: 0.45, ease: 'power2.in', force3D: true });

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
    const scrub = window.matchMedia(DIRECT_TOUCH_SCROLL_QUERY).matches ? true : PINNED_SCROLL_SCRUB;

    return {
        ...createScrubbedTrigger(trigger, end, scrub),
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
        start: 'top top',
        end,
        scrub,
        invalidateOnRefresh: true,
    };
}

/**
 * Reverts tracked timelines in reverse creation order exactly once.
 *
 * @param {Array<object|null>} timelines GSAP timelines to consume and revert
 * @returns {void}
 */
function revertTimelines(timelines) {
    while (timelines.length > 0) {
        revertTimeline(timelines.pop());
    }
}

/**
 * Reverts a timeline and its ScrollTrigger-created layout changes.
 *
 * @param {object|null} timeline GSAP timeline to revert
 * @returns {void}
 */
function revertTimeline(timeline) {
    if (!timeline) {
        return;
    }

    if (typeof timeline.revert === 'function') {
        timeline.revert();
        return;
    }

    timeline.scrollTrigger?.kill(true);
    timeline.kill();
}
