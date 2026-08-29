# Repository Architecture

This document describes the current ownership boundaries and the intended path toward a more maintainable repository.
The site is served directly by GitHub Pages, so file locations and letter casing are part of the public interface.

## Stability rules

- Keep `index.html` and the root `story*.html` entry points at their current URLs.
- Place new story entry points at `story/<number>/index.html` so they publish at `/story/<number>/`; do not move the
  repository landing-page `index.html` into a story directory.
- Treat the current `stories/storyN/` directories and root Story 1–6 entry points as legacy-but-maintained paths until
  each story receives an explicitly approved, copy-first migration with compatibility planning.
- Keep `story0.html`, `VisualizingCells.html`, and `organExample.html` as compatibility entry points for the organized
  prototype implementations.
- Keep landing-page-specific implementation under `landing/`; keep approved landing-and-story fonts and page chrome
  under `shared/`.
- Root `style.css` has been removed; keep shared foundations under `shared/css/` and story-specific presentation under
  its owning story instead of recreating a root stylesheet.
- Keep the narrative foundation and character-dialogue system shared by Stories 2, 3, and 5 under `shared/css/`, with
  filenames that distinguish them from the page-chrome styles in the same directory.
- Keep the shared end-matter presentation under `shared/css/story-end-matter.css`; keep content in each story's
  `end-matter.json` and generate committed semantic markup with `tools/render-story-end-matter.mjs`.
- Keep `.story-narrative` as the shared page contract for Stories 2, 3, and 5; story-specific page classes own scene
  tokens and positioning variants.
- Do not restore a root `js/` directory; scripts belong under their owning page, story, prototype, or shared component.
- Keep shared story and prototype audio under `shared/assets/music/`.
- Do not mechanically format `story3.html` or `story4.html`; both contain large embedded data.
- Move files in small batches and run the local-reference checker before and after every batch.

## Current ownership

| Area | Entry points | Implementation |
| --- | --- | --- |
| Landing page | `index.html` | `landing/assets/`, `landing/css/`, landing initialization under `landing/js/`, and shared HRA fonts and page chrome |
| Shared page chrome | `index.html` and `story1.html` through `story6.html` | Namespaced fonts, styles, assets, and progressive-enhancement modules under `shared/`; the landing page and Story 6 offer appearance controls |
| Primary stories | `story1.html` through `story6.html` | Stories 1, 4, and 6 use dedicated implementations; Stories 2, 3, and 5 share their narrative foundation and character-dialogue system; all six stories use shared generated end matter and end-of-story navigation; story media lives under its owning story or the appropriate shared asset directory |
| New stories | `story/<number>/index.html` | Singular numbered directories own each new story's entry point and exclusive implementation files; `story/7/README.md` defines the initial contract |
| Prototypes | Compatibility pages `story0.html`, `VisualizingCells.html`, and `organExample.html` | Organized implementations and owned assets under `prototypes/`, plus intentionally shared assets; all prototype implementations are independent of the former root legacy stylesheet |

Some story pages load established libraries from content-delivery networks. The repository has no package manager or
build step, but those existing runtime integrations must still be preserved during story migrations.

## Intended organization

Root HTML files remain stable public entry points while their implementation files are gradually compartmentalized:

