if (window.hraStoryMotionEnabled) {
    hraNarrativeTimeline.setupIntroTypewriter();

    hraNarrativeTimeline.fadeContainers2();

    /*  function playsound() {
         var audio = new Audio('../../shared/assets/music/dramatic.swf.mp3');
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
    hraNarrativeTimeline.fadeScrollBubbles();

    hraNarrativeTimeline.fadeContainers();

    hraNarrativeTimeline.fadeOverlayBubbles();

    hraNarrativeTimeline.fadeTalkBubbles();

}
