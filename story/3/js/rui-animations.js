if (window.hraStoryMotionEnabled) {
    //drop in 1
    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          scrub: 0.2,
          trigger: ".imageintrosec",
          start: "-=50%",
          end: "top",
          scrub: true,
          pin: false,
        },
      })
      .from(".imageintro1", {
        opacity: 100,
      })
      .from(".imageintro2", {
        opacity: 0,
      })
      .from(".imageintro3", {
        opacity: 0,
      });

    //drop in 2
    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: ".scene3-8",
          start: "top",
          end: "+=200%",
          scrub: true,
          duration: 3,
          pin: false,
        },
      })
      .to("#kidneyorgan", {
        opacity: 0,
        delay: 1,
      });

    //drop in 3
    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: ".scene3-4",
          start: "top",
          end: "+=100%",
          scrub: true,
          duration: 3,
          pin: false,
        },
      })
      .to("#kidneypart1", {
        opacity: 0.8,
        delay: 1,
      })
      .to("#kidneypart2", {
        opacity: 0.8,
        delay: 1,
      })
      .to("#kidneypart3", {
        opacity: 0.8,
        delay: 1,
      })
      .to("#kidneypart4", {
        opacity: 0.8,
        delay: 1,
      });

    //change expression
    const timeline3 = gsap.timeline({
      scrollTrigger: {
        trigger: "#triggerworriedface0",
        onEnter: changebg3,
        onEnterBack: changebg3,
        markers: false,
        start: "top",
        end: "+=100%",
        id: "scene3-6",
      },
    });

    function changebg3() {
      var changebg = document.getElementById("changehere");
      changebg.style.backgroundImage = "url('images/rui-registration-scene.svg')";
    }

    //change expression
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: "#triggerworriedface1",
        onEnter: changebg,
        onEnterBack: changebg,
        // onLeave: rechangebg,
        markers: false,
        start: "top",
        end: "+=100%",
        id: "scene3-6",
      },
    });

    function changebg() {
      var changebg = document.getElementById("changehere");
      changebg.style.backgroundImage = "url('images/rui-collision-reaction.svg')";
    }

    function rechangebg() {
      var changebg = document.getElementById("changehere");
      changebg.style.backgroundImage = "url('images/rui-registration-scene.svg')";
    }

    //change expression
    const timeline2 = gsap.timeline({
      scrollTrigger: {
        trigger: "#triggerworriedface2",
        onEnter: changebg2,
        markers: false,
        start: "top",
        end: "+=100%",
        id: "scene3-6",
      },
    });

    function changebg2() {
      var changebg = document.getElementById("changehere");
      changebg.style.backgroundImage = "url('images/rui-collision-resolved.svg')";
    }

    // ui explain sectioni
    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: "#UiChange1",
          start: "top",
          end: "+=100%",
          scrub: true,
          duration: 3,
          pin: false,
        },
      })
      .to("#Rectangle1", {
        opacity: 0.8,
        delay: 1,
      })
      .to("#Rectangle1", {
        opacity: 0,
        delay: 1,
      });

    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: "#UiChange2",
          start: "top",
          end: "+=100%",
          scrub: true,
          duration: 3,
          pin: false,
        },
      })
      .to("#Rectangle2", {
        opacity: 0.8,
        delay: 1,
      })
      .to("#Rectangle2", {
        opacity: 0,
        delay: 1,
      });

    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: "#UiChange3",
          start: "top",
          end: "+=100%",
          scrub: true,
          duration: 3,
          pin: false,
        },
      })
      .to("#Rectangle5", {
        opacity: 0.8,
        delay: 1,
      })
      .to("#Rectangle5", {
        opacity: 0,
        delay: 1,
      });

    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: "#UiChange4",
          start: "top",
          end: "+=100%",
          scrub: true,
          duration: 3,
          pin: false,
        },
      })
      .to("#Rectangle3", {
        opacity: 0.8,
        delay: 1,
      })
      .to("#Rectangle3", {
        opacity: 0,
        delay: 1,
      });

    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: "#UiChange5",
          start: "top",
          end: "+=200%",
          scrub: true,
          duration: 3,
          pin: false,
        },
      })
      .to("#Rectangle6", {
        opacity: 0.8,
        delay: 0,
      })
      .to("#Rectangle6", {
        opacity: 0,
        delay: 1,
      });

    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: "#UiChange6",
          start: "top",
          end: "+=100%",
          scrub: true,
          duration: 3,
          pin: false,
        },
      })
      .to("#Rectangle4", {
        opacity: 0.8,
        delay: 1,
      })
      .to("#Rectangle4", {
        opacity: 0,
        delay: 1,
      });

    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: "#UiChange7",
          start: "top",
          end: "+=200%",
          scrub: true,
          duration: 3,
          pin: false,
        },
      })
      .to("#Rectangle7", {
        opacity: 1,
        delay: 1,
      });
}