```text
.
├── index.html
├── story1.html
├── story2.html
├── story3.html
├── story4.html
├── story5.html
├── story/
│   └── 7/
│       └── README.md
├── landing/
├── shared/
│   ├── assets/
│   │   ├── fonts/
│   │   ├── icons/
│   │   ├── images/
│   │   ├── logos/
│   │   ├── music/
│   │   └── videos/
│   ├── css/
│   │   ├── appearance-controls.css
│   │   ├── character-dialogue.css
│   │   ├── narrative-accessibility.css
│   │   ├── narrative-foundation.css
│   │   └── story-end-matter.css
│   └── js/
│       └── narrative-motion.js
├── prototypes/
│   ├── drag-and-drop/
│   │   ├── images/
│   │   └── index.html
│   ├── organ-example/
│   │   ├── images/
│   │   ├── index.html
│   │   └── styles.css
│   ├── scrollytelling-effects/
│   │   ├── effects.css
│   │   ├── images/
│   │   ├── index.html
│   │   ├── models/
│   │   ├── navigation.css
│   │   ├── scripts.js
│   │   ├── styles.css
│   │   └── wc.js
│   ├── shared/
│   │   ├── chrome.css
│   │   └── typography.css
│   └── visualizing-cells/
│       ├── images/
│       ├── index.html
│       ├── styles.css
│       └── videos/
├── stories/
│   ├── story1/
│   │   ├── accessibility.css
│   │   ├── images/
│   │   │   └── hra-scale-overview.png
│   │   ├── motion-control.js
│   │   ├── reveals.js
│   │   ├── story1.css
│   │   └── videos/
│   ├── story2/
│   │   ├── animations.js
│   │   ├── images/
│   │   ├── quiz.css
│   │   ├── quiz.js
│   │   └── styles.css
│   ├── story3/
│   │   ├── animations.js
│   │   ├── images/
│   │   ├── rui-animations.js
│   │   └── styles.css
│   ├── story4/
│   │   ├── accessibility.css
│   │   ├── app.js
│   │   ├── animations.js
│   │   ├── diagram-detail.js
│   │   ├── diagram-overview.js
│   │   ├── images/
│   │   ├── motion.js
│   │   ├── particles.js
│   │   ├── styles.css
│   │   └── config/
│   │       └── particles.json
│   └── story5/
│       ├── accessibility.css
│       ├── animations.js
│       ├── images/
│       ├── media-controls.js
│       ├── styles.css
│       └── videos/
├── docs/
└── tools/
```

The former root `img/` directory was removed after its drag-and-drop answer demo and SVG assets were consolidated under
`prototypes/drag-and-drop/`. Do not recreate the root directory.

Stories 2, 3, and 5 load `shared/css/narrative-foundation.css` and `shared/css/character-dialogue.css`. These shared
styles own their common semantic `.story-narrative` page foundation, Nunito Sans narrative body, enhanced full-screen
containers, introductory character treatment, layered imagery, and dialogue presentation. `shared/css/narrative-accessibility.css` and
`shared/js/narrative-motion.js` own the readable flowing mode used without JavaScript, with reduced motion, and on
short viewports. Portrait phone widths retain the enhanced scroll presentation. Story-specific scenes, interactive
controls, positioning modifiers, and visual tokens remain outside these shared files.

All six maintained stories load `shared/css/story-end-matter.css`. Resources, optional acknowledgments, and optional
references are authored in `end-matter.json` inside each story's owning directory. The dependency-free
`tools/story-end-matter-schema.mjs` validates those sources, and `tools/render-story-end-matter.mjs` replaces marked
blocks in the root story entry points.
Generated HTML remains committed so no JavaScript is required at runtime and Firefox Reader View retains complete,
ordered end matter. Stories 1–5 apply the fixed Light component treatment; Story 6 follows its shared appearance
selection.

The version 1 authoring shape is intentionally small:

- `resources`: `title`, optional `intro`, and `items` containing `eyebrow`, `title`, `description`, `href`, and optional
  `newTab`
- `acknowledgments`: `title`, optional `intro`, labeled `items`, and optional `funding` and linked `funders`
- `references`: `title`, optional `intro`, and structured `items` typed as `journal-article`, `preprint`, or `webpage`

At least one section is required. Omitted sections are not rendered, so older stories do not receive invented
acknowledgments or citations.

`landing/css/fonts.css` remains as a compatibility bridge for cached landing-page documents. Maintained HTML entry
points load `shared/css/fonts.css` directly; do not expand the compatibility file into a second font source.

