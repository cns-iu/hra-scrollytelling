# Repository Instructions

## Project context

This repository is a dependency-free static website that introduces the Human Reference Atlas through mixed-media
scrollytelling. It is published with GitHub Pages and has no build step, package manifest, or package manager workflow.

Explain proposed interface changes in terms of visible behavior before discussing implementation details. When a UI
change spans multiple files, list each file and why it must change before editing. Separate required work from optional
improvements.

## Current landing-page architecture

Landing-page work is intentionally isolated to:

- `index.html` for content and semantic structure.
- `landing/assets/hero.png` for optimized decorative hero artwork.
- `landing/assets/social-preview.png` for the canonical 1200-by-630-pixel link-preview artwork.
- `shared/css/fonts.css` for typography stacks and font declarations used by the landing page and shared page chrome.
- `landing/css/fonts.css` as a compatibility bridge for cached documents that still request the former font URL.
- `landing/css/tokens.css` for landing-page themes and shared design tokens.
- `landing/css/styles.css` for landing-page components, layout, and accessibility adaptations.
- `landing/js/main.js` for initializing landing-page modules.
- `landing/js/menu.js` for the navigation disclosure and focus behavior.
- `landing/js/theme.js` for appearance selection, persistence, and system-preference behavior.

Do not reconnect the landing page to the legacy `style.css` or `scripts.js`. Do not allow landing-page selectors or
behavior to affect the story pages. Do not overwrite or repurpose legacy files directly under `js/`. Keep the landing
stylesheet order `shared/css/fonts.css`, `landing/css/tokens.css`, then `landing/css/styles.css`, and load
`landing/js/main.js` as an ES module.

## Shared page-chrome architecture

The maintained public pages are `index.html` and `story1.html` through `story5.html`. Their Menu, appearance controls,
footer, and end-of-story navigation are migrating to namespaced foundations under:

- `shared/css/tokens.css` for component-scoped Light and Dark appearance roles.
- `shared/css/fonts.css` and `shared/assets/fonts/` for approved HRA typography and licenses.
- `shared/css/navigation.css` for the skip link and native Menu disclosure.
- `shared/css/footer.css` for the canonical site footer.
- `shared/css/story-navigation.css` for previous and next story links.
- `shared/js/main.js`, `shared/js/menu.js`, and `shared/js/theme.js` for progressive enhancement.

Keep essential shared component markup in every consuming HTML page; do not inject it with JavaScript. Add the
`site-chrome` class to each component root so story appearance changes do not affect story artwork. On story pages,
System settings, Light, and Dark apply only to shared page chrome. Preserve `hra-landing-theme` as the storage key
during migration.

Adopt the foundation one page at a time. Story 1 is the integration pilot while the landing-page redesign is in
progress; migrate `index.html` after its revised design is approved. Do not remove a legacy component rule until
repository-wide search confirms that no maintained or prototype page consumes it. Prototype pages and `Game/` are
excluded from the shared page-chrome rollout.

Preserve existing uncommitted work and follow the repository's active branch and review workflow. Do not rewrite,
discard, commit, push, or publish changes unless those operations are explicitly in scope.

## Page metadata

- Keep the canonical and `og:url` values aligned with the clean trailing-slash GitHub Pages URL.
- Use absolute URLs for social preview images and provide accurate image type, dimensions, and alternative text.
- Keep the standard description, Open Graph description, and large-card description consistent in meaning.
- When replacing the social preview, update every image URL, dimension, and alternative-description field together.
- Keep browser theme-color metadata synchronized with system, Light, and Dark appearance modes.

## Dependencies and runtime

- Do not add, install, remove, or upgrade dependencies.
- Do not run package installation commands.
- Prefer semantic HTML, modern CSS, and small vanilla JavaScript.
- The site must remain usable when JavaScript is unavailable.
- Preserve Google Analytics unless its removal is explicitly requested.
- Preview locally with `python3 -m http.server 8000`; no build command is required.

## Accessibility requirements

Target WCAG 2.2 Level AAA for the landing-page experience. Do not claim conformance based only on automated checks.

At minimum:

