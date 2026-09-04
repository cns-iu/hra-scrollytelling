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
         var audio = new Audio('../../shared/assets/music/dramatic.swf.mp3');
         audio.play();
         audio.volume = 0.5;
     }  */

    //bg1
    ScrollTrigger.create({
      trigger: ".scene1",
      anticipatePin: 1,
      start: "top top",
      end: "+=400%",
      pin: true,
      pinSpacing: false,
    });

    ScrollTrigger.create({
      trigger: ".scene1-1",
      anticipatePin: 1,
      start: "top top",
      end: "+=600%",
      pin: true,
      pinSpacing: false,
    });

    ScrollTrigger.create({
      trigger: ".scene1-2",
      anticipatePin: 1,
      start: "top top",
      end: "+=400%",
      pin: true,
      pinSpacing: false,
    });

    //bg2
    ScrollTrigger.create({
      trigger: ".scene2",
      anticipatePin: 1,
      start: "top top",
      end: "+=400%",
      pin: true,
      pinSpacing: false,
    });

    //bg3
    ScrollTrigger.create({
      trigger: ".scene3",
      start: "top top",
      end: "+=500%",
      pin: true,
      pinSpacing: false,
    });

    //bg4
    ScrollTrigger.create({
      trigger: ".scene4",
      start: "top top",
      end: "+=700%",
      pin: true,
      pinSpacing: false,
    });

    //bg7
    ScrollTrigger.create({
      trigger: ".scene7",
      start: "top top",
      end: "+=400%",
      pin: true,
      pinSpacing: false,
    });

    //bg8
    ScrollTrigger.create({
      trigger: ".scene8",
      start: "top top",
      end: "+=200%",
      pin: true,
      pinSpacing: false,
    });

    ScrollTrigger.create({
      trigger: ".scene9",
      start: "top top",
      end: "+=200%",
      pin: true,
      pinSpacing: false,
    });

    ScrollTrigger.create({
      trigger: ".scene10",
      start: "top top",
      end: "+=200%",
      pin: true,
      pinSpacing: false,
    });

    ScrollTrigger.create({
      trigger: ".scene11",
      start: "top top",
      end: "+=300%",
      pin: true,
      pinSpacing: false,
    });

    ScrollTrigger.create({
      trigger: ".scene12",
      start: "top top",
      end: "+=600%",
      pin: true,
      pinSpacing: false,
    });

    ScrollTrigger.create({
      trigger: ".scene13",
      start: "top top",
      end: "+=400%",
      pin: true,
      pinSpacing: false,
    });

    ScrollTrigger.create({
      trigger: ".videozoom",
      start: "top top",
      end: "+=600%",
      pin: true,
      scrub: 1,
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

    //Line section
    gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

    gsap.set("#motionSVG", {
      autoAlpha: 1,
    });

    gsap.to("#motionSVG", {
      scrollTrigger: {
        trigger: "#motionPath",
        start: "top center",
        end: () =>
          "+=" +
          document.querySelector("#motionPath").getBoundingClientRect().height,
        scrub: 1.5,
        markers: false,
      },
      ease: pathEase("#motionPath"), // a custom ease that helps keep the tractor centered
      immediateRender: true,
      motionPath: {
        path: "#motionPath",
        align: "#motionPath",
        alignOrigin: [0.5, 0.5],
      },
    });

    // helper function that returns and ease that bends time to ensure the tractor stays relatively centered. Requires MotionPathPlugin of course
    function pathEase(path, axis = "y", precision = 1) {
      let rawPath = MotionPathPlugin.cacheRawPathMeasurements(
          MotionPathPlugin.getRawPath(gsap.utils.toArray(path)[0]),
          Math.round(precision * 12),
        ),
        useX = axis === "x",
        start = rawPath[0][useX ? 0 : 1],
        end =
          rawPath[rawPath.length - 1][
            rawPath[rawPath.length - 1].length - (useX ? 2 : 1)
          ],
        range = end - start,
        l = Math.round(precision * 200),
        inc = 1 / l,
        positions = [0],
        a = [],
        minIndex = 0,
        getClosest = (p) => {
          while (positions[minIndex] <= p && minIndex++ < l) {}
          a.push(
            ((p - positions[minIndex - 1]) /
              (positions[minIndex] - positions[minIndex - 1])) *
              inc +
              minIndex * inc,
          );
        },
        i = 1,
        p,
        v;
      for (; i < l; i++) {
        p = i / l;
        v = MotionPathPlugin.getPositionOnPath(rawPath, p)[axis];
        positions[i] = (v - start) / range;
      }
      positions[l] = 1;
      for (i = 0; i < l; i++) {
        getClosest(i / l);
      }
      a.push(1);
      return (p) => {
        let i = p * l,
          s = a[i | 0];
        return s + (a[Math.ceil(i)] - s) * (i % 1);
      };
    }
}