Story 1 keeps presentation and responsive layout in `stories/story1/story1.css`, motion and user-preference states in
`stories/story1/accessibility.css`, animated-media controls in `stories/story1/motion-control.js`, and scroll-triggered
progressive enhancement in `stories/story1/reveals.js`. Its reveals use browser APIs and do not require a third-party
animation runtime. Story 1 is independent of the former root legacy `style.css`.

Story 1 owns its video backgrounds under `stories/story1/videos/`. The GIF sequence and MP4 it shares with the
Scrollytelling Effects prototype live under `shared/assets/images/` and `shared/assets/videos/`.

Story 2 contains 11 repeated ID values across its large inline SVG illustrations: `branchoff`, `Group-3`, `Group-4`,
`Group`, `Group-5`, `Rectangle`, `Oval`, `Combined-Shape`, `Group-2`, `Path`, and `Triangle`. These generated drawing
labels predate the organized Story 2 asset directory and are not currently targeted by repository CSS, JavaScript,
fragment links, or SVG `href` references. They remain invalid duplicate document IDs and must not be treated as an
accepted markup pattern. Clean them up as a separate SVG-maintenance change, using unique story-scoped IDs or removing
unneeded IDs, and visually regression-test every affected illustration before and after the change.

Story 2 owns its story-specific scenes, video treatment, and legacy quiz layout under `stories/story2/styles.css`.
Its focused quiz component remains separated into `stories/story2/quiz.css` and `stories/story2/quiz.js`. Story 2
owns its scroll-driven runtime in `stories/story2/animations.js`; only this story loads MotionPathPlugin because its
motion-path scene consumes that plugin. Story 2
owns its scoped quiz color tokens and retains a single remote Inter request because its generated inline SVG labels
still specify Inter. Its narrative body uses the shared self-hosted Nunito Sans foundation.

Story 3 owns its story-specific scene and embedded-artwork presentation under `stories/story3/styles.css`, and its
confirmed narrative scenes, collision-state artwork, and kidney variations under
`stories/story3/images/`. The body-intro layers and telescope shared with other stories live under
`shared/assets/images/`; the common favicon lives under `shared/assets/icons/`. Story 3 uses the shared
self-hosted Nunito Sans narrative font, and its large inline SVG markup remains deferred to a separate migration.
That generated SVG markup retains 18 pre-existing repeated ID values. The semantic page, motion, and inline-style
migrations do not modify those generated identifiers; resolve them only in a dedicated visual-regression pass.
Story 3's shared intro and dialogue timelines live in `stories/story3/animations.js`, while RUI-specific illustration
timelines live in `stories/story3/rui-animations.js`.

Story 4 owns its presentation, static accessibility layout, motion gate, particle runtime, configuration initializer,
and three focused animation modules in `stories/story4/`. It defaults to a
readable `.story4-flowing` document when JavaScript is unavailable, reduced motion is requested, or the viewport is
too short for pinned scenes. Portrait phone widths retain the enhanced presentation. Its enhanced header provides a
visible control to hide ambient animation.
The unused ScrollMagic, MotionPathPlugin, Bootstrap bundle, and blank Bootstrap starter hook were removed. Story 4 is
independent of the former root legacy
`style.css`; all three page and embedded-SVG stylesheet references resolve to `stories/story4/styles.css`. Its 24
inline SVG image elements remain embedded in `story4.html`; its common favicon uses the organized shared asset
directory. The Scrollytelling Effects prototype owns its complete `wc.js` web-component
bundle alongside its prototype script. The
former root `js/` directory was removed after repository-wide auditing confirmed that
`jquery-3.6.3.min.js` and `magnifier.js` had no remaining consumers and that `runtime.js`, `polyfills.js`, and `main.js`
were redundant build fragments embedded byte-for-byte within the consumed prototype bundle.