- Use native elements and landmarks before ARIA.
- Maintain a logical heading hierarchy and meaningful source order.
- Make the complete experience operable with a keyboard.
- Provide strong, persistent `:focus-visible` indicators.
- Keep standalone pointer targets at least 44 by 44 CSS pixels.
- Meet 7:1 contrast for normal text and 4.5:1 for large text.
- Meet 3:1 non-text contrast for meaningful controls and boundaries.
- Support reflow at 320 CSS pixels and browser zoom up to 400%.
- Allow text-spacing overrides without clipping or loss of content.
- Respect reduced-motion preferences and forced-colors mode.
- Give functional images accessible names and decorative images `alt=""`.
- Avoid unexpected new windows or clearly communicate them when essential.
- Test disclosure controls for state announcement, Escape, outside click, and focus behavior.

Rendered keyboard, screen-reader, zoom, high-contrast, and mobile-browser checks are required before final AAA sign-off.
When reviewing screenshots, distinguish real mobile-browser behavior from desktop device-emulation artifacts.

## Styling and themes

- Use semantic design tokens rather than scattering raw colors through component rules.
- Keep landing-page theme tokens in `landing/css/tokens.css` and shared page-chrome tokens in
  `shared/css/tokens.css`.
- Keep font stacks and `@font-face` declarations in `shared/css/fonts.css`. Keep approved self-hosted fonts and their
  license files under `shared/assets/fonts/`; do not add or replace font files without explicit approval.
- Keep component and accessibility rules in `landing/css/styles.css` rather than duplicating tokens in component
  selectors.
- Keep the fixed top-left Menu control visibly labeled. Use ordinary navigation links, not `role="menu"`, for page and
  story navigation.
- Preserve the Menu panel's explicit close control, Escape behavior, outside-pointer dismissal, and focus restoration.
  Ensure the fixed control does not obscure focused content at high zoom.
- Keep appearance options in a native radio-group fieldset with System settings, Light, and Dark choices.
- The appearance control must respect the initial system preference, persist the selected mode, avoid a load-time
  theme flash, and remain accessible without color alone.
- Keep the prepaint storage key in each migrated page aligned with the active landing or shared theme module.
- Figma or Material color tokens are inputs, not automatic proof of AAA contrast. Verify every applied foreground and
  background pairing.
- Do not alter shared story-page styles while implementing landing-page visual changes.

## Repository safety

The repository contains tightly coupled relative paths, filenames with spaces, large media, generated game files, and
prototype pages.

- Search all HTML, CSS, JavaScript, JSON, and service-worker references before moving or renaming a file.
- Move assets only in small, explicitly approved batches and validate every affected entry point.
- Follow the ownership boundaries and copy-first migration workflow in `docs/architecture.md`.
- Update `docs/asset-map.md` whenever asset ownership or the known missing-reference baseline changes.
- Treat `Game/` as an isolated generated application. Do not reorganize or hand-edit it unless the task specifically
  targets the game.
- Avoid broad formatting or mechanical rewrites of `story3.html` and `story4.html`; they contain large embedded data.
- Preserve `story0.html`, `VisualizingCells.html`, `organExample.html`, and `img/test.html` as legacy/prototype material
  unless cleanup is explicitly in scope.
- Do not rewrite Git history to reduce repository size without explicit approval.
- Do not expand a task into adjacent story pages or shared components without explaining the relationship and getting
  approval.

## Editing and validation

Use four-space indentation in HTML, CSS, and JavaScript. Keep accessible names and visible labels aligned. Prefer local
relative links for story navigation.

Keep `README.md` and `AGENTS.md` current when architecture, accessibility behavior, validation expectations, or
maintainer workflows change. Documentation must remain project-focused and must not include personal user context,
temporary conversation details, or workstation-specific assumptions.

After changes:

1. Run `git diff --check`.
2. Run `node --check` for each changed JavaScript file, including repository tools.
3. Run `node tools/check-local-links.mjs --allow-known` and investigate any new failure.
4. Confirm IDs are unique and all fragment and ARIA ID references resolve.
5. Recalculate affected contrast pairs.
6. Test keyboard and disclosure behavior.
7. Inspect at 320 CSS pixels, 200% and 400% zoom, reduced motion, and forced colors when a browser is available.
8. Report what changed, what was intentionally unchanged, which validations passed, and which manual checks remain.
