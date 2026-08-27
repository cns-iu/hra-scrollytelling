# Repository Architecture

This document describes the current ownership boundaries and the intended path toward a more maintainable repository.
The site is served directly by GitHub Pages, so file locations and letter casing are part of the public interface.

## Stability rules

- Keep `index.html` and the root `story*.html` entry points at their current URLs.
- Keep `story0.html`, `VisualizingCells.html`, and `organExample.html` as compatibility entry points for the organized
  prototype implementations.
- Keep landing-page-specific implementation under `landing/`; keep approved landing-and-story fonts and page chrome
  under `shared/`.
- Treat `style.css` and `img/` as shared legacy resources until each consumer has been mapped.
- Do not restore a root `js/` directory; scripts belong under their owning page, story, prototype, or shared component.
- Keep shared story and prototype audio under `shared/assets/music/`.
- Do not mechanically format `story3.html` or `story4.html`; both contain large embedded data.
- Move files in small batches and run the local-reference checker before and after every batch.

## Current ownership

| Area | Entry points | Implementation |
| --- | --- | --- |
| Landing page | `index.html` | `landing/assets/`, `landing/css/`, landing initialization under `landing/js/`, and shared HRA fonts and page chrome |
| Shared page chrome | `index.html` and `story1.html` through `story6.html` | Namespaced fonts, styles, assets, and progressive-enhancement modules under `shared/`; the landing page and Story 6 offer appearance controls |
| Primary stories | `story1.html` through `story6.html` | Stories 1–5 retain shared legacy `style.css`; Story 6 uses only its dedicated `stories/story6/` implementation and namespaced shared page chrome; other stories use shared or story-specific scripts, `img/`, audio under `shared/assets/music/`, and gradually organized files under `stories/` |
| Prototypes | `img/test.html` and the compatibility pages `story0.html`, `VisualizingCells.html`, and `organExample.html` | Organized implementations under `prototypes/` plus shared legacy files |

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
├── landing/
├── shared/
│   ├── assets/
│   │   ├── fonts/
│   │   ├── icons/
│   │   ├── logos/
│   │   └── music/
│   ├── css/
│   └── js/
├── prototypes/
│   ├── organ-example/
│   │   └── index.html
│   ├── scrollytelling-effects/
│   │   ├── index.html
│   │   ├── scripts.js
│   │   └── wc.js
│   └── visualizing-cells/
│       └── index.html
├── stories/
│   ├── story1/
│   │   ├── accessibility.css
│   │   ├── images/
│   │   │   └── hra-scale-overview.png
│   │   ├── motion-control.js
│   │   ├── reveals.js
│   │   └── story1.css
│   ├── story2/
│   │   ├── images/
│   │   ├── quiz.css
│   │   └── quiz.js
│   ├── story3/
│   │   └── .gitkeep
│   ├── story4/
│   │   ├── app.js
│   │   ├── particles.js
│   │   ├── scripts.js
│   │   └── config/
│   │       └── particles.json
│   └── story5/
│       └── .gitkeep
├── docs/
├── tools/
└── img/
```

The `img/` directory remains in place until each asset has a verified owner. The approved empty story directories use
`.gitkeep` placeholders until their first story-owned files are migrated; do not create other empty target directories
in advance.

`landing/css/fonts.css` remains as a compatibility bridge for cached landing-page documents. Maintained HTML entry
points load `shared/css/fonts.css` directly; do not expand the compatibility file into a second font source.

Story 1 keeps presentation and responsive layout in `stories/story1/story1.css`, motion and user-preference states in
`stories/story1/accessibility.css`, animated-media controls in `stories/story1/motion-control.js`, and scroll-triggered
progressive enhancement in `stories/story1/reveals.js`. Its reveals use browser APIs and do not require a third-party
animation runtime.

Story 2 contains 11 repeated ID values across its large inline SVG illustrations: `branchoff`, `Group-3`, `Group-4`,
`Group`, `Group-5`, `Rectangle`, `Oval`, `Combined-Shape`, `Group-2`, `Path`, and `Triangle`. These generated drawing
labels predate the organized Story 2 asset directory and are not currently targeted by repository CSS, JavaScript,
fragment links, or SVG `href` references. They remain invalid duplicate document IDs and must not be treated as an
accepted markup pattern. Clean them up as a separate SVG-maintenance change, using unique story-scoped IDs or removing
unneeded IDs, and visually regression-test every affected illustration before and after the change.

Story 4 owns its particle runtime, inline configuration initializer, and intentionally blank Bootstrap starter hook
in `stories/story4/`. The Scrollytelling Effects prototype owns its complete `wc.js` web-component bundle alongside
its prototype script. The former root `js/` directory was removed after repository-wide auditing confirmed that
`jquery-3.6.3.min.js` and `magnifier.js` had no remaining consumers and that `runtime.js`, `polyfills.js`, and `main.js`
were redundant build fragments embedded byte-for-byte within the consumed prototype bundle.

## Shared page chrome

The maintained public pages are `index.html` and `story1.html` through `story6.html`. They share three interface
patterns:

- A fixed, visibly labeled Menu disclosure with links to the landing page and all maintained stories.
- A canonical shared footer with organization links, a back-to-top action, and copyright information.
- Previous and next story navigation on story pages.

These components use namespaced selectors and modules under `shared/` so their behavior and presentation remain
separate from landing-page layout and story artwork. Shared component selectors must not use legacy generic names such
as `.dropdown`, `.next`, or `.footer`.

Shared font binaries and licenses live under `shared/assets/fonts/`; shared interface icons live under
`shared/assets/icons/`; and theme-aware organization marks live under `shared/assets/logos/`. Maintained pages must not
create a second root-level copy of these assets.

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

Keep previous and next story navigation outside pinned or transformed story scenes. Keep the shared footer outside
story-owned wrappers such as `.sceneEnd` so story animation, link, and theme rules cannot obscure or restyle it.

The shared footer is semantic, has accessible names for functional images and links, and reflows without fixed
heights. Its back-to-top enhancement returns keyboard focus to the main-content target. On Story 1 through Story 5,
`site-chrome--dark` keeps the footer on the fixed Dark treatment. The landing page and Story 6 allow the footer to
follow the selected appearance. Story navigation remains a separate labeled `nav` landmark.

## Reader View and linear fallbacks

Every maintained page must support a complete linear reading experience for browser Reader View, unavailable
JavaScript, reduced motion, short viewports, and high browser zoom. The semantic document is the canonical narrative;
pinning, crossfades, overlays, and staged screenshots enhance that document only after their setup succeeds.

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

Story 6 is independent of the legacy root `style.css`. Its default scene layout is flowing and readable; the
`story-animations-enabled` state applies viewport height and clipping only to the pinned cell, mouse, and transition
scenes. The tissue comparison and CDE tutorial own their longer heights in their component styles so a broad enhanced
selector cannot clip the organ cards or collapse the tutorial scroll range. `node tools/check-story6.mjs` protects
these geometry, source-order, ID, ARIA, responsive-image, and deferred-image contracts.

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

Prototype pages are excluded from this rollout. Their existing navigation and footer behavior must not change
incidentally.

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
