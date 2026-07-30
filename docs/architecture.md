# Repository Architecture

This document describes the current ownership boundaries and the intended path toward a more maintainable repository.
The site is served directly by GitHub Pages, so file locations and letter casing are part of the public interface.

## Stability rules

- Keep `index.html` and the root `story*.html` entry points at their current URLs.
- Keep `story0.html`, `VisualizingCells.html`, and `organExample.html` as compatibility entry points for the organized
  prototype implementations.
- Keep landing-page-specific implementation under `landing/`; keep approved landing-and-story fonts and page chrome
  under `shared/`.
- Treat `style.css`, `img/`, and `js/` as shared legacy resources until each consumer has been mapped.
- Treat `Game/` as an isolated generated application. Preserve its directory name, internal paths, manifest, and service
  worker scope.
- Do not mechanically format `story3.html` or `story4.html`; both contain large embedded data.
- Move files in small batches and run the local-reference checker before and after every batch.

## Current ownership

| Area | Entry points | Implementation |
| --- | --- | --- |
| Landing page | `index.html` | `landing/assets/`, `landing/css/`, shared HRA fonts, and `landing/js/` |
| Shared page chrome | `index.html` and `story1.html` through `story5.html` | Namespaced fonts, styles, assets, and progressive-enhancement modules under `shared/`; Story 1 is the integration pilot |
| Primary stories | `story1.html` through `story5.html` | Shared `style.css`, shared or story-specific scripts, `img/`, `music/`, and gradually organized files under `stories/` |
| Prototypes | `img/test.html` and the compatibility pages `story0.html`, `VisualizingCells.html`, and `organExample.html` | Organized implementations under `prototypes/` plus shared legacy files |
| Generated game | `Game/index.html` | Everything under `Game/` |

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
│   ├── css/
│   └── js/
├── prototypes/
│   ├── organ-example/
│   │   └── index.html
│   ├── scrollytelling-effects/
│   │   ├── index.html
│   │   └── scripts.js
│   └── visualizing-cells/
│       └── index.html
├── stories/
│   ├── story-1/
│   │   └── assets/
│   ├── story-2/
│   │   └── assets/
│   ├── story-4/
│   │   └── config/
│   │       └── particles.json
│   └── …
├── docs/
├── tools/
├── img/
└── Game/
```

The `img/` directory remains in place until each asset has a verified owner. Empty target directories should not be
created in advance.

`landing/css/fonts.css` remains as a compatibility bridge for cached landing-page documents. Maintained HTML entry
points load `shared/css/fonts.css` directly; do not expand the compatibility file into a second font source.

## Shared page chrome

The maintained public pages are `index.html` and `story1.html` through `story5.html`. They share three interface
patterns:

- A fixed, visibly labeled Menu disclosure with links to the landing page, all five stories, and approved external
  resources.
- A canonical site footer derived from the accessible landing-page footer.
- Previous and next story navigation on story pages.

These components use namespaced selectors and modules under `shared/` so their behavior and presentation remain
separate from landing-page layout and story artwork. Shared component selectors must not use legacy generic names such
as `.dropdown`, `.next`, or `.footer`.

GitHub Pages serves this repository without a build step or server-side includes. Each maintained HTML entry point
therefore contains its own small copy of the semantic component markup. Shared JavaScript enhances existing markup; it
must not fetch or inject essential navigation or footer content. This keeps landmarks and links available when
JavaScript is unavailable.

The Menu uses ordinary navigation links and a native radio-group fieldset for System settings, Light, and Dark
appearance choices. On story pages, the selected appearance applies only to the shared page chrome; story artwork and
story-specific colors remain unchanged. On the landing page, the existing full-page appearance behavior remains in
scope. The established `hra-landing-theme` storage key is retained during migration so existing preferences continue
to work.

The shared Menu must remain a direct child of `body`. Story animation wrappers use transforms, pinned positioning, and
high stacking values that can otherwise change fixed positioning or obscure the control. Its implementation must
account for safe areas, short viewports, 320-pixel reflow, 400% zoom, focus visibility, Escape dismissal,
outside-pointer dismissal, and focus restoration.

The footer is semantic, has accessible names for functional images and links, and reflows without fixed heights. Story
navigation is a separate labeled `nav` landmark and is not structurally coupled to the footer.

## Migration workflow

Migrate one small story at a time. Start broad story migration with `story1.html`; defer broad edits to the
embedded-data-heavy third and fourth stories. Isolated, verified files such as Story 4's particle configuration may
move independently when their ownership is unambiguous.

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

### Shared page-chrome rollout

Migrate shared page chrome independently from broader story reorganization:

1. Establish the namespaced shared fonts, styles, and modules without changing any component markup.
2. Migrate `story1.html` as the first integration pilot while the landing-page redesign is in progress.
3. Migrate `index.html` after its design direction is approved.
4. Migrate one remaining story per commit, leaving each story's visual and animation implementation unchanged.
5. Remove legacy navigation, footer, or story-navigation rules only after a repository-wide search confirms that no
   maintained or prototype page still consumes them.

Prototype pages and `Game/` are excluded from this rollout. Their existing navigation and footer behavior must not
change incidentally.

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
