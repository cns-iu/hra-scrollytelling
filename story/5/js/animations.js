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
    hraNarrativeTimeline.setupIntroTypewriter();

    hraNarrativeTimeline.fadeContainers2();

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

    hraNarrativeTimeline.fadeContainers();

    hraNarrativeTimeline.fadeOverlayBubbles();

    hraNarrativeTimeline.fadeTalkBubbles();

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