Story 4's embedded SVG illustrations contain 47 repeated ID values across 519 ID attributes. Some of those values are
consumed by Story 4 animation selectors, gradients, masks, or other SVG fragment references, so they were intentionally
left unchanged during the stylesheet migration. Treat them as a known invalid-markup baseline and clean them up only
as a separate embedded-SVG migration with before-and-after animation and illustration regression testing.

Story 5 owns its story-specific scene and media-control presentation under `stories/story5/styles.css`, its scene
backgrounds, narrative illustrations, and media-control icons under `stories/story5/images/`, and its six videos
under `stories/story5/videos/`. The body-intro layers and telescope shared with other stories live under
`shared/assets/images/`; the common favicon lives under `shared/assets/icons/`. Story 5
uses the shared self-hosted Nunito Sans narrative font. Its scroll animation lives in `animations.js`, while
`media-controls.js` owns scoped event listeners for the six video sequences and their visible play, pause, replay,
previous-section, and next-section controls. Flowing mode removes autoplay and exposes native video controls.

`tools/check-maintained-pages.mjs` enforces maintained-page metadata, shared chrome, stylesheet order, heading and
motion contracts, fragment and ARIA references, new-tab safety, and the absence of inline event handlers and retired
runtimes. It also freezes the known duplicate-ID signatures in the embedded SVG artwork for Stories 2–4 so new ID
regressions fail without presenting existing generated-artwork debt as newly introduced.

Each retained prototype owns its exclusive images, videos, models, and dedicated presentation beneath its directory.
Prototype-only shared artwork lives under `prototypes/shared/`; assets shared with a maintained story live under
`shared/assets/`. All four prototype implementations are independent of the former root legacy `style.css`. Scrollytelling
Effects separates page and demonstration presentation in `styles.css`, interactive effects in `effects.css`, and its
right-side table of contents and content framing in `navigation.css`.
All prototype entry points load `shared/css/fonts.css` and use `prototypes/shared/typography.css` to default
prototype-owned content to Nunito Sans. Prototype-owned styles may select Metropolis where specified. The generated
Scrollytelling Effects web-component bundle retains its encapsulated internal typography and is not hand-edited for
page-level font alignment.

## Shared page chrome

The maintained public pages are `index.html` and `story1.html` through `story6.html`. They share three interface
patterns:

- A fixed, visibly labeled Menu disclosure with links to the landing page and all maintained stories.
- A canonical shared footer with organization links, a back-to-top action, and copyright information.
- A generated end-matter component for Resources and optional Acknowledgments and References sections.
- A two-link story-navigation row: previous and next stories on Stories 2–5, Home in Story 1's previous slot, and Home
  in Story 6's next slot.

These components use namespaced selectors and modules under `shared/` so their behavior and presentation remain
separate from landing-page layout and story artwork. Shared component selectors must not use legacy generic names such
as `.dropdown`, `.next`, or `.footer`.

Shared font binaries and licenses live under `shared/assets/fonts/`; shared interface icons live under
`shared/assets/icons/`; theme-aware organization marks live under `shared/assets/logos/`; and cross-experience animated
media live under `shared/assets/images/` and `shared/assets/videos/`. Maintained pages must not create a second
root-level copy of these assets.

Theme-aware text selection is a shared foundation under `shared/css/selection.css`. It applies only within
`.site-chrome` roots, uses roles from `shared/css/tokens.css`, and defers to operating-system colors in forced-colors
mode so story artwork and high-contrast preferences remain unaffected.

The enhanced Menus on the landing page and Story 6 expose a persistent High contrast switch. `shared/js/contrast.js`
owns its state and the `hra-high-contrast` storage key. With no saved choice, CSS and JavaScript follow
`prefers-contrast`; an explicit On or Off choice is applied before paint. Story 1 through Story 5 omit preference
controls and use navigation-only Menus.

GitHub Pages serves this repository without a build step or server-side includes. Each maintained HTML entry point
therefore contains its own small copy of the semantic component markup. Shared JavaScript enhances existing markup; it
must not fetch or inject essential navigation or footer content. This keeps landmarks and links available when
JavaScript is unavailable.

