/**
 * Scrubs the knowledge-graph overview: the source logos, the connecting
 * lines, and the triple that assembles from them.
 *
 * @returns {void}
 */
export function setupDiagramOverview() {
    // ui explain sectioni
    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: "#Change1",
          start: "top",
          end: "+=20%",
          scrub: true,
          duration: 3,
          pin: false,
        },
      })
      .to("#LogoLine1,#Line,#LogoLine2,#LogoLine3", {
        stroke: "rgb(0,0,0)",
      })
      .to("#SideLogos", {
        opacity: 1,
        duration: 0,
      })
      .to("#LogoLine1", {
        stroke: "rgb(255,0,55)",
        strokeWidth: 10,
        duration: 0,
      })
      .to("#LogoLine2", {
        stroke: "rgb(255,0,55)",
        strokeWidth: 10,
        duration: 0,
      })
      .to("#LogoLine3", {
        stroke: "rgb(255,0,55)",
        strokeWidth: 10,
        duration: 0,
      });

    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: "#Change2",
          start: "top",
          end: "+=20%",
          scrub: true,
          duration: 3,
          pin: false,
        },
      })
      .to("#TypeLogos", {
        opacity: 1,
      });

    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: "#Change3",
          start: "top",
          end: "+=20%",
          scrub: true,
          duration: 3,
          pin: false,
        },
      })
      .to("#Mess", {
        opacity: 1,
      })

      .to("#TypeLogos", {
        opacity: 1,
      });

    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: "#Change4",
          start: "top",
          end: "+=20%",
          scrub: true,
          duration: 3,
          pin: false,
        },
      })
      .to("#Locks", {
        opacity: 1,
      });

    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: "#Change5",
          start: "top",
          end: "+=20%",
          scrub: true,
          duration: 1,
          pin: false,
        },
      })
      .to("#Locks,#Mess,#TypeLogos,#SideLogos", {
        opacity: 0,
      })
      .to("#LogoLine1,#Line,#LogoLine2,#LogoLine3", {
        stroke: "rgb(0,0,0)",
        strokeWidth: 4,
      });

    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: "#Change6",
          start: "top",
          end: "+=20%",
          scrub: true,
          duration: 3,
          pin: false,
        },
      })
      .to("#EatingSystem,#BreathingSystem", {
        opacity: 0,
      })
      .to("#Systempt2", {
        opacity: 1,
      });

    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: "#Change7",
          start: "top",
          end: "+=20%",
          scrub: true,
          duration: 3,
          pin: false,
        },
      })
      .to("#Systempt3", {
        opacity: 1,
      });

    /*
     * Scene 3's prose is one short paragraph carrying two artwork beats, and the
     * two layouts want different timing for them.
     *
     * The illustration has three states - the initial diagram, the system with
     * Systempt4/Purple added, and the combined view - so the reader needs to
     * rest on each one. A change that lands and immediately begins the next
     * cannot be read. Each beat therefore gets a short transition followed by a
     * DWELL, a stretch of scrolling where nothing moves and the state can be
     * taken in. The gap between `first.end` and `second.start` is that dwell;
     * they must not be equal, which is the bug this replaced - the second beat
     * started on the exact scroll position the first one finished.
     *
     * Held (two columns): the step is sticky, so the beats hang off the SECTION
     * instead. ScrollTrigger measures a trigger's position once per refresh and
     * would read a stuck element's shifted rect, so a sticky element must never
     * be a trigger. The section's top is also the moment the step locks, so the
     * first beat is delayed past it to leave the opening state readable while
     * the text settles.
     *
     * Stacked works the same way, only lower: the stage is an opaque band across
     * the top of the viewport, so the step holds just below it. Both layouts
     * therefore key to the section and differ only in how far past its top the
     * sequence begins - stacked starts later because the step needs to clear the
     * band first. Keying to the step instead is what broke this: `start: "top"`
     * fires when the step reaches the top of the VIEWPORT, by which point it is
     * behind the band, and the sequence ran several hundred pixels after the
     * prose had gone.
     */
    gsap.matchMedia().add(
      {
        held: "(min-width: 75.0625rem)",
        stacked: "(max-width: 75rem)",
      },
      (context) => {
        const { held } = context.conditions;
        const first = held
          ? { start: "top -15%", end: "+=20%" }
          : { start: "top -45%", end: "+=20%" };
        const second = held
          ? { start: "top -70%", end: "+=20%" }
          : { start: "top -100%", end: "+=20%" };
        const trigger = "#scene3-hold";

        gsap
          .timeline({
            scrollTrigger: {
              autoAlpha: 1,
              trigger,
              start: first.start,
              end: first.end,
              scrub: true,
              duration: 3,
              pin: false,
            },
          })
          .to("#Systempt4,#Purple", {
            opacity: 1,
          });

        gsap
          .timeline({
            scrollTrigger: {
              autoAlpha: 1,
              trigger,
              start: second.start,
              end: second.end,
              scrub: true,
              duration: 3,
              pin: false,
            },
          })
          .to("#Initial", {
            opacity: 0,
          })
          .to("#Combined", {
            opacity: 1,
          });
      },
    );

    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: "#datachange1",
          start: "top",
          end: "+=20%",
          scrub: true,
          duration: 3,
          pin: false,
        },
      })
      .to("#Data1", {
        opacity: 0,
      })
      .to("#Data2", {
        opacity: 1,
      });

    /*
     * Scene 5's two beats fire as their step rises into the reading zone, not
     * when it reaches the top of the viewport. `start: "top"` is `"top top"`,
     * which lands about a full viewport too late here: the list stayed empty for
     * the whole time its paragraph was readable and only filled in once that
     * paragraph had scrolled off the top edge, so the reader watched a blank
     * notepad while reading about it.
     *
     * `top 75%` puts the beat just after the step enters from the bottom, so the
     * artwork resolves while the words are still moving up the column.
     */
    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: "#change12",
          start: "top 75%",
          /* Longer than the list beat: this is the payoff image, and it wants
             time on screen before the plate releases. */
          end: "+=45%",
          scrub: true,
          duration: 3,
          pin: false,
        },
      })
      .to("#likedthing2", {
        opacity: 0,
      })
      .to("#likedthing", {
        opacity: 1,
      });

    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: "#change11",
          start: "top 75%",
          end: "+=25%",
          scrub: true,
          duration: 3,
          pin: false,
        },
      })
      .to("#Like1", {
        opacity: 1,
      })
      .to("#Like2", {
        opacity: 1,
      })
      .to("#Like3", {
        opacity: 1,
      })
      .to("#Like4", {
        opacity: 1,
      })
      .to("#Like5", {
        opacity: 1,
      })
      .to("#Like6", {
        opacity: 1,
      })
      .to("#Like7", {
        opacity: 1,
      })
      .to("#Like8", {
        opacity: 1,
      });
}
