/**
 * Restores Story 5's readable source-order layout when animation cannot initialize.
 *
 * @param {unknown} error Animation initialization failure, when available
 * @returns {void}
 */
function enableStory5FlowingFallback(error) {
    const root = document.documentElement;

    window.hraStoryMotionEnabled = false;
    root.classList.remove("story-motion-enabled", "story5-animation-ready");
    root.classList.add("story-flowing");

    if (error) {
        console.error("Story 5 animation could not initialize; using the flowing layout.", error);
    }
}

if (window.hraStoryMotionEnabled && window.gsap && window.ScrollTrigger) {
  try {
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add("story5-animation-ready");
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
         var audio = new Audio('../../shared/assets/music/dramatic.swf.mp3');
         audio.play();
         audio.volume = 0.5;
     }  */

    //bg1
    ScrollTrigger.create({
      trigger: ".scene5-1",
      anticipatePin: 1,
      start: "top top",
      end: "+=400%",
      pin: true,
      pinSpacing: false,
    });
    ScrollTrigger.create({
      trigger: ".scene5-2",
      anticipatePin: 1,
      start: "top top",
      end: "+=600%",
      pin: true,
      pinSpacing: false,
    });
    ScrollTrigger.create({
      trigger: ".scene5-3",
      anticipatePin: 1,
      start: "top top",
      end: "+=300%",
      pin: true,
      pinSpacing: false,
    });
    ScrollTrigger.create({
      trigger: ".scene5-35",
      anticipatePin: 1,
      start: "top top",
      end: "+=300%",
      pin: true,
      pinSpacing: false,
    });
    ScrollTrigger.create({
      trigger: ".scene5-4",
      anticipatePin: 1,
      start: "top top",
      end: "+=800%",
      pin: true,
      pinSpacing: false,
    });
    ScrollTrigger.create({
      trigger: ".scene5-5",
      anticipatePin: 1,
      start: "top top",
      end: "+=300%",
      pin: true,
      pinSpacing: false,
    });
    ScrollTrigger.create({
      trigger: ".scene5-6",
      anticipatePin: 1,
      start: "top top",
      end: "+=300%",
      pin: true,
      pinSpacing: false,
    });
    ScrollTrigger.create({
      trigger: ".scene5-7",
      start: "top top",
      end: "+=100%",
    });
    ScrollTrigger.create({
      trigger: ".scene5-8",
      anticipatePin: 1,
      start: "top top",
      end: "+=520%",
      pin: true,
      pinSpacing: false,
    });
    ScrollTrigger.create({
      trigger: ".scene5-9",
      start: "top top",
      end: "+=100%",
    });
    ScrollTrigger.create({
      trigger: ".scene5-10",
      anticipatePin: 1,
      start: "top top",
      end: "+=420%",
      pin: true,
      pinSpacing: false,
    });
    ScrollTrigger.create({
      trigger: ".scene5-11",
      start: "top top",
      end: "+=100%",
    });
    ScrollTrigger.create({
      trigger: ".scene5-12",
      anticipatePin: 1,
      start: "top top",
      end: "+=620%",
      pin: true,
      pinSpacing: false,
    });
    ScrollTrigger.create({
      trigger: ".scene5-13",
      start: "top top",
      end: "+=100%",
    });
    ScrollTrigger.create({
      trigger: ".scene5-14",
      anticipatePin: 1,
      start: "top top",
      end: "+=320%",
      pin: true,
      pinSpacing: false,
    });
    ScrollTrigger.create({
      trigger: ".scene5-15",
      start: "top top",
      end: "+=100%",
    });
    /*  ScrollTrigger.create({
        trigger: ".scene5-155",
        start: "top top",
        end: "+=100%",
    }); */
    ScrollTrigger.create({
      trigger: ".scene5-16",
      anticipatePin: 1,
      start: "top top",
      end: "+=1200%",
      pin: true,
      pinSpacing: false,
    });
    ScrollTrigger.create({
      trigger: ".scene5-17",
      start: "top top",
      end: "+=100%",
      //onBackEnter: replayvideo4,
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

    gsap
      .timeline({
        scrollTrigger: {
          autoAlpha: 1,
          trigger: "#showbubble1",
          start: "top",
          end: "+=50%",
          scrub: true,
          duration: 1,
          pin: false,
        },
      })
      .to("#bubble1", {
        opacity: 1,
      });
  } catch (error) {
    enableStory5FlowingFallback(error);
  }
} else {
  enableStory5FlowingFallback();
}