The Menu uses ordinary navigation links. Pages that initialize theme selection also include a native radio-group
fieldset for System settings, Light, and Dark appearance choices; pages without that capability omit the fieldset.
Core disclosure and skip-link presentation lives in `shared/css/navigation.css`; optional theme and contrast control
presentation lives in `shared/css/appearance-controls.css` and is loaded only by the landing page and Story 6.
Menus on pages without appearance selection use the `site-chrome--light` modifier so their presentation remains
light instead of following the operating-system dark preference.
On story pages, the selected appearance applies only to the shared page chrome; story artwork and story-specific
colors remain unchanged. On the landing page, the existing full-page appearance behavior remains in scope. The
established `hra-landing-theme` storage key is retained during migration so existing preferences continue to work.

The landing page and every story use the canonical semantic Menu contract, icon, FAB, panel, list row, current-page
indicator, scrollbar presentation, and progressive-enhancement modules. Shared component behavior includes keyboard
state, dismissal, and focus restoration. Every maintained page uses the default shared FAB geometry; page-specific
box-model resets must remain scoped to story-owned surfaces and must not override `.site-chrome` sizing.

The shared Menu must remain a direct child of `body`. Story animation wrappers use transforms, pinned positioning, and
high stacking values that can otherwise change fixed positioning or obscure the control. Its implementation must
account for safe areas, short viewports, 320-pixel reflow, 400% zoom, focus visibility, Escape dismissal,
outside-pointer dismissal, and focus restoration.

Keep the generated end matter and two-link story navigation outside pinned or transformed story scenes. Stories 1–5
use the fixed Light end-matter and story-navigation treatments; Story 6 allows them to follow the selected appearance.
Keep the shared footer outside story-owned wrappers so story animation, link, and theme rules cannot obscure or
restyle these components. A story section containing final resources or end matter must use intrinsic height so
overflowing narrative content cannot cover the following navigation or footer.

The shared footer is semantic, has accessible names for functional images and links, and reflows without fixed
heights. Its back-to-top enhancement returns keyboard focus to the main-content target. On Story 1 through Story 5,
`site-chrome--dark` keeps the footer on the fixed Dark treatment. The landing page and Story 6 allow the footer to
follow the selected appearance. Story navigation remains a separate labeled `nav` landmark.

## Reader View and linear fallbacks

Every maintained page must support a complete linear reading experience for browser Reader View, unavailable
JavaScript, reduced motion, short viewports, and high browser zoom. The semantic document is the canonical narrative;
pinning, crossfades, overlays, and staged screenshots enhance that document only after their setup succeeds.

Stories 2, 3, and 5 place the `.story-flowing` class on the document by default. Their synchronous shared motion
gate replaces it with `.story-motion-enabled` only when reduced motion is off and the viewport supports the pinned
experience. Returning to flowing mode stops active scroll triggers, exposes narrative copy in source order, disables
nonessential animation, and makes Story 5 autoplay media user-controlled.

Reader-oriented implementation belongs with each story because its animated visuals and fallback content differ.
Shared expectations are:

- Keep narrative copy and end matter in the primary `main` or `article` source order
- Use native headings, paragraphs, figures, captions, and lists before extraction-oriented class hints
- Exclude decorative animation layers from alternative output and provide one compact in-flow equivalent for an
  informative animated visual
- Default to readable, unpinned component layout and opt into fixed scene geometry with a setup-success class
- Keep meaningful text in the accessibility tree when visual sequencing uses opacity
- Verify Firefox Reader View after structure changes because extraction behavior is browser-owned and cannot be proven
  by repository checks alone

