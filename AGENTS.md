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
- `landing/assets/backgrounds/` for theme-specific decorative splash artwork.
- `landing/assets/social-preview.png` for the canonical 1200-by-630-pixel link-preview artwork.
- `shared/assets/icons/menu.svg` for the approved Menu icon shared with maintained page chrome.
- `shared/css/fonts.css` for typography stacks and font declarations used by the landing page and shared page chrome.
- `landing/css/fonts.css` as a compatibility bridge for cached documents that still request the former font URL.
- `landing/css/tokens.css` for landing-page themes and shared design tokens.
- `shared/css/tokens.css`, `shared/css/selection.css`, `shared/css/navigation.css`, and `shared/css/footer.css` for the
  canonical Menu, skip link, and footer.
- `landing/css/styles.css` for landing-page content, layout, and accessibility adaptations outside shared page chrome.
- `landing/js/main.js` for initializing the shared Menu, appearance, contrast, and back-to-top modules on the landing
  page.
- `shared/js/contrast.js` for the persistent High contrast switch used by landing and shared page chrome.

Do not reconnect the landing page to the legacy `style.css` or to prototype or story scripts. Do not allow
landing-page selectors or behavior to affect the story pages. Do not restore a root `js/` directory; place new scripts
under their owning page, story, prototype, or shared component. Keep the landing stylesheet order
`shared/css/fonts.css`, `landing/css/tokens.css`, the shared page-chrome stylesheets, then `landing/css/styles.css`, and
load `landing/js/main.js` as an ES module.

## Shared page-chrome architecture

The maintained public pages are `index.html` and `story1.html` through `story6.html`. Their Menu, appearance controls,
footer, and end-of-story navigation use namespaced foundations under:

- `shared/css/tokens.css` for component-scoped Light and Dark appearance roles.
- `shared/css/fonts.css` and `shared/assets/fonts/` for approved HRA typography and licenses.
- `shared/assets/icons/menu.svg` for the canonical Menu glyph.
- `shared/assets/icons/favicon.svg`, `favicon.ico`, and `apple-touch-icon.png` for the cross-device favicon set used by
  every HTML entry point.
- `shared/assets/logos/` for the landing hero, canonical footer, and theme-aware organization marks.
- `shared/css/selection.css` for theme-aware text selection scoped to shared page chrome.
- `shared/css/navigation.css` for the skip link and native Menu disclosure.
- `shared/css/footer.css` for the canonical site footer.
- `shared/css/story-navigation.css` for previous and next story links.
- `shared/js/main.js`, `shared/js/navigation-only.js`, `shared/js/menu.js`, `shared/js/theme.js`,
  `shared/js/contrast.js`, and `shared/js/back-to-top.js` for progressive enhancement.

Keep essential shared component markup in every consuming HTML page; do not inject it with JavaScript. Add the
`site-chrome` class to each component root so story appearance changes do not affect story artwork. On story pages
that offer appearance selection, System settings, Light, and Dark apply only to shared page chrome. Preserve
`hra-landing-theme` as the storage key during migration. Include the appearance fieldset only when a page initializes
theme selection; omit it when appearance is not an available option. Add `site-chrome--light` to the Menu root on
pages without appearance selection so the Menu does not follow the operating-system dark preference. Keep the High
contrast switch available only on `index.html` and `story6.html`, which are the pages that offer appearance controls.
Story 1 through Story 5 use navigation-only Menus. On Story 6, preference changes must remain inside `.site-chrome`
roots and explicitly approved story surfaces.

