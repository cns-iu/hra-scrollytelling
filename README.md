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
| `story1.html` | What Is a Human Reference Atlas? |
| `story2.html` | Squiggy's Identity Crisis! |
| `story3.html` | Something's Not Registering! |
| `story4.html` | Data Detangle |
| `story5.html` | Know Your Body Buddies |
| `story6.html` | Pan-organ Immunosenescence Atlas |
| `story/7/` | Story 7 planning directory; `index.html` is not yet implemented |

New stories use the singular `story/<number>/` convention and place their page entry point at
`story/<number>/index.html`, producing a clean `/story/<number>/` GitHub Pages URL. The existing Stories 1–6 retain
their current entry points and implementation paths until each is migrated through a separate copy-first change.
See [`story/7/README.md`](story/7/README.md) for the first new-story contract.

The repository also contains older prototypes and demonstrations. The Scrollytelling Effects, Organ Example,
Visualizing Cells, and Drag-and-Drop Answer Demo implementations are organized under `prototypes/`, with their
original URLs retained as compatibility pages. These are not primary entry points.

## Repository structure

```text
.
├── index.html          # Accessible landing-page structure and content
├── landing/            # Isolated landing-page implementation
│   ├── assets/
│   │   ├── backgrounds/
│   │   │   ├── splash-human-dark.png  # Dark-theme decorative splash artwork
│   │   │   └── splash-human-light.png # Light-theme decorative splash artwork
│   │   ├── hero.png            # Previous single-theme hero artwork
│   │   └── social-preview.png  # 1200×630 link-preview artwork
│   ├── css/
│   │   ├── fonts.css   # Compatibility bridge for cached landing pages
│   │   ├── tokens.css  # HRA themes and shared design tokens
│   │   └── styles.css  # Components, layout, and accessibility adaptations
│   └── js/
│       ├── main.js     # Landing-page entry point
│       ├── menu.js     # Menu disclosure and focus behavior
│       └── theme.js    # Appearance preferences and persistence
├── shared/             # Landing-and-story page-chrome foundation
│   ├── assets/
│   │   ├── fonts/      # Self-hosted HRA webfonts and licenses
│   │   ├── icons/      # Shared interface icons, favicon set, and retained organ icons
│   │   ├── images/     # Images shared across maintained and prototype experiences
│   │   ├── logos/      # Theme-aware organization logos
│   │   ├── music/      # Shared story and prototype audio
│   │   └── videos/     # Video shared by maintained and prototype experiences
│   ├── css/            # Page chrome plus shared story narrative, dialogue, and end-matter styles
│   └── js/             # Progressive-enhancement navigation and appearance modules
├── prototypes/         # Organized legacy experiences and their maintenance notes
│   ├── drag-and-drop/           # Drag-and-drop answer demo and owned assets
│   ├── organ-example/           # Prototype implementation and owned images
│   ├── scrollytelling-effects/  # Prototype-owned styles, code, images, and model
│   ├── shared/                   # Shared prototype chrome and typography
│   └── visualizing-cells/       # Prototype implementation, styles, images, and video
├── docs/               # Architecture and asset-migration records
├── tools/              # Dependency-free repository validation
├── story1.html         # Story experiences
├── story2.html
├── story3.html
├── story4.html
├── story5.html
├── story6.html         # Pan-organ Immunosenescence Atlas entry point
├── story/              # Singular clean-URL convention for migrated and new stories
│   ├── 6/              # Story 6 styles, scripts, images, end-matter JSON, and contributor instructions
│   └── 7/
│       └── README.md   # Story 7 implementation and publication contract
└── stories/            # Organized story-owned implementation files
    ├── story1/         # Story 1 styles, scripts, owned images, and videos
    ├── story2/         # Story 2 presentation, animation, quiz, and owned images
    ├── story3/         # Story 3 presentation, split animation runtime, and owned images
    ├── story4/         # Story 4 static fallback, motion gate, animations, particles, and owned images
    │   ├── accessibility.css
    │   ├── app.js
    │   ├── animations.js
    │   ├── diagram-detail.js
    │   ├── diagram-overview.js
    │   ├── images/        # Story 4 narrative artwork
    │   ├── motion.js
    │   ├── particles.js
    │   ├── styles.css
    │   └── config/
    │       └── particles.json # Preserved particle configuration reference
    └── story5/         # Story 5 presentation, animation, accessible media controls, images, and videos
        ├── accessibility.css
        ├── animations.js
        ├── images/
        ├── media-controls.js
        ├── styles.css
        └── videos/
```

The current layout contains tightly coupled relative paths. Do not move files or assets without first mapping and
validating every HTML, CSS, JavaScript, JSON, and service-worker reference. See
[`docs/architecture.md`](docs/architecture.md) for ownership boundaries and the staged target structure, and
[`docs/asset-map.md`](docs/asset-map.md) for the current migration register.

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
unavailable previous slot on Story 1 and the unavailable next slot on Story 6. Story 2 retains one remote Inter
request for its embedded SVG labels; Stories 3 and 5 use the shared self-hosted Nunito Sans body font.