Story 6 is the reference implementation during future story migrations. It uses `article-content` and
`article-header` as Firefox extraction hints, a compact mouse overview for the layered anatomy animation, semantic
ordered instructions instead of tutorial screenshots, and an explicit Conclusion heading followed by conclusion
copy. Its compact image dimension attributes are a documented Reader View sizing exception and must retain accurate
aspect ratios.

Story 6 is independent of the former legacy root `style.css`. Its default scene layout is flowing and readable; the
`story-animations-enabled` state applies viewport height and clipping only to the pinned cell, mouse, and transition
scenes. The tissue comparison and CDE tutorial own their longer heights in their component styles so a broad enhanced
selector cannot clip the organ cards or collapse the tutorial scroll range. `node tools/check-story6.mjs` protects
these geometry, source-order, ID, ARIA, responsive-image, and deferred-image contracts. The published root
`story6.html` entry point consumes its story-owned implementation and assets from `story/6/`.

## Migration workflow

Migrate one small story at a time. Start broad story migration with `story1.html`; defer broad edits to the
embedded-data-heavy third and fourth stories. Story 4's isolated particle implementation and configuration are
organized under `stories/story4/`; its remaining embedded data stays deferred.

1. Run `node tools/check-local-links.mjs --allow-known`.
2. Identify every HTML, CSS, JavaScript, JSON, manifest, and service-worker consumer of the files being considered.
3. Copy the selected implementation files into the intended story or shared directory.
4. Update only the selected story's references.
5. Preview the complete story in a local web server and test its primary interactions.
6. Run the local-reference checker again.
7. Remove an old file only after repository-wide search confirms that no consumer remains.
8. Update `docs/asset-map.md`, `README.md`, and accessibility documentation when ownership or behavior changes.

Copying before deleting keeps the original experience recoverable during validation. A move is complete only when the
old path has no remaining consumers.

For a previously published prototype page, preserve its original root filename as a compatibility page. The
compatibility page should identify the new canonical URL, forward the query string and fragment when JavaScript is
available, and provide a normal link to the new location without JavaScript. Keep the complete prototype
implementation under `prototypes/`; do not duplicate it at the old path.

### Shared page-chrome maintenance

The maintained landing page and all six stories now use the shared Menu and footer. Keep their common presentation
and behavior under `shared/`, while retaining the semantic markup in each HTML entry point. Remove legacy navigation,
footer, or story-navigation rules only after a repository-wide search confirms that no maintained or prototype page
still consumes them.

The Scrollytelling Effects, Organ Example, and Visualizing Cells prototypes explicitly adopt the navigation-only
shared Menu and fixed-Dark shared footer. They do not adopt shared appearance controls. Scrollytelling Effects keeps
its right-side table of contents and content layout under prototype ownership, while `prototypes/shared/chrome.css`
contains only the small layout adjustment shared by Organ Example and Visualizing Cells. Other prototype content and
navigation must not change incidentally.

## Reviewable commit boundaries

Keep repository migrations easy to review by separating ownership changes from visual or behavioral changes:

1. Add or organize isolated assets, licenses, and documentation.
2. Establish shared story foundations and component styles without migrating a story.
3. Migrate one story's CSS and update only that story's stylesheet references.
4. Migrate that story's assets and paths in a separate commit.
5. Apply accessibility or visual improvements to the migrated story in focused component commits.
6. Remove a legacy file only after all consumers have migrated, using a dedicated cleanup commit.

Avoid combining multiple story migrations, large binary additions, broad formatting, and behavior changes in one
commit. A reviewer should be able to identify the affected story or shared component from the commit subject.

## Validation boundaries

The local-reference checker statically validates HTML attributes, HTML fragments, and CSS `url()` values. It cannot
prove that dynamically constructed JavaScript paths, animation timelines, third-party libraries, service workers, or
visual layouts still behave correctly. Every migration therefore also requires a real-browser review of the affected
page.

Repository organization alone does not establish accessibility conformance. Story migrations must preserve source
order, keyboard operation, focus behavior, reduced-motion behavior, and meaningful alternatives for media.
