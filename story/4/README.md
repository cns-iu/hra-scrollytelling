# Story 4 — Data Detangle

Knowledge graphs and how they bring order to Human Reference Atlas data.
Published at `/story/4/`.

## Layout

```
index.html      the page; 8 inline illustration SVGs, ~380 KB
css/
  theme.css     canvas appearance, #four tokens, dark overrides
  base.css      document layout, typography, link roles
  splash.css    editorial title block, reading scrim, particle field
  scenes.css    pinned scene sequence, dialogue bubbles, SVG reveal hooks
  accessibility.css  motion toggle, flowing fallback, forced colors
js/
  story4.js            entry point; gates on motion, then calls the four setups
  app.js               setupParticles()
  animations.js        setupSceneTriggers()
  diagram-overview.js  setupDiagramOverview()
  diagram-detail.js    setupDiagramDetail()
  motion.js            classic script, runs in <head> before first paint
  particles.js         vendored particles.js, defines the particlesJS global
images/         22 PNGs referenced by the inline SVGs via xlink:href
config/         particles.json, kept as a reference copy
```

## Scene sequence

Scenes are numbered in the order they play, `.scene1` through `.scene8`, and the
class name, the DOM order and the reading order all agree.

Converted scenes use a native sticky stage: a tall section supplies the scroll
budget while the plate holds still and the prose column scrolls beside it. They
have no `ScrollTrigger.create` pin at all — only the `#Change*` timelines, which
are `pin: false` and scrub against the prose step that carries the matching id.

Scenes still on the old mechanism are pinned with `pinSpacing: false`, so they
reserve no scroll space of their own; the budget comes from the natural height of
each full-viewport block, and each `end: "+=N%"` says how long that layer stays
pinned.

| scene | mechanism | beats |
| --- | --- | --- |
| `.scene1` | sticky plate | Change1–Change5 |
| `.scene2` | sticky plate | datachange1 |
| `.scene3` | sticky plate | Change8, Change9 |
| `.scene4` | sticky plate | change13 |
| `.scene5` | pinned overlay | — |
| `.scene6` | pinned overlay | — |
| `.scene7` | pinned overlay | — |
| `.scene8` | pinned overlay | 9 beats |

## Outro budget

A converted scene's plate is a `position: sticky` stage, so it unsticks the
moment the section's bottom edge reaches the bottom of the stage - not when the
prose runs out. Everything below the last step is what keeps the plate on screen,
and it has two jobs:

- outlast the **last step**, so the closing paragraph is read beside the artwork
  rather than after it has gone; and
- outlast the **last artwork beat**, so the final state of the illustration is
  actually seen.

`--story4-scene-outro` on `#four .story4-scene` is that space, spent as the prose
column's bottom padding. Because the stage is a full `100svh` in two columns, the
trailing space has to exceed one viewport before the plate is present at all for
the last step; the base value is `90svh`, which with the step's own `55svh`
margin holds the plate for roughly `45svh` past the last step. Stacked, the band
is only `42svh`, so it unsticks far later and the override drops to `30svh`.

Scene 3 is a held scene, so its beats finish inside the hold and it needs no
extra outro in two columns. Stacked, where there is no hold, it keeps a `60svh`
override. See "Held scenes".

**Check this after changing step spacing, beat offsets, or the number of steps in
a scene.** For every scene, the section's release point (`section.bottom -
stage.height`) must sit after both the last step's top and the last beat's `end`.
Scene 1's beat slack is the tightest, around 150px on a short viewport.

## Held scenes

`.story4-scene--hold` stops the prose as well as the artwork: the step sticks
near the top of the viewport, the reader scrolls through the illustration's beats
with the text standing still, and only then does the column move on. Scene 3 is
the case for it - one short paragraph against an illustration that changes twice,
where the artwork is the content.

Three things have to line up, and each has a reason:

- **The hold's length is `.story4-scene__hold`, an empty spacer after the step -
  never the step's own margin.** A sticky box is constrained to its containing
  block's content box *reduced by its own margins*, so `margin-bottom` on the
  step buys it nothing: the margin box and the content box grow together and the
  travel stays exactly zero. Only a sibling adds room. `--story4-scene-hold` is
  that spacer's height and therefore the distance the step travels before it
  unsticks.
- **The step sticks at the prose column's leading padding** (`top: 35svh`), which
  is where it already sits when the section reaches the top of the viewport, so
  it settles rather than jumps.
- **The beats key to the section, not the step.** ScrollTrigger measures a
  trigger's position once per refresh and would read a stuck element's shifted
  rect, so a sticky element must never be a trigger. `#scene3-hold` is that
  handle, and its top is also the moment the step locks.

