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

## Traps

Things that look like bugs but are not, and things that are easy to break:

- **Position comes from DOM order, not from the class name.** The names are
  sequential now, but nothing enforces that. They were originally 1, 15, 2, 17,
  16, 18, 19, 20 and played in that DOM order regardless, which read as a bug and
  was not one. If a scene is reordered, renumber it too.
- **A per-scene `--story4-stage-ratio` override must come after the plate rule.**
  Both selectors carry one id and three classes, so source order decides. Placed
  earlier it loses silently and the plate renders at the wrong shape.
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
