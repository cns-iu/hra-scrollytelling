# Human Reference Atlas Scrollytelling

An interactive collection of mixed-media stories that introduces the [Human Reference Atlas](https://humanatlas.io/)
to a general audience.

The project is a static website maintained by the Cyberinfrastructure for Network Science Center at Indiana
University. It is published through GitHub Pages and intentionally has no package manager, framework, build step, or
installed dependencies.

[View the published site](https://cns-iu.github.io/hra-scrollytelling/)

## Preview locally

Clone the repository, enter its directory, and start a small local web server:

```bash
git clone https://github.com/cns-iu/hra-scrollytelling.git
cd hra-scrollytelling
python3 -m http.server 8000
```

Open [http://localhost:8000/](http://localhost:8000/) in a browser. Keep the terminal running while previewing and
press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop the server.

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

The repository also contains older prototypes and demonstrations, including `story0.html`, `VisualizingCells.html`,
`organExample.html`, and `img/test.html`. These are not primary entry points.

## Repository structure

```text
.
├── index.html          # Accessible landing-page structure and content
├── landing/            # Isolated landing-page implementation
│   ├── assets/
│   │   ├── hero.png           # Responsive decorative hero artwork
│   │   ├── social-preview.png # 1200×630 link-preview artwork
│   │   └── fonts/             # Self-hosted HRA webfonts and licenses
│   ├── css/
│   │   ├── fonts.css   # Typography stacks and future font declarations
│   │   ├── tokens.css  # HRA themes and shared design tokens
│   │   └── styles.css  # Components, layout, and accessibility adaptations
│   └── js/
│       ├── main.js     # Landing-page entry point
│       ├── menu.js     # Menu disclosure and focus behavior
│       └── theme.js    # Appearance preferences and persistence
├── shared/             # Approved target for landing-and-story page chrome
│   ├── css/            # Namespaced navigation, footer, and story-navigation styles
│   └── js/             # Progressive-enhancement navigation and appearance modules
├── docs/               # Architecture and asset-migration records
├── tools/              # Dependency-free repository validation
├── story1.html         # Story experiences
├── story2.html
├── story3.html
├── story4.html
├── story5.html
├── stories/            # Gradually organized story-owned implementation files
│   └── story-4/
│       └── config/
│           └── particles.json # Preserved particle configuration reference
├── style.css           # Legacy shared story styles
├── scripts.js          # Legacy shared story behavior
├── img/                # Shared and story-specific visual assets
├── js/                 # Story runtimes, utilities, and legacy scripts
├── music/              # Audio used by story experiences
└── Game/               # Isolated generated game and offline runtime
```

The current layout contains tightly coupled relative paths. Do not move files or assets without first mapping and
validating every HTML, CSS, JavaScript, JSON, and service-worker reference. See
[`docs/architecture.md`](docs/architecture.md) for ownership boundaries and the staged target structure, and
[`docs/asset-map.md`](docs/asset-map.md) for the current migration register.

## Landing-page architecture

The landing page is deliberately separated from the legacy story implementation:

- `index.html` owns its semantic structure and editorial content.
- `landing/assets/hero.png` is the optimized decorative hero artwork.
- `landing/css/fonts.css` owns the self-hosted HRA font declarations and resilient typography stacks.
- `landing/css/tokens.css` owns light/dark HRA colors, semantic roles, and shared layout tokens.
- `landing/css/styles.css` owns components, layout, responsive rules, and accessibility adaptations.
- `landing/js/main.js` is the module entry point and initializes independent landing-page features.
- `landing/js/menu.js` owns the floating navigation disclosure and its focus behavior.
- `landing/js/theme.js` owns appearance selection, persistence, and system-preference changes.

Load the three stylesheets in the order shown above so font and design tokens exist before component rules use them.
The inline script in `index.html` applies a saved theme before paint; keep its storage key aligned with `theme.js`.
The landing page does not load `style.css`, `scripts.js`, remote fonts, or a JavaScript framework.

### Page metadata

The landing page identifies `https://cns-iu.github.io/hra-scrollytelling/` as its canonical URL and includes Open
Graph and large-card metadata for consistent search and link previews. The browser theme color follows both the system
preference and an explicit Light or Dark selection.

The visible hero uses `landing/assets/hero.png`, while link previews use the dedicated
`landing/assets/social-preview.png` artwork. Follow-up metadata work should:

- Evaluate `CollectionPage` structured data once story ownership, authorship, and publishing details are confirmed.
- Add page-specific metadata to each story as those pages receive accessibility remediation.

### Color themes

The landing page includes light and dark themes derived from the Human Reference Atlas color guidance. It:

- Uses the operating-system preference on the first visit.
- Provides System settings, Light, and Dark options inside the labeled Menu panel.
- Remembers the selected mode in local storage; System settings continues to follow operating-system changes.
- Restores a saved selection before paint to avoid flashing the wrong theme.
- Uses AAA-safe component pairings rather than assuming every brand-token pairing is suitable for normal text.
- Continues to respect forced-colors and reduced-motion preferences.

### Typography

The landing page implements the HRA Figma typography scale as reusable tokens in `landing/css/fonts.css`:

- Metropolis Medium and Bold for display and headline roles.
- Nunito Sans Regular, Medium, Semibold, and Bold for titles, labels, body copy, and controls.
- Roboto Mono Regular for monospaced roles.

Component rules in `landing/css/styles.css` use discrete scale roles rather than arbitrary font sizes. Display headings
step down to the approved Display Small role on narrow viewports. The 11- and 12-pixel scale roles are retained as
tokens but are not used for essential landing-page content.

### Navigation and appearance

The fixed top-left Menu control provides quick access to every story, Human Reference Atlas resources, and appearance
preferences. Its panel uses ordinary navigation links and native radio controls rather than application-menu roles.
Opening the panel moves focus to it; its close button, the <kbd>Escape</kbd> key, or a pointer press outside the panel
closes it. Keyboard-initiated closing restores focus to the Menu control.

The control and panel account for device safe areas, retain 44-by-44-pixel targets, and allow the panel content to
scroll within short or highly zoomed viewports.

## Shared page chrome

The maintained landing page and five story pages are migrating toward a common Menu, footer, and end-of-story
navigation system under `shared/`. Because GitHub Pages serves the source files directly, each page retains semantic
component markup in its HTML while sharing namespaced CSS and small JavaScript modules. Essential links and landmarks
are never injected at runtime.

During the staged migration:

- `index.html` remains the reference implementation for Menu, appearance, and footer accessibility.
- Story pages apply Light, Dark, and System settings only to shared page chrome; story artwork is unchanged.
- The accessible landing-page footer is the canonical footer for maintained public pages.
- Each story is adopted and validated in a separate commit.
- Prototype pages and `Game/` remain outside the shared page-chrome rollout.

See [`docs/architecture.md`](docs/architecture.md#shared-page-chrome) for component boundaries and the migration
sequence.

## Accessibility

The landing page targets WCAG 2.2 Level AAA and includes:

- Semantic landmarks, headings, and list structure.
- A skip link and logical keyboard navigation.
- Accessible names for functional images and controls.
- Visible focus indicators and 44-by-44-pixel minimum targets.
- AAA-oriented text contrast and non-text control contrast.
- Content-driven responsive sizing and 320-pixel reflow support.
- Reduced-motion and forced-colors support.
- A floating navigation disclosure with a persistent visible label, state announcement, Escape, outside click, and
  focus restoration.
- A persistent three-state appearance preference grouped with a native fieldset and radio controls.

The story pages predate this work and have not yet received the same accessibility remediation. The repository as a
whole should not be described as WCAG AAA conformant until each story has been audited and tested.

Automated checks are not sufficient for conformance. Final validation must include real-browser keyboard, screen
reader, 200–400% zoom, text-spacing, forced-colors, reduced-motion, and mobile-browser testing.

## Development guidelines

- Keep the site dependency-free.
- Use semantic HTML, modern CSS, and small vanilla JavaScript.
- Keep landing-page webfonts and their licenses under `landing/assets/fonts/`; retain only required WOFF2 files.
- Preserve progressive enhancement and no-JavaScript access.
- Keep landing-page work isolated to `index.html` and `landing/`.
- Do not make broad edits to generated `Game/` files or large embedded story documents.
- Avoid reorganizing files as part of unrelated feature work.
- Explain and approve dependency or repository-structure changes before implementing them.
- Keep this README and `AGENTS.md` synchronized with durable architecture and accessibility changes.
- Follow the repository's branch, review, and release workflow for commits and publication.

Repository-specific instructions for coding agents are documented in [`AGENTS.md`](AGENTS.md).

## Basic validation

Before handing off a change:

```bash
git diff --check
node --check landing/js/main.js
node --check landing/js/menu.js
node --check landing/js/theme.js
node tools/check-local-links.mjs --allow-known
```

Also verify:

- Local `href`, `src`, and CSS `url()` references resolve.
- IDs are unique and fragment/ARIA references point to existing elements.
- Changed color combinations meet their required contrast ratios.
- The page is keyboard operable at 320 CSS pixels and up to 400% zoom.
- Focus is visible and is not obscured.
- No content is clipped after text-spacing changes.

## Known technical debt

- Most story pages share one large global stylesheet.
- Assets for multiple stories are mixed together under `img/`.
- Several filenames contain spaces, making path changes more error-prone.
- Some story documents contain large embedded image data.
- The generated game has its own service worker and runtime assumptions.
- Legacy prototype pages and production pages are stored together.

Repository cleanup should be performed incrementally, with local-reference checks before and after every move.
The documented missing-reference baseline is maintained in [`docs/asset-map.md`](docs/asset-map.md). Run
`node tools/check-local-links.mjs` without `--allow-known` when resolving that baseline.

## License

This project is available under the [MIT License](LICENSE).
