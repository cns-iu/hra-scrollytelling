# Human Reference Atlas Scrollytelling

An interactive collection of mixed-media stories that introduces the [Human Reference Atlas](https://humanatlas.io/)
to a general audience.

The project is a static website maintained by the Cyberinfrastructure for Network Science Center at Indiana
University. It is published through GitHub Pages and intentionally has no package manager, framework, build step, or
installed dependencies.

[View the published site](https://cns-iu.github.io/hra-scrollytelling/)

## Preview locally

### First-time setup

Clone the repository only if a local copy does not already exist. Run this command from the directory where the new
project folder should be created:

```bash
git clone https://github.com/cns-iu/hra-scrollytelling.git
```

This creates a new `hra-scrollytelling` directory containing the repository.

Move into the new repository directory:

```bash
cd hra-scrollytelling
```

This makes the repository root the terminal's current working directory.

### Start the local preview

If the repository is already cloned, skip the first-time setup and open a terminal in the existing
`hra-scrollytelling` directory. Start a small local web server from the repository root:

```bash
python3 -m http.server 8000
```

This serves the current directory at [http://localhost:8000/](http://localhost:8000/). Open that address in a browser,
keep the terminal running while previewing, and press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop the server.

There is no installation or build command.

## Main experiences

| Page | Experience |
| --- | --- |
| `index.html` | Landing page and entry point to the story collection |
| `story/1/` | What Is a Human Reference Atlas? |
| `story/2/` | Squiggy's Identity Crisis! |
| `story/3/` | Something's Not Registering! |
| `story/4/` | Data Detangle |
| `story/5/` | Know Your Body Buddies |
| `story/6/` | Pan-organ Immunosenescence Atlas |
| `story/7/` | Story 7 planning directory; `index.html` is not yet implemented |

Every story uses the singular `story/<number>/` convention, with its page entry point at
`story/<number>/index.html` and a clean `/story/<number>/` GitHub Pages URL. Each story owns its `css/`, `js/`,
`images/` and `video/` subdirectories alongside that page.

The former root entry points, `story1.html` through `story6.html`, remain as redirect stubs so previously shared
links keep working. They carry `noindex, follow` and a canonical link to the new URL. See
[`story/7/README.md`](story/7/README.md) for the contract a new story follows.

The repository also contains older prototypes and demonstrations. The Scrollytelling Effects, Organ Example,
Visualizing Cells, and Drag-and-Drop Answer Demo implementations are organized under `prototypes/`, with their
original URLs retained as compatibility pages. These are not primary entry points.

## Repository structure

```text
.
├── index.html          # Accessible landing-page structure and content
├── package.json        # Names the repository checks and asset generators; no dependencies, no build step
├── .github/
│   └── workflows/
│       └── check.yml   # Runs npm run check on every push and pull request
├── landing/            # Isolated landing-page implementation
│   ├── assets/
│   │   ├── backgrounds/
│   │   │   ├── splash-human-dark.png  # Dark-theme decorative splash artwork
│   │   │   └── splash-human-light.png # Light-theme decorative splash artwork
│   │   ├── hero.png            # Previous single-theme hero artwork
│   │   └── social-preview.png  # 1200×630 link-preview artwork
│   └── css/
│       ├── fonts.css   # Compatibility bridge for cached landing pages
│       ├── tokens.css  # Landing hero artwork and landing-only layout
│       └── styles.css  # Components, layout, and accessibility adaptations
├── shared/             # Landing-and-story foundation
│   ├── assets/
│   │   ├── fonts/      # Self-hosted HRA webfonts and licenses
│   │   ├── icons/      # Shared interface icons, favicon set, and retained organ icons
│   │   ├── images/     # Images shared across maintained and prototype experiences
│   │   ├── logos/      # Theme-aware organization logos
│   │   ├── music/      # Shared story and prototype audio
│   │   └── videos/     # Video shared by maintained and prototype experiences
│   ├── css/            # Design tokens, component roles, page chrome, and narrative styles
│   ├── fixtures/       # Canonical chrome markup asserted against every maintained page
│   └── js/             # Progressive-enhancement navigation, appearance, and narrative modules
├── story/              # One directory per story, published at /story/<number>/
│   ├── 1/              # index.html plus css/, js/, images/, video/, end-matter.json
│   ├── 2/
│   ├── 3/
│   ├── 4/              # Also config/particles.json, the preserved particle reference
│   ├── 5/
│   ├── 6/              # Also AGENTS.md, the story's contributor instructions
│   └── 7/
│       └── README.md   # Story 7 implementation and publication contract
├── story1.html         # Redirect stubs preserving the former story URLs
├── story2.html
├── story3.html
├── story4.html
├── story5.html
├── story6.html
├── story0.html         # Redirect stubs preserving the former prototype URLs
├── VisualizingCells.html
├── organExample.html
├── prototypes/         # Organized legacy experiences and their maintenance notes
│   ├── drag-and-drop/           # Drag-and-drop answer demo and owned assets
│   ├── organ-example/           # Prototype implementation and owned images
│   ├── scrollytelling-effects/  # Prototype-owned styles, code, images, and model
│   ├── shared/                  # Shared prototype chrome, typography, and images
│   └── visualizing-cells/       # Prototype implementation, styles, images, and video
├── docs/               # Architecture and asset-migration records
└── tools/              # Dependency-free checks and asset generators
```

Relative paths in a story's markup resolve from `story/<number>/`: story-owned files as `css/…`, `js/…`, `images/…`
and `video/…`, and shared files as `../../shared/…`. Import specifiers inside a JavaScript module resolve from that
module's own directory instead, so a module in `story/<number>/js/` reaches shared code as `../../../shared/…` — one
level deeper than the page that loads it. Do not move files or assets without first mapping and validating
every HTML, CSS, JavaScript, and JSON reference; `npm run check:links` resolves every one of them. See
[`docs/architecture.md`](docs/architecture.md) for ownership boundaries and
[`docs/asset-map.md`](docs/asset-map.md) for the asset register.

Stories 2, 3, and 5 share their narrative foundation and character dialogue through focused stylesheets under
`shared/css/`. Their generic page foundation now lives in
`shared/css/narrative-foundation.css`; their readable short-viewport and reduced-motion mode lives in
`shared/css/narrative-accessibility.css` and `shared/js/narrative-motion.js`, while Story 2 owns its quiz color tokens.
The shared foundation defines semantic narrative, dialogue, episode-title, and chapter-heading type roles. Enhanced
scenes use a stable small-viewport height, and coarse-pointer motion ignores height-only browser-chrome resizes while
still refreshing after viewport-width changes.
All six stories keep end-matter content in `end-matter.json` within the owning story directory. The shared
`story-end-matter.js` module validates and renders that single source into each story's small end-matter placeholder.
End matter requires JavaScript and may be omitted from Reader View. The former root `style.css` has been removed. All
six stories use the shared two-link story navigation; Home fills the
unavailable previous slot on Story 1 and the unavailable next slot on Story 6. Every story uses the shared self-hosted Metropolis and
Nunito Sans faces; the repository makes no third-party font request.

Stories 2, 3, 4 and 5 also share their scroll timelines. The intro typewriter and the container, bubble and dialogue
cross-fades live once in `shared/js/narrative-timeline.js`; each story supplies only its own scene triggers. The
motion preference gate that stops animation for reduced-motion, reduced-transparency, forced-colors and short
viewports lives in `shared/js/motion-preferences.js`, consumed by both `shared/js/narrative-motion.js` and Story 4's
own `motion.js`.

## Landing-page architecture

The landing page is deliberately separated from the legacy story implementation:

- `index.html` owns its semantic structure and editorial content.
- `landing/assets/backgrounds/` contains the Light and Dark decorative splash artwork.
- `shared/assets/icons/menu.svg` is the Material Menu glyph used by the landing and shared-story extended FABs.
- `shared/assets/logos/` contains the theme-aware organization marks used by the landing hero and footer.
- `shared/css/fonts.css` owns the self-hosted HRA font declarations and resilient typography stacks.
- `landing/css/fonts.css` preserves the former font URL for cached landing-page documents.
- `shared/css/tokens.css` is the single source of every HRA colour value. Each value is declared exactly three
  times: `--hra-light-*` and `--hra-dark-*` hold the fixed appearance, and `--hra-*` is the theme-reactive role
  aliasing one of them. Chrome pinned to one appearance consumes a fixed set directly.
- `shared/css/component-roles.css` maps those colour roles onto semantic component roles (`--color-ink`,
  `--color-surface`, `--focus-color`, and the radius and width scale). Every maintained page loads it, directly after
  the palette and before any component that consumes a role, so shared components can name a role outright instead of
  carrying a fallback for pages that might omit it.
- `shared/css/buttons.css` owns `.hra-button`, the Material 3 button shared by every maintained page: text,
  outlined, elevated, filled, tonal, extended-FAB and icon variants, built on the colour roles rather than on
  values of its own. The tonal, elevated and FAB variants carry a boundary because their containers sit within
  about 1.2:1 of the page surface, under the 3:1 non-text minimum.
- `shared/css/numbers.css` owns `.hra-number`, the filled numeral circle used by the landing story cards and by
  story step lists, with a `--compact` size for numbers set beside body copy. It hides its own assistive label,
  so it does not depend on the landing page's `.visually-hidden`.
- `landing/css/tokens.css` owns only the landing hero artwork, overlays, and landing-specific layout.
- `shared/css/selection.css`, `shared/css/navigation.css`, `shared/css/appearance-controls.css`, and
  `shared/css/footer.css` own the canonical Menu, appearance controls, skip link, and footer.
- `landing/css/styles.css` owns landing content, layout, responsive rules, and page-specific accessibility adaptations.
- `shared/js/main.js` initializes the shared Menu, appearance, contrast, and back-to-top modules for every maintained
  page, including the landing page.
- `shared/js/loading-gate.js` and `shared/css/loading-gate.css` hold an opaque, page-coloured veil over the document
  until the fonts, the page's nominated hero artwork, and any page-supplied settle step have finished, so the first
  paint is trustworthy rather than a second of shifting elements. It is a blocking classic script in `<head>`, after
  the appearance bootstrap and ahead of the stylesheets. The veil is added by the script, not by CSS, so a reader
  without JavaScript sees content immediately. `shared/js/loading-readiness.js` supplies the readiness promises.

Load the landing stylesheets in the documented order so font and design tokens exist before component rules use them.
`shared/js/theme-bootstrap.js` applies a saved theme before paint; keep its storage key aligned with
`shared/js/theme.js`.
The landing page does not use a root stylesheet, prototype or story scripts, remote fonts, or a JavaScript framework.

### Page metadata

The landing page identifies `https://cns-iu.github.io/hra-scrollytelling/` as its canonical URL and includes Open
Graph and large-card metadata for consistent search and link previews. The browser theme color follows both the system
preference and an explicit Light or Dark selection.

The visible hero uses the theme-specific artwork under `landing/assets/backgrounds/`, while link previews use the
dedicated `landing/assets/social-preview.png` artwork. The previous `landing/assets/hero.png` remains unreferenced
during redesign review. Follow-up metadata work should:

- Evaluate `CollectionPage` structured data once story ownership, authorship, and publishing details are confirmed.
- Add page-specific metadata to each story as those pages receive accessibility remediation.

### Color themes

The landing page includes light and dark themes derived from the Human Reference Atlas color guidance. It:

- Uses the operating-system preference on the first visit.
- Provides System settings, Light, and Dark options inside the labeled Menu panel.
- Remembers the selected mode in local storage; System settings continues to follow operating-system changes.
- Restores a saved selection before paint to avoid flashing the wrong theme.
- Uses AAA-safe component pairings rather than assuming every brand-token pairing is suitable for normal text.
- Continues to respect reduced-motion, reduced-transparency, increased-contrast, and forced-colors preferences.

### Typography

The landing page implements the HRA Figma typography scale as reusable tokens in `shared/css/fonts.css`:

- Metropolis Medium and Bold for display and headline roles.
- Nunito Sans Regular, Medium, Semibold, and Bold for titles, labels, body copy, and controls.
- Roboto Mono Regular for monospaced roles.

Component rules in `landing/css/styles.css` use discrete scale roles rather than arbitrary font sizes. Display headings
step down to the approved Display Small role on narrow viewports. The 11- and 12-pixel scale roles are retained as
tokens but are not used for essential landing-page content.

Story prose uses the body-large role — `--type-body-large-size`, `--type-body-large-line-height` and
`--type-body-large-letter-spacing` — on every story, so paragraphs read the same from one story to the next. A story
may still size its own distinct roles, such as a splash subtitle or an eyebrow, but not its ordinary paragraph text;
`tools/check-maintained-pages.mjs` fails on a raw `font-size` in a story's prose rule.

### Navigation and appearance

The fixed top-left Menu control provides quick access to the landing page, every story, and appearance preferences.
Its panel uses ordinary navigation links and native radio controls rather than application-menu roles.
Opening the panel moves focus to it; its close button, the <kbd>Escape</kbd> key, or a pointer press outside the panel
closes it. Keyboard-initiated closing restores focus to the Menu control.

The control and panel account for device safe areas, retain 44-by-44-pixel targets, and allow the panel content to
scroll within short or highly zoomed viewports. Appearance controls belong only on pages that initialize theme
selection; omit the fieldset when appearance is not an available page option. A page without appearance selection
uses the shared Menu's light treatment rather than changing it with the operating-system preference.

Every maintained page includes an Accessibility group with a persistent High contrast switch. The switch follows the
operating-system contrast preference until a visitor explicitly turns it on or off.

Maintained pages load shared fonts and tokens before shared component CSS, then load page- or story-owned styles.
All seven load `shared/css/appearance-controls.css`. Stories 2, 3, and 5 load their shared narrative foundations
before story-owned CSS and keep the flowing accessibility stylesheet last.

## Shared page chrome

The maintained landing page and story pages use the same Menu and footer foundations while retaining page-specific
content presentation. Because GitHub Pages serves the source files directly, each page retains semantic component
markup in its HTML while sharing namespaced CSS and small JavaScript modules. Essential links and landmarks are never
injected at runtime.

The landing page and all six stories use the same semantic Menu contract, approved icon, FAB, panel, list, active
state, scrollbar presentation, canonical footer, and progressive-enhancement modules. Appearance controls are
included only when visitors can change that page's presentation. Component loading order and markup hooks are
documented in [`shared/README.md`](shared/README.md).

Current behavior:

- The landing page and all six stories use the shared Menu with System settings, Light, Dark, and High contrast
  controls, and the same footer treatment. `shared/fixtures/` holds that markup once, and
  `tools/check-maintained-pages.mjs` asserts every page still matches it.
- Appearance selection applies to page chrome and to each story's reading surface. Story artwork is unchanged: the
  full-bleed scenes behind the illustrations stay black in both appearances, because the artwork was drawn against
  them.
- Every maintained page uses the compact shared footer with organization links and an accessible back-to-top action.
- Scrollytelling Effects, Organ Example, and Visualizing Cells use the navigation-only shared Menu and fixed-Dark
  shared footer; their content and any prototype-specific navigation remain independently owned.

See [`docs/architecture.md`](docs/architecture.md#shared-page-chrome) for component boundaries and maintenance rules.

## Accessibility

The landing page targets WCAG 2.2 Level AAA and includes:

- Semantic landmarks, headings, and list structure.
- A skip link and logical keyboard navigation.
- Accessible names for functional images and controls.
- Visible focus indicators and 44-by-44-pixel minimum targets.
- AAA-oriented text contrast and non-text control contrast.
- Content-driven responsive sizing and 320-pixel reflow support.
- Reduced-motion, reduced-transparency, increased-contrast, and forced-colors support.
- Theme-aware text-selection colors that defer to operating-system colors in forced-colors mode.
- A floating navigation disclosure with a persistent visible label, state announcement, Escape, outside click, and
  focus restoration.
- A persistent three-state appearance preference grouped with a native fieldset and radio controls.
- A persistent High contrast switch with visible state text and an announced switch state.

The story pages predate this work and are receiving accessibility remediation incrementally. Stories 2, 3, and 5 now
default to a readable linear layout without JavaScript and use that same mode for reduced motion, short viewports,
and high zoom; portrait phone viewports retain the pinned GSAP experience. Story 6 uses a readable
unpinned default, live reduced-motion handling, and semantic Reader View fallbacks for its animated anatomy, tutorial,
and conclusion. The repository as a whole should not be described as WCAG AAA conformant until each story has been
audited and tested.

All maintained pages should support browser Reader View over time. Keep the complete narrative in semantic source
order, exclude decorative animation layers, and provide concise in-flow equivalents for informative visual sequences.
Runtime end matter may be omitted. Story 6 is the current reference implementation; see
[`docs/architecture.md`](docs/architecture.md#reader-view-and-linear-fallbacks).

Automated checks are not sufficient for conformance. Final validation must include real-browser keyboard, screen
reader, 200–400% zoom, text-spacing, reduced motion, reduced transparency, increased contrast, forced colors, and
mobile-browser testing.

## Development guidelines

- Keep the site dependency-free.
- Pin every external script to an exact version with a Subresource Integrity digest, `crossorigin="anonymous"`
  and `referrerpolicy="no-referrer"`; see [`AGENTS.md`](AGENTS.md#dependencies-and-runtime) for how digests are
  obtained and where Story 4 keeps its own.
- Use semantic HTML, modern CSS, and small vanilla JavaScript.
- Keep shared webfonts and their licenses under `shared/assets/fonts/`; retain only required WOFF2 files.
- Preserve progressive enhancement and no-JavaScript access.
- Keep landing-specific work isolated to `index.html` and `landing/`; place approved cross-page foundations under
  `shared/`.
- Do not make broad edits to the story documents dominated by inline SVG path data, currently Stories 3 and 4.
- Avoid reorganizing files as part of unrelated feature work.
- Explain and approve dependency or repository-structure changes before implementing them.
- Use canonical `https://doi.org/<doi>` links for papers, scholarly publications, and Zenodo-hosted SOPs whenever a DOI exists; retain an authoritative stable URL only when no DOI has been assigned
- Verify DOI availability when adding or changing those links; do not include recurring DOI audits in unrelated maintainability scans
- Keep this README and `AGENTS.md` synchronized with durable architecture and accessibility changes.
- Follow the repository's branch, review, and release workflow for commits and publication.

Repository-specific instructions for coding agents are documented in [`AGENTS.md`](AGENTS.md).

## Basic validation

Before handing off a change:

```bash
git diff --check
npm run check
```

`npm run check` runs the link, maintained-page, and Story 6 checkers in turn. They can also be run individually as
`npm run check:links`, `npm run check:pages`, and `npm run check:story6`. There are still no installed dependencies;
`package.json` names these checks and the asset generators under `tools/`. `.github/workflows/check.yml` runs
`npm run check` on every push and pull request, so a drifting page fails in CI as well as locally.

`tools/` also holds the asset generators: `images:story6` and `splash:story6` remain re-runnable, while both Story 4
generators are spent — the WebP migration rewrote the `.png` references they select their sources from. Provenance and
regeneration commands for every generated asset are in [`docs/asset-map.md`](docs/asset-map.md).

The checkers cover what can be automated: local `href`, `src` and CSS `url()` references, unique IDs, fragment and
ARIA resolution, chrome drift against `shared/fixtures/`, and the documented duplicate-ID baselines.

The manual checks that follow — contrast, keyboard operation, zoom and reflow, Reader View, DOI links — are kept as one
numbered procedure in [`AGENTS.md`](AGENTS.md#editing-and-validation) rather than repeated here, so there is a single
list to follow and to update.

## Known technical debt

- Stories 2 and 3 carry pre-existing repeated ID values in their inline SVG artwork: 9 and 18 distinct ids
  respectively, matching the baselines in `tools/check-maintained-pages.mjs`, which fails if the set changes. They are
  not current interaction targets, but a dedicated cleanup requires visual regression testing.
- The `.git` directory is roughly 822 MB against a 152 MB working tree, from large binaries committed and later
  deleted under the retired `img/` and `stories/` layouts. A fresh clone therefore costs far more than the site needs.
  Reducing it means rewriting history, which breaks every existing clone and needs explicit approval; see the
  repository-safety rules in [`AGENTS.md`](AGENTS.md).
- Story 5's six videos are QuickTime-only (`ftyp` brand `qt  `) and will not play in Firefox. Their streams are
  already H.264/AAC, so the fix is a container remux, not a re-encode; it needs `ffmpeg`, which is not installed
  and which the dependency policy forbids adding. The `<source>` elements now declare `type="video/quicktime"`
  and carry fallback text so unsupported browsers fail visibly rather than silently. With approval to use `ffmpeg`,
  the remux is lossless and per file: `ffmpeg -i video5-N.mov -c copy -movflags +faststart video5-N.mp4`, after
  which each `<source>` becomes `type="video/mp4"`.
- The landing hero artwork is still PNG: `landing/assets/backgrounds/splash-human-light.png` (344 KB) and
  `splash-human-dark.png` (320 KB). It is the largest remaining first-paint cost on the landing page. The loading
  gate preloads whichever variant the resolved appearance selects, so the reader no longer waits for it behind a
  shifting layout, but the bytes are unchanged. `tools/generate-story4-webp.mjs` records the browser-encoded WebP
  path this repository already uses, which roughly halved Story 4's raster artwork; the same approach applies here.
  The artwork is referenced as a CSS `background-image` through `--hero-artwork` in `landing/css/tokens.css`, so
  the conversion also needs the preload in `index.html` and the token to move together.
- Fifty images across Stories 2, 3 and 5 carry no intrinsic `width` and `height` (10, 13 and 27 respectively), and
  those stories use no `aspect-ratio` reservation either. Most sit inside pinned, absolutely positioned scenes
  where the reflow is contained, but Story 5's repeated media-control icon rows are in normal flow and do shift
  their controls as they load. Stories 1, 4 and 6 are already complete, and Story 6's markup is the model to
  follow. The fix is mechanical but wants visual checks per scene, because a wrong intrinsic ratio changes layout
  rather than only reserving it.
- Story 1's hero video (`#vid`) declares no `width`, `height`, or `poster`, and `story/1/css/story1.css` gives it
  `height: auto` under a `max-height: 38rem` cap, so its box has no reserved height until metadata arrives. The
  loading gate hides the resulting jump on first load; the underlying reservation is still missing, and the same
  pattern applies to the inline media further down the page.
- The loading-gate work has not been measured with Lighthouse. The changes were verified behaviourally in headless
  Chromium (state classes present before deferred modules run, no stranded `inert` or scroll lock, no veil with
  scripts blocked, zero horizontal shift on release), but no before-and-after CLS or LCP numbers were captured for
  the landing page, Story 3, or Story 4.

Repository cleanup should be performed incrementally, with local-reference checks before and after every move.
The documented missing-reference baseline is maintained in [`docs/asset-map.md`](docs/asset-map.md). Run
`node tools/check-local-links.mjs` without `--allow-known` when resolving that baseline.

## License

This project is available under the [MIT License](LICENSE).