All maintained pages use the canonical shared Menu and footer. Story 1 through Story 5 keep their Menu light and their
footer on the fixed Dark treatment with `site-chrome--dark`. The landing page and Story 6 allow the shared footer to
follow their appearance selection. Do not remove a legacy component rule until repository-wide search confirms that
no maintained or prototype page consumes it. The Scrollytelling Effects, Organ Example, and Visualizing Cells
prototypes explicitly adopt the navigation-only shared Menu and fixed-Dark shared footer. They remain outside shared
appearance behavior, and prototype-owned content and navigation must stay isolated from shared page chrome.
All prototype entry points load `shared/css/fonts.css` and `prototypes/shared/typography.css`; prototype-owned body
text defaults to Nunito Sans, while prototype-owned rules may select Metropolis where specified. Do not hand-edit
generated web-component internals to override their encapsulated typography.

All maintained pages use the default shared Menu FAB geometry. Keep story-specific box-model resets scoped to
story-owned surfaces so they do not override `.site-chrome` component sizing.

Preserve existing uncommitted work and follow the repository's active branch and review workflow. Do not rewrite,
discard, commit, push, or publish changes unless those operations are explicitly in scope.

## Page metadata

- Keep the canonical and `og:url` values aligned with the clean trailing-slash GitHub Pages URL.
- Use absolute URLs for social preview images and provide accurate image type, dimensions, and alternative text.
- Keep the standard description, Open Graph description, and large-card description consistent in meaning.
- When replacing the social preview, update every image URL, dimension, and alternative-description field together.
- Keep browser theme-color metadata synchronized with system, Light, and Dark appearance modes.

## Publication links

- Link papers and scholarly publications through their canonical `https://doi.org/<doi>` URL whenever a DOI has been assigned
- Do not substitute a publisher, journal, repository, search-result, or DOI-proxy URL when a verified DOI URL is available
- Never infer or fabricate a DOI; when no DOI exists, retain the most authoritative stable publication URL and document the exception
- During every maintainability scan, audit links presented as papers or publications and references listed in story end matter; identify non-DOI links, verify whether each work has a DOI, and replace confirmed matches with the canonical DOI URL

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
- Respect reduced-motion, reduced-transparency, increased-contrast, and forced-colors preferences.
- Give functional images accessible names and decorative images `alt=""`.
- Avoid unexpected new windows or clearly communicate them when essential.
- Test disclosure controls for state announcement, Escape, outside click, and focus behavior.

Rendered keyboard, screen-reader, zoom, high-contrast, and mobile-browser checks are required before final AAA sign-off.
When reviewing screenshots, distinguish real mobile-browser behavior from desktop device-emulation artifacts.

## Reader View and linear reading

Treat browser Reader View as a supported presentation for every maintained public page. Reader View is progressive
enhancement rather than a substitute for an accessible default page.

- Keep the complete narrative in meaningful source order using `main`, `article`, headings, paragraphs, figures,
  captions, and native lists
- Do not construct essential narrative text with JavaScript or depend on pinned positioning, background images,
  generated content, or visual overlays to communicate it
- Mark decorative animation layers with empty alternatives and `aria-hidden="true"`; provide a concise in-flow image or
  text alternative when an animated visual carries information that the surrounding copy does not
- Use `article-content` and `article-header` only as extraction hints where testing shows they help; keep the underlying
  HTML semantic because browser extraction heuristics and class handling can change
- Preserve final summaries, conclusions, resources, acknowledgments, and references inside the primary article source
  order so extraction does not stop before them
- Use source-pixel image dimensions by default; when compact `width` and `height` values intentionally control Reader
  View sizing, preserve the asset's aspect ratio, document the exception, and verify the normal page still reserves
  stable image space
- Test Reader View in Firefox after structural story changes and confirm the title, every transition sentence,
  informative image alternative, conclusion, and end matter appear once in the intended order

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
- When appearance selection is offered, keep its options in a native radio-group fieldset with System settings,
  Light, and Dark choices.
- An offered appearance control must respect the initial system preference, persist the selected mode, avoid a
  load-time theme flash, and remain accessible without color alone.
- Implement High contrast as a visibly labeled `button` with `role="switch"`, synchronized `aria-checked` and visible
  On/Off text, operating-system fallback, and persistence under the `hra-high-contrast` storage key.
