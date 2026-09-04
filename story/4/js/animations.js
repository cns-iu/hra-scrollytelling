/**
 * Pins each illustration scene for the length of its scroll budget, then
 * hands the dialogue bubbles to the shared narrative timeline.
 *
 * @returns {void}
 */
export function setupSceneTriggers() {
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

    hraNarrativeTimeline.fadeTalkBubbles();

}
