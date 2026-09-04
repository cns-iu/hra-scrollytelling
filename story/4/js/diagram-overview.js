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

    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: "#Change8",
          start: "top",
          end: "+=20%",
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
          trigger: "#Change9",
          start: "top",
          end: "+=20%",
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

    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: "#change12",
          start: "top",
          end: "+=20%",
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
          start: "top",
          end: "+=20%",
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
