if (window.hraStory4MotionEnabled) {
    //bg1
    ScrollTrigger.create({
      trigger: ".scene1",
      anticipatePin: 1,
      start: "top top",
      end: "+=1000%",
      pin: true,
      pinSpacing: false,
    });

    ScrollTrigger.create({
      trigger: ".scene15",
      anticipatePin: 1,
      start: "top top",
      end: "+=400%",
      pin: true,
      pinSpacing: false,
    });

    ScrollTrigger.create({
      trigger: ".scene2",
      anticipatePin: 1,
      start: "top top",
      end: "+=500%",
      pin: true,
      pinSpacing: false,
    });
    ScrollTrigger.create({
      trigger: ".scene16",
      anticipatePin: 1,
      start: "top top",
      end: "+=400%",
      pin: true,
      pinSpacing: false,
    });
    ScrollTrigger.create({
      trigger: ".scene17",
      anticipatePin: 1,
      start: "top top",
      end: "+=400%",
      pin: true,
      pinSpacing: false,
    });
    ScrollTrigger.create({
      trigger: ".scene18",
      anticipatePin: 1,
      start: "top top",
      end: "+=200%",
      pin: true,
      pinSpacing: false,
    });
    ScrollTrigger.create({
      trigger: ".scene19",
      anticipatePin: 1,
      start: "top top",
      end: "+=400%",
      pin: true,
      pinSpacing: false,
    });
    ScrollTrigger.create({
      trigger: ".scene20",
      anticipatePin: 1,
      start: "top top",
      end: "+=1400%",
      pin: true,
      pinSpacing: false,
    });

    //fade in txt
    const bubbles = gsap.utils.toArray(".talkbubble");
    bubbles.forEach((bubble) => {
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: bubble,
          start: "top top",
          scrub: 0.5,
          pin: true,
          pinSpacing: false,
          scrub: true,
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
