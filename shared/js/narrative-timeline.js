/*
 * Shared narrative scroll timelines.
 *
 * Stories 2-5 were each written with their own copy of the same GSAP setup:
 * the intro fade and typewriter, and the five scroll-driven fade patterns
 * below. Every copy was byte-identical, so they live here once and each story
 * supplies only its own scene triggers.
 *
 * Loaded as a classic script after gsap and ScrollTrigger, matching how the
 * story animation files themselves load. Options exist so a future story can
 * vary a selector without forking the timeline again; the defaults reproduce
 * what Stories 2-5 already use.
 */
window.hraNarrativeTimeline = (() => {
  /**
   * Builds the pinned intro sequence and types the opening line.
   *
   * The line is typed from the ScrollTrigger rather than from `load`, so it
   * begins when the reader actually reaches the intro instead of running
   * itself out beforehand. The typed paragraph is `aria-hidden`; the same
   * sentence sits in the source as `.story-intro-summary` for assistive
   * technology, Reader View, and the no-JS case.
   *
   * @param {object} [options] Optional overrides
   * @param {string} [options.trigger] Pinned intro trigger selector
   * @param {string} [options.text] Line typed into the intro
   * @param {number} [options.speed] Milliseconds between characters
   * @param {string} [options.lineId] Element ID receiving the typed line
   * @returns {void}
   */
  function setupIntroTypewriter(options = {}) {
    const {
      trigger = ".fadeimage",
      text = "There are roughly 37 trillion cells in the human body.",
      speed = 40,
      lineId = "introTypeLine",
    } = options;

    const line = document.getElementById(lineId);

    let typewriterIndex = 0;
    let typing = false;

    /**
     * Reveals the animated intro line one character at a time.
     *
     * @returns {void}
     */
    function typeWriter() {
      if (!line || typewriterIndex >= text.length) {
        return;
      }

      line.textContent += text.charAt(typewriterIndex);
      typewriterIndex++;
      setTimeout(typeWriter, speed);
    }

    /**
     * Starts the typed line once, when the intro is actually on screen.
     *
     * @returns {void}
     */
    function startTypeWriter() {
      if (typing) {
        return;
      }

      typing = true;
      typeWriter();
    }

    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger,
          start: "top 00px",
          end: "bottom 0px",
          scrub: 1,
          duration: 1,
          pin: true,
          onEnter: startTypeWriter,
          onEnterBack: startTypeWriter,
          /* The intro sits at the top of the page, so it is usually already
             in view and onEnter never fires; refresh reports that case. */
          onRefresh: (self) => self.isActive && startTypeWriter(),
        },
      })

      .from(".picture2", {
        opacity: 0,
      })
      .from(".picture3", {
        opacity: 0,
      })
      .to(".picture3", {
        scale: 1.8,
      })
      .to(
        ".picture3",
        {
          scale: 1.8,
        },
        "+=2",
      );

  }

  /**
   * Pins each full-height caption block and cross-fades it while scrubbing.
   *
   * @param {string} [selector] Caption block selector
   * @returns {void}
   */
  function fadeContainers2(selector = ".container2") {
    gsap.utils.toArray(selector).forEach((container2) => {
      let tl = gsap.timeline({
        scrollTrigger: {
          onRefresh: (self) => self.progress && self.animation.progress(1),
          start: "top top",
          end: "+=100%",
          trigger: container2,
          pin: true,
          scrub: true,
          markers: false,
        },
      });

      tl.to(container2, {
        autoAlpha: 1,
      }).to(
        container2,
        {
          autoAlpha: 0,
        },
        0.5,
      );
    });
  }

  /**
   * Fades in scroll-following bubbles without pinning them.
   *
   * @param {string} [selector] Bubble selector
   * @returns {void}
   */
  function fadeScrollBubbles(selector = ".scrollbubble") {
    gsap.utils.toArray(selector).forEach((scrollbubble) => {
      let tl2 = gsap.timeline({
        scrollTrigger: {
          onRefresh: (self) => self.progress && self.animation.progress(1),
          start: "top +=200%",
          trigger: scrollbubble,
          pin: false,
          pinSpacing: false,
          scrub: true,
          markers: false,
        },
      });

      tl2.to(
        scrollbubble,
        {
          autoAlpha: 1,
        },
        0.5,
      );
    });
  }

  /**
   * Pins each scene container and cross-fades it while scrubbing.
   *
   * @param {string} [selector] Container selector
   * @returns {void}
   */
  function fadeContainers(selector = ".container") {
    gsap.utils.toArray(selector).forEach((container) => {
      let tl = gsap.timeline({
        scrollTrigger: {
          onRefresh: (self) => self.progress && self.animation.progress(1),
          start: "top top",
          trigger: container,
          pin: true,
          pinSpacing: false,
          scrub: true,
          markers: false,
        },
      });

      tl.to(container, {
        autoAlpha: 1,
      }).to(
        container,
        {
          autoAlpha: 0,
        },
        0.5,
      );
    });
  }

  /**
   * Pins and cross-fades overlay bubbles layered above a scene.
   *
   * @param {string} [selector] Overlay bubble selector
   * @returns {void}
   */
  function fadeOverlayBubbles(selector = ".overlaybubbles") {
    gsap.utils.toArray(selector).forEach((obubble) => {
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: obubble,
          pin: true,
          pinSpacing: false,
          scrub: true,
          markers: false,
        },
      });

      tl.to(obubble, {
        autoAlpha: 1,
      }).to(
        obubble,
        {
          autoAlpha: 0,
        },
        0.5,
      );
    });
  }

  /**
   * Pins and cross-fades character dialogue bubbles.
   *
   * The original copies set `scrub` twice in this configuration (0.5, then
   * true); the later value always won, so only `scrub: true` is kept, in the
   * position the first declaration occupied.
   *
   * @param {string} [selector] Dialogue bubble selector
   * @returns {void}
   */
  function fadeTalkBubbles(selector = ".talkbubble") {
    gsap.utils.toArray(selector).forEach((bubble) => {
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: bubble,
          start: "top top",
          scrub: true,
          pin: true,
          pinSpacing: false,
          markers: false,
        },
      });

      tl.to(bubble, {
        autoAlpha: 1,
      }).to(
        bubble,
        {
          autoAlpha: 0,
        },
        1.8,
      );
    });
  }

  return {
    setupIntroTypewriter,
    fadeContainers2,
    fadeScrollBubbles,
    fadeContainers,
    fadeOverlayBubbles,
    fadeTalkBubbles,
  };
})();