## Landing-page architecture

The landing page is deliberately separated from the legacy story implementation:

- `index.html` owns its semantic structure and editorial content.
- `landing/assets/backgrounds/` contains the Light and Dark decorative splash artwork.
- `shared/assets/icons/menu.svg` is the Material Menu glyph used by the landing and shared-story extended FABs.
- `shared/assets/logos/` contains the theme-aware organization marks used by the landing hero and footer.
- `shared/css/fonts.css` owns the self-hosted HRA font declarations and resilient typography stacks.
- `landing/css/fonts.css` preserves the former font URL for cached landing-page documents.
- `landing/css/tokens.css` owns light/dark HRA colors, semantic roles, and shared layout tokens.
- `shared/css/tokens.css`, `shared/css/selection.css`, `shared/css/navigation.css`,
  `shared/css/appearance-controls.css`, and `shared/css/footer.css` own the canonical Menu, optional appearance
  controls, skip link, and footer.
- `landing/css/styles.css` owns landing content, layout, responsive rules, and page-specific accessibility adaptations.
- `landing/js/main.js` initializes the shared Menu, appearance, contrast, and back-to-top modules for the landing page.

Load the landing stylesheets in the documented order so font and design tokens exist before component rules use them.
The inline script in `index.html` applies a saved theme before paint; keep its storage key aligned with
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

### Navigation and appearance

The fixed top-left Menu control provides quick access to the landing page, every story, and appearance preferences.
Its panel uses ordinary navigation links and native radio controls rather than application-menu roles.
Opening the panel moves focus to it; its close button, the <kbd>Escape</kbd> key, or a pointer press outside the panel
closes it. Keyboard-initiated closing restores focus to the Menu control.

The control and panel account for device safe areas, retain 44-by-44-pixel targets, and allow the panel content to
scroll within short or highly zoomed viewports. Appearance controls belong only on pages that initialize theme
selection; omit the fieldset when appearance is not an available page option. A page without appearance selection
uses the shared Menu's light treatment rather than changing it with the operating-system preference.

The landing page and Story 6 include an Accessibility group with a persistent High contrast switch. The switch follows
the operating-system contrast preference until a visitor explicitly turns it on or off. Story 1 through Story 5 use
navigation-only Menus without appearance or High contrast controls.

Maintained pages load shared fonts and tokens before shared component CSS, then load page- or story-owned styles.
Only the landing page and Story 6 load `shared/css/appearance-controls.css`. Stories 2, 3, and 5 load their shared
narrative foundations before story-owned CSS and keep the flowing accessibility stylesheet last.

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

- `story1.html` through `story5.html` use a light navigation-only Menu and the fixed Dark footer treatment.
- `index.html` and `story6.html` use the shared Menu with System settings, Light, Dark, and High contrast controls.
- Story pages that offer Light, Dark, and System settings apply them only to shared page chrome; story artwork is
  unchanged.
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
- Use semantic HTML, modern CSS, and small vanilla JavaScript.
- Keep shared webfonts and their licenses under `shared/assets/fonts/`; retain only required WOFF2 files.
- Preserve progressive enhancement and no-JavaScript access.
- Keep landing-specific work isolated to `index.html` and `landing/`; place approved cross-page foundations under
  `shared/`.
- Do not make broad edits to large embedded story documents.
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
node --check landing/js/main.js
node --check shared/js/main.js
node --check shared/js/menu.js
node --check shared/js/theme.js
node tools/check-maintained-pages.mjs
node tools/check-local-links.mjs --allow-known
node tools/check-story6.mjs
```

Also verify:

- Local `href`, `src`, and CSS `url()` references resolve.
- IDs are unique and fragment/ARIA references point to existing elements.
- The maintained-page checker reports only the documented embedded-SVG duplicate-ID baselines for Stories 2–4.
- Changed color combinations meet their required contrast ratios.
- The page is keyboard operable at 320 CSS pixels and up to 400% zoom.
- Focus is visible and is not obscured.
- No content is clipped after text-spacing changes.
- Story structure and extraction-hint changes preserve the complete article in Firefox Reader View.
- New or changed paper, publication, and Zenodo SOP links use canonical DOI URLs when a verified DOI is available

## Known technical debt

- Several filenames contain spaces, making path changes more error-prone.
- Some story documents contain large embedded image data.
- Story 2's inline SVG artwork contains 11 pre-existing repeated ID values; they are not current interaction targets,
  but a dedicated cleanup requires visual regression testing
- The drag-and-drop answer demo and its assets are organized together under `prototypes/drag-and-drop/`

Repository cleanup should be performed incrementally, with local-reference checks before and after every move.
The documented missing-reference baseline is maintained in [`docs/asset-map.md`](docs/asset-map.md). Run
`node tools/check-local-links.mjs` without `--allow-known` when resolving that baseline.

## License

This project is available under the [MIT License](LICENSE).