Stacked, the scene still holds - it just holds lower. The stage is an opaque band
across the top 42svh, so the step sticks just *below* that band rather than at
the top of the viewport, where it would be covered. The sequence starts later to
let the step clear the band, so it finishes at 120svh and the stacked hold is
140svh to outlast it. Both layouts key their beats to `#scene3-hold`; only the
offsets differ. That split lives in a `gsap.matchMedia()` block in
`js/diagram-overview.js`, keyed to the same 75rem breakpoint as the CSS - change
one and change the other.

### Holding only the last step

`.story4-scene--hold-last` is the lighter variant: instead of locking the whole
scene, it sticks only `.story4-step:last-of-type`, so earlier steps scroll
normally and just the closing pair holds. Scene 5 uses it - the list fills in
while the first paragraph scrolls past, then the node diagram and the sentence
naming it lock together. It needs the same `.story4-scene__hold` spacer, placed
after the last step, for the same reason: a sticky box gets no travel from its
own margin.

Scenes 5, 6 and 7 all use it. Scene 6 overrides `--story4-scene-hold` to 150svh
via `:has(.scene6)` - its artwork is static, three panels with no beats, so the
hold is the only thing giving the reader time with it; there is no sequence
resolving to carry the pause, and it was the shortest section on the page.

Measure the pairing, not the beat. Scene 5's node beat finished 701px before the
plate released, which sounded generous, but the *text* left 332px in - so the
finished diagram spent more time alone than beside the words explaining it. What
matters is the span where both are on screen: now 111-116% of a viewport in two
columns, 60% stacked, where the band caps it.

### Dwell

Three artwork states need three rests. Each beat is a short transition followed
by a stretch where nothing moves, and the gap between one beat's `end` and the
next one's `start` is that dwell. **They must not be equal.** Set back to back,
the first state changes the instant the scene sticks and the second lasts about
18% of a viewport - too fast to read, which is exactly how this scene shipped
before. Each state now rests for 42-77% of a viewport. Measure dwell by sampling
opacity across the scene and timing the runs where a state is pure, not by
reading the trigger offsets, which hide how little screen time a state gets.

## Stacked spacing

Below 75rem the stage is a 42svh band and two plates can be on screen at once
during a handoff. `--story4-band-gap` (40px) is the whitespace above and below
each plate, applied as the band's `padding-block`, **not** as margin: the band's
height is what the sticky geometry and scene 3's beat offsets are measured
against, so it has to stay exactly 42svh. Padding insets the plate within the
band; margin would move the band itself and shift every offset that tracks it.

The prose column is capped to the narrower of a readable measure (34rem) and the
plate's own width, then centred with `margin-inline: auto` so the text block and
the artwork share an edge. Text inside stays left aligned. `padding-inline: 1rem`
keeps it off that edge. Where the plate is width-bound rather than height-bound -
the narrowest phones - the plate spans the full width and the 1rem is measured
from the viewport instead.

## Remaining: scene 8

Scenes 1-7 use the plate-and-prose pattern. **Scene 8 is the only scene still on
the original pinned-overlay pattern**, and the only thing keeping that pattern's
code alive. It is the largest scene on the page:

| bubbles | beats | words | rasters | viewBox |
| --- | --- | --- | --- | --- |
| 14 | 8 | 315 | 13 | `1922 1082` (default - no ratio override needed) |

Everything serving it is isolated, so converting it and deleting the old pattern
are one job:

- `css/scenes.css` - the first block: `#four .scene8` and `#four .talkbubble`.
  The `height: 100vh` there is the original of the first plate-sizing trap below;
  narrowing that rule to `.scene8` means it no longer reaches converted scenes.
- `css/accessibility.css` - `html.story4-flowing #four .talkbubble`, its `> *`
  and `:empty` variants, and the forced-colors `> *` rule.
- `js/animations.js` - the `.scene8` `ScrollTrigger.create` pin and the
  `hraNarrativeTimeline.fadeTalkBubbles()` call.

