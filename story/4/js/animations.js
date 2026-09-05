/**
 * Pins each illustration scene for the length of its scroll budget, then
 * hands the dialogue bubbles to the shared narrative timeline.
 *
 * @returns {void}
 */
export function setupSceneTriggers() {
    // .scene1 is not pinned here: it uses a native sticky stage in scenes.css,
    // so the illustration holds while its prose column scrolls past.


    ScrollTrigger.create({
      trigger: ".scene5",
      anticipatePin: 1,
      start: "top top",
      end: "+=400%",
      pin: true,
      pinSpacing: false,
    });
    ScrollTrigger.create({
      trigger: ".scene6",
      anticipatePin: 1,
      start: "top top",
      end: "+=200%",
      pin: true,
      pinSpacing: false,
    });
    ScrollTrigger.create({
      trigger: ".scene7",
      anticipatePin: 1,
      start: "top top",
      end: "+=400%",
      pin: true,
      pinSpacing: false,
    });
    ScrollTrigger.create({
      trigger: ".scene8",
      anticipatePin: 1,
      start: "top top",
      end: "+=1400%",
      pin: true,
      pinSpacing: false,
    });

    hraNarrativeTimeline.fadeTalkBubbles();

}