- Keep the prepaint storage key in each migrated page aligned with the active landing or shared theme module.
- Figma or Material color tokens are inputs, not automatic proof of AAA contrast. Verify every applied foreground and
  background pairing.
- Keep custom text-selection colors tokenized, scoped away from story artwork, and disabled in forced-colors mode.
- Do not alter shared story-page styles while implementing landing-page visual changes.

## Repository safety

The repository contains tightly coupled relative paths, filenames with spaces, large media, and prototype pages.

- Search all HTML, CSS, JavaScript, JSON, and service-worker references before moving or renaming a file.
- Move assets only in small, explicitly approved batches and validate every affected entry point.
- Follow the ownership boundaries and copy-first migration workflow in `docs/architecture.md`.
- Update `docs/asset-map.md` whenever asset ownership or the known missing-reference baseline changes.
- Avoid broad formatting or mechanical rewrites of `story3.html` and `story4.html`; they contain large embedded data.
- Keep the drag-and-drop answer demo fully owned by `prototypes/drag-and-drop/`; do not recreate a root `img/`
  directory.
- Keep story-exclusive assets under their owning `stories/storyN/` directory, assets shared by maintained stories or
  by a maintained page and a prototype under `shared/assets/`, and prototype-only assets under their owning
  `prototypes/` directory or `prototypes/shared/` when multiple prototypes consume them.
- Preserve `story0.html` as the compatibility entry point for the Scrollytelling Effects implementation under
  `prototypes/scrollytelling-effects/`. Do not restore a root `scripts.js` or load the prototype script from maintained
  pages.
- Keep Story 4's particle scripts under `stories/story4/` and the Scrollytelling Effects web-component bundle under
  `prototypes/scrollytelling-effects/`. Do not recreate removed root copies or promote story- or prototype-owned code
  into `shared/js/`.
- Keep Story 4 presentation under `stories/story4/styles.css`; do not reconnect `story4.html` or its embedded SVGs to
  root `style.css`.
- Preserve `VisualizingCells.html` and `organExample.html` as compatibility entry points for the implementations under
  `prototypes/`; do not delete or repurpose those published URLs without explicit approval.
- Keep Organ Example presentation under `prototypes/organ-example/styles.css`; do not reconnect it to root
  `style.css`.
- Keep Visualizing Cells presentation under `prototypes/visualizing-cells/styles.css`; do not reconnect it to root
  `style.css`.
- Keep Scrollytelling Effects presentation under `prototypes/scrollytelling-effects/`; do not reconnect it to root
  `style.css`.
- Keep Story 1 presentation under `stories/story1/`; do not reconnect `story1.html` to root `style.css`.
- Keep the narrative foundation and character-dialogue styles shared by Stories 2, 3, and 5 under `shared/css/`; keep
  story-specific scenes and interactions under their owning story as they migrate out of root `style.css`.
- Keep Story 5-specific presentation under `stories/story5/styles.css`; do not restore those rules to root
  `style.css`.
- Keep Story 2-specific presentation under `stories/story2/styles.css` and its focused quiz component under
  `stories/story2/quiz.css`; do not restore those rules to root `style.css`.
- Do not create a new organizational directory directly under `stories/` without explicit approval.
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
4. Run `node tools/check-story6.mjs` when Story 6 markup, styles, scripts, or image candidates change.
5. Confirm IDs are unique and all fragment and ARIA ID references resolve.
6. Recalculate affected contrast pairs.
7. Test keyboard and disclosure behavior.
8. Inspect at 320 CSS pixels, 200% and 400% zoom, reduced motion, reduced transparency, increased contrast, and forced
   colors when a browser is available.
9. Inspect the complete linear article in Firefox Reader View after changing story structure or content extraction
   hints.
10. Report what changed, what was intentionally unchanged, which validations passed, and which manual checks remain.