**`.talkbubble` is deliberately not scoped to `.scene8`.** The bubbles are
siblings that follow the scene div rather than children of it, so
`.scene8 .talkbubble` matches nothing and silently drops the styling. Every
remaining `.talkbubble` in the document belongs to scene 8, so the bare selector
is already exact - verify with a count before assuming otherwise.

To convert it, follow scenes 5-7: prose first in source order, each untriggered
lead-in merged into the triggered fragment it introduces so every beat keeps a
step, ids moved from the bubbles onto the paragraphs, trailing empty bubble and
inline `top: -25vh` dropped. Then check the outro budget and, because it has
eight beats, the dwell between each - see "Dwell".

The frozen duplicate-ID baseline must not move; it is what proves no `id` was
lost while regrouping.

## Traps

Things that look like bugs but are not, and things that are easy to break:

- **Position comes from DOM order, not from the class name.** The names are
  sequential now, but nothing enforces that. They were originally 1, 15, 2, 17,
  16, 18, 19, 20 and played in that DOM order regardless, which read as a bug and
  was not one. If a scene is reordered, renumber it too.
- **The artwork's aspect ratio lives on the scene, not the plate.**
  `--story4-scene-ratio` is declared on `.story4-scene` and read by the plate as
  well as by the stacked prose's measure, which sizes itself to the plate so the
  text never overhangs the artwork above it. Declared on the plate it cannot
  inherit up to the prose column, and the `calc` there silently falls back and
  lets lines run *wider* than the uncapped column. A per-scene override goes on
  the scene for the same reason.
- **Stacked-layout rules must match the alternation's specificity.**
  `:nth-of-type(even)` adds a pseudo-class, so a bare `#four .story4-scene` in
  the narrow media query loses to it and the two-column layout survives onto
  phones.
- **Do not set `top` on a scene or bubble in CSS.** They are `position: static`
  until ScrollTrigger pins them, and the flowing fallback sets
  `inset: auto !important`. Four such declarations existed and had never applied
  once. Scroll position belongs to the triggers.
- **Two SVGs are deliberately short.** `.scene7`'s SVG is `height="90%"` and
  `.scene8`'s is `height="70%"` while the rest are `100%`. `.scene3` also has a
  different `viewBox` aspect (1921×1180 against 1922×1082) and an inline
  `style="top: 40vh"` that overrides the shared `top: 50vh`. These are artwork
  framing decisions; changing them moves the illustrations.
- **A beat that ends after the plate unsticks plays to nobody.** Every scene had
  this: the outro was `30svh` and the closing paragraph arrived 8-37px *after*
  the plate had left, while scenes 1 and 3 ran 172px and 529px of animation past
  it. Scene 3's was self-inflicted - a `start: "top -40%"` added when its three
  steps were merged into one. See "Outro budget".
- **Back-to-back beats read as one instant jump.** A beat that ends where the
  next begins gives the reader nothing to rest on. Scene 3's two beats were
  contiguous and its middle state held for 18% of a viewport. See "Dwell".
- **A step's own margin cannot make it sticky.** The sticky constraint rect is
  the containing block's content box minus the element's own margins, so a step
  with `margin-bottom: 80svh` inside a column sized by that same margin has zero
  travel and silently behaves as `static` - computed style still reads `sticky`,
  which makes it look like a browser bug. Hold distance comes from a sibling. See
  "Held scenes".
- **The splash gradient must stay dark.** `--story4-inverse-surface` and
  `-muted` carry white text, so they do not follow the theme. See the comment in
  `theme.css`.
- **The particle field brightens whatever is behind it.** It is why the splash
  has a reading scrim; without it the kicker measured 2.89:1. If the splash text
  or its colours change, re-measure against the gradient's lightest phase, not a
  flat background colour.

## Verifying a change

```bash
npm run check
```

The maintained-page checker requires the `story4-flowing` default class,
`js/motion.js`, the `data-story4-ambient-toggle` control, and that `story4.js`
gates `setupParticles` on `window.hraStory4MotionEnabled`. It also holds a frozen
45-entry duplicate-ID baseline for the inline SVGs — if that moves, something
changed inside the artwork.

Beyond the checkers, exercise all four states: light and dark, and enhanced and
reduced motion. Reduced motion switches to the flowing fallback, where the
scene summary becomes visible and the bubbles read in source order.
