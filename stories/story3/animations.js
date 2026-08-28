if (window.hraStoryMotionEnabled) {
    //intro part
    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: ".fadeimage",
          start: "top 00px",
          end: "bottom 0px",
          scrub: 1,
          duration: 1,
          pin: true,
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

    let typewriterIndex = 0;
    const typewriterText = "There are roughly 37 trillion cells in the human body.";
    const typewriterSpeed = 40;

    /**
     * Reveals the animated intro line one character at a time.
     *
     * @returns {void}
     */
    function typeWriter() {
      if (typewriterIndex < typewriterText.length) {
        document.getElementById("introTypeLine").textContent += typewriterText.charAt(typewriterIndex);
        typewriterIndex++;
        setTimeout(typeWriter, typewriterSpeed);
      }
    }
    window.addEventListener("load", typeWriter, { once: true });

    //fade in txt
    const containers2 = gsap.utils.toArray(".container2");
    containers2.forEach((container2) => {
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

    /*  function playsound() {
         var audio = new Audio('shared/assets/music/dramatic.swf.mp3');
         audio.play();
         audio.volume = 0.5;
     }  */

    //bg1
    ScrollTrigger.create({
      trigger: ".scene3-1",
      anticipatePin: 1,
      start: "top top",
      end: "+=500%",
      pin: true,
      pinSpacing: false,
    });

    ScrollTrigger.create({
      trigger: ".scene3-2",
      anticipatePin: 1,
      start: "top top",
      end: "+=400%",
      pin: true,
      pinSpacing: false,
    });
    ScrollTrigger.create({
      trigger: ".scene3-3",
      anticipatePin: 1,
      start: "top top",
      end: "+=400%",
      pin: true,
      pinSpacing: false,
    });
    ScrollTrigger.create({
      trigger: ".scene3-4",
      anticipatePin: 1,
      start: "top top",
      end: "+=500%",
      pin: true,
      pinSpacing: false,
    });
    ScrollTrigger.create({
      trigger: ".scene3-5",
      anticipatePin: 1,
      start: "top top",
      end: "+=500%",
      pin: true,
      pinSpacing: false,
    });
    ScrollTrigger.create({
      trigger: ".scene3-5-1",
      anticipatePin: 1,
      start: "top top",
      end: "+=1000%",
      pin: true,
      pinSpacing: false,
    });
    ScrollTrigger.create({
      trigger: ".scene3-6",
      anticipatePin: 1,
      start: "top top",
      end: "+=300%",
      pin: true,
      pinSpacing: false,
    });
    ScrollTrigger.create({
      trigger: ".scene3-7",
      anticipatePin: 1,
      start: "top top",
      end: "+=700%",
      pin: true,
      pinSpacing: false,
    });
    ScrollTrigger.create({
      trigger: ".scene3-8",
      anticipatePin: 1,
      start: "top top",
      end: "+=500%",
      pin: true,
      pinSpacing: false,
    });
    ScrollTrigger.create({
      trigger: ".scene3-9",
      anticipatePin: 1,
      start: "top top",
      end: "+=600%",
      pin: true,
      pinSpacing: false,
    });
    //fade in txt
    const scrollbubbles = gsap.utils.toArray(".scrollbubble");
    scrollbubbles.forEach((scrollbubble) => {
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

    //fade in txt
    const containers = gsap.utils.toArray(".container");
    containers.forEach((container) => {
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

    //fade in txt
    const overlays = gsap.utils.toArray(".overlaybubbles");
    overlays.forEach((obubble) => {
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
