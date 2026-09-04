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

Scenes are pinned with `pinSpacing: false`, so they reserve no scroll space of
their own. The budget comes from the natural height of each full-viewport block,
and each `end: "+=N%"` says how long that layer stays pinned. Measured at
1440×900:

| order | scene | pin window | budget |
| --- | --- | --- | --- |
| 1 | `.scene1` | 900 → 9900 | +=1000% |
| 2 | `.scene15` | 10800 → 14400 | +=400% |
| 3 | `.scene2` | 15300 → 19800 | +=500% |
| 4 | `.scene17` | 20700 → 24300 | +=400% |
| 5 | `.scene16` | 25200 → 28800 | +=400% |
| 6 | `.scene18` | 29700 → 31500 | +=200% |
| 7 | `.scene19` | 32400 → 36000 | +=400% |
| 8 | `.scene20` | 36900 → 49500 | +=1400% |

Document scroll is 50,682px and the furthest trigger ends at 50,400px, so the
sequence fits with room to spare. The gaps between scenes are filled by
dialogue-bubble triggers, which interleave one per viewport.

## Traps

Things that look like bugs but are not, and things that are easy to break:

- **Scene names are not in visual order.** `.scene17` plays before `.scene16`,
  and `.scene15` plays second. Position comes from DOM order, not from the name
  or from the order of the `ScrollTrigger.create` calls in `animations.js`
  (which lists 16 before 17). Renaming them would be a large, risky diff for
  cosmetic gain.
- **Do not set `top` on a scene or bubble in CSS.** They are `position: static`
  until ScrollTrigger pins them, and the flowing fallback sets
  `inset: auto !important`. Four such declarations existed and had never applied
  once. Scroll position belongs to the triggers.
- **Two SVGs are deliberately short.** `.scene19`'s SVG is `height="90%"` and
  `.scene20`'s is `height="70%"` while the rest are `100%`. `.scene2` also has a
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
