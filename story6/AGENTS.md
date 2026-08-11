# Story 6 contributor instructions

## Scope and structure

- Treat `../story6.html`, `story6.style.css`, and `story6.js` as one feature even though the HTML entry point remains at the repository root
- Keep Story 6–specific images in `img/` and datasets in `data/`
- Keep fonts and shared footer assets in the repository-level `../assets/` directory
- Keep genuinely shared navigation, favicon, and cross-story images in the repository-level `../img/` directory
- Resolve paths in `../story6.html` from the repository root, such as `story6/img/example.webp`
- Resolve paths in `story6.style.css` from this directory, such as `../assets/fonts/example.woff2`
- Keep downloadable dataset links and the deployed CDE URLs synchronized whenever a data filename or location changes
- Preserve current narrative copy unless the user explicitly requests content editing because Story 6 content may be changing concurrently

## Implementation guidance

- Do not add a build step or dependency for Story 6 without explicit approval
- Keep styles scoped under `#six` unless behavior is genuinely shared by every story
- Keep display formatting in the HTML or presenting component rather than caching formatted strings in JavaScript state
- Prefer semantic headings, lists, buttons, and links over recreating their behavior with generic elements and ARIA
- Preserve keyboard operation, visible focus states, menu `aria-expanded` state, and `aria-current="page"`
- Keep external links opened in a new tab paired with `rel="noopener noreferrer"`
- Keep the Cell Distance Explorer lazy-loaded and preserve its retry path, status messaging, downloadable-data fallback, and focus transfer after loading
- Do not parse or duplicate the large CSV datasets in page state unless a demonstrated feature requires it

## Scrolling and animation

- Preserve native browser scrolling and do not introduce scroll hijacking or a smoothing dependency
- Use the shared `pinnedScrollScrub` value for animated pinned scenes so transitions respond consistently
- Prefer compositor-friendly `transform` and `opacity` animation over layout-triggering properties
- Use `createTextboxTransition` and `addTextboxChoreography` for transition question cards rather than duplicating timelines
- Keep transition questions left-aligned and maintain the narrower opening-question card
- Recalculate ScrollTrigger geometry after assets load and retain the mobile-resize protection
- Any new motion must have a `prefers-reduced-motion` state that exposes the same narrative and controls without pinning or animation
- Never leave meaningful content hidden when GSAP, ScrollTrigger, IntersectionObserver, or the CDE module is unavailable

## Image handling

- Keep the 960, 1920, and 3840 WebP transition variants together and update the complete `srcset` and fallback `src` when renaming one
- Use the 1920 WebP as each transition image's fallback `src`; do not retain a duplicate PNG fallback
- Preserve transparent backgrounds when optimizing transition images
- Use the 960 px transition settings below when regenerating that variant

```bash
cwebp -q 82 -alpha_q 90 -m 6 -mt -resize 960 540 story6/img/transition-N-1920.webp -o story6/img/transition-N-960.webp
```

- Run the command from the repository root and do not install `cwebp` or any other tool without explicit approval

## Validation

Run the dependency-free checks from the repository root after JavaScript or path changes:

```bash
node --check story6/story6.js
npx --no-install eslint story6/story6.js --no-config-lookup --rule 'no-unused-vars:error' --rule 'no-unreachable:error' --rule 'no-dupe-keys:error'
git diff --check
```

Preview from the repository root so root-relative project paths behave like deployment:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/story6.html` and complete this smoke test:

- At 320, 375, 768, and 1440 CSS pixels, confirm there is no horizontal scroll and the splash title stays inside its card
- Distinguish desktop device-emulation artifacts from behavior reproduced in an actual mobile browser
- Scroll from the splash into “What is immunosenescence?” and confirm the background fade remains while the card entrance, hold, and exit match later transitions
- Scroll slowly and quickly through every pinned scene and confirm animations follow without jumps when mobile browser controls resize the viewport
- Open the story menu by pointer and keyboard, then close it with its button, `Escape`, and an outside click
- Confirm the menu stays inside the viewport and identifies Story 6 as the current page
- Dismiss the screen-size notice and confirm it stays dismissed until refresh
- Reload without a URL fragment and confirm the story returns to the top, then reload with a fragment and confirm the browser preserves the target
- Enable reduced motion and confirm all narrative text, tutorial instructions, and both CDE launch buttons remain available
- Load each CDE, simulate a loading failure, and confirm its launch button can retry
- Confirm all local image, font, script, stylesheet, and dataset requests return successfully
