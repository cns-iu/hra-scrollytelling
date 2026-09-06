/**
 * Scrubs the close-up sequence that walks through a single triple and the
 * reference organ it resolves to.
 *
 * @returns {void}
 *
 * Every beat here starts at `top 75%` - the step entering from the bottom of the
 * viewport - rather than the `start: "top"` these timelines were authored with.
 * `"top"` means `"top top"`, the step reaching the top of the VIEWPORT, which is
 * roughly a full viewport after the reader has read it: the artwork resolved
 * only once its paragraph had scrolled away. That timing suited the original
 * pinned-overlay pattern, where text was drawn over the artwork; it does not
 * suit a prose column beside it.
 */
export function setupDiagramDetail() {
    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: "#change13",
          start: "top 75%",
          end: "+=50%",
          scrub: true,
          duration: 3,
          pin: false,
        },
      })
      .to("#Brand1", {
        opacity: 1,
      })
      .to("#Brand2", {
        opacity: 1,
      })
      .to("#Brand3", {
        opacity: 1,
      })
      .to("#Brand4", {
        opacity: 1,
      });

    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          /* Starts earlier than the file default and runs long: this is the
             diagram its sentence is describing, and the densest image in the
             story. */
          trigger: "#change14",
          start: "top 95%",
          end: "+=45%",
          scrub: true,
          duration: 3,
          pin: false,
        },
      })
      .to("#RDF1", {
        opacity: 1,
      })
      .to("#RDF2", {
        opacity: 1,
      });

    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: "#change15",
          start: "top 75%",
          end: "+=20%",
          scrub: true,
          duration: 3,
          pin: false,
        },
      })
      .to("#closeuplinks1", {
        opacity: 1,
      });

    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: "#change16",
          start: "top 75%",
          end: "+=20%",
          scrub: true,
          duration: 3,
          pin: false,
        },
      })
      .to("#subjecthighlight", {
        opacity: 0.2,
      });

    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: "#change17",
          start: "top 75%",
          end: "+=20%",
          scrub: true,
          duration: 3,
          pin: false,
        },
      })
      .to("#subjecthighlight", {
        opacity: 0,
      })
      .to("#objecthighlight", {
        opacity: 0.2,
      });

    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: "#change18",
          start: "top 75%",
          end: "+=20%",
          scrub: true,
          duration: 3,
          pin: false,
        },
      })
      .to("#objecthighlight", {
        opacity: 0,
      })
      .to("#predicatehighlight", {
        opacity: 0.2,
      });

    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: "#change19",
          start: "top 75%",
          end: "+=20%",
          scrub: true,
          duration: 0,
          pin: false,
        },
      })
      .to("#predicatehighlight", {
        opacity: 0,
      })
      .to("#closeuplinks1", {
        opacity: 0,
      })
      .to("#closeuplinks0", {
        opacity: 0,
      })
      .to("#closeuplinks2", {
        opacity: 1,
      })
      .to("#closeup1", {
        opacity: 1,
      });

    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: "#changecloseup1",
          start: "top 75%",
          end: "+=20%",
          scrub: true,
          duration: 0,
          pin: false,
        },
      })
      .to("#closeup1", {
        opacity: 0,
      })
      .to("#closeup2", {
        opacity: 1,
      });

    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: "#changecloseup2",
          start: "top 75%",
          end: "+=20%",
          scrub: true,
          duration: 0,
          pin: false,
        },
      })
      .to("#closeup2", {
        opacity: 0,
      })
      .to("#closeup3", {
        opacity: 1,
      });

    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: "#change20",
          start: "top 75%",
          end: "+=20%",
          scrub: true,
          duration: 0,
          pin: false,
        },
      })

      .to("#closeuplinks2", {
        opacity: 0,
      })
      .to("#closeuplinks3", {
        opacity: 1,
      });

    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          /* These last two beats are long multi-step sequences, and their steps
             sit closer together than the sequences are long - at +=80% each they
             overlapped by 90px, so the network was still cycling when the next
             beat began recolouring it. Shortened to fit the gap between them. */
          trigger: "#change21",
          start: "top 75%",
          end: "+=45%",
          scrub: true,
          duration: 10,
          pin: false,
        },
      })
      .to("#closeuplinks3", {
        opacity: 0,
      })
      .to("#closeuplinks4", {
        opacity: 1,
      })
      .to("#closeuplinks4", {
        opacity: 0,
      })
      .to("#closeuplinks5", {
        opacity: 1,
      })
      .to("#closeuplinks5", {
        opacity: 0,
      })
      .to("#closeuplinks6", {
        opacity: 1,
      })
      .to("#closeuplinks6", {
        opacity: 0,
      })
      .to("#closeuplinks65", {
        opacity: 1,
      })
      .to("#closeuplinks65", {
        opacity: 0,
      })
      .to("#closeuplinks66", {
        opacity: 1,
      })

      .to("#closeuplinks68", {
        opacity: 1,
      })
      .to("#closeuplinks66", {
        opacity: 0,
      })
      .to("#closeuplinks7", {
        opacity: 1,
      });

    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: "#change22",
          start: "top 75%",
          end: "+=45%",
          scrub: true,
          duration: 10,
          pin: false,
        },
      })

      .to("#closeuplinks7", {
        opacity: 0,
      })
      .to("#closeuplinks8", {
        opacity: 1,
      })
      .to("#closeuplinks68", {
        opacity: 0,
      })
      .to("#closeuplinks8", {
        opacity: 0,
      })
      .to("#closeuplinks9", {
        opacity: 1,
      })
      .to("#closeuplinks9", {
        opacity: 0,
      })
      .to("#closeuplinks10", {
        opacity: 1,
      });
}
