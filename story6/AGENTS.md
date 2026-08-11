# Story 6 contributor instructions

## Scope and structure

- Treat `../story6.html`, `story6.style.css`, and `story6.js` as one feature even though the HTML entry point remains at the repository root
- Keep `story6.js` as the small entry point; place focused UI, animation, CDE, reveal, and layout responsibilities in `js/` modules
- Keep `js/notice.js` dependency-free and loaded immediately after the notice markup so dismissal never waits for GSAP, the Story 6 module graph, or CDE preparation
- Keep Story 6–specific images in `img/` and datasets in `data/`
- Keep fonts and shared footer assets in the repository-level `../assets/` directory
- Keep genuinely shared navigation, favicon, and cross-story images in the repository-level `../img/` directory
- Resolve paths in `../story6.html` from the repository root, such as `story6/img/example.webp`
- Resolve paths in `story6.style.css` from this directory, such as `../assets/fonts/example.woff2`
- Keep page-relative CDE data paths synchronized whenever a data filename or location changes
- Preserve current narrative copy unless the user explicitly requests content editing because Story 6 content may be changing concurrently

## Implementation guidance

- Do not add a build step or dependency for Story 6 without explicit approval
- Keep styles scoped under `#six` unless behavior is genuinely shared by every story
- Use the page-scoped HRA color and typography tokens for new Story 6 UI rather than introducing unscoped colors or type rules
- Keep Story 6 text selectable and preserve the accessible HRA-token-based `::selection` treatment
- Keep display formatting in the HTML or presenting component rather than caching formatted strings in JavaScript state
- Prefer semantic headings, lists, buttons, and links over recreating their behavior with generic elements and ARIA
- Preserve keyboard operation, visible focus states, menu `aria-expanded` state, and `aria-current="page"`
- Keep external links opened in a new tab paired with `rel="noopener noreferrer"`
- Keep the Cell Distance Explorer lazy-loaded and preserve its retry path, status messaging, standalone-app fallback, and focus transfer after loading
- If the embedded CDE fails, keep the retry control available and link to `https://apps.humanatlas.io/cde/` as the accessible secondary route
- Treat the Cell Distance Explorer as a fixed desktop canvas inside the page's responsive, keyboard-scrollable shell; do not override its internal grid or child-component styles
- Keep transitions and tutorial pinning responsive by deferring CDE construction until the tutorial section enters, then wait two paint frames so its pin can engage before parsing CDE data
- Load the CDE stylesheet with its component bundle during deferred preparation rather than blocking the initial document render
- Establish Story 6 border-box sizing before ScrollTrigger initializes so the deferred CDE stylesheet cannot change pinned-section geometry when it loads
- When the size notice is visible, wait for its dismissal before beginning proximity-triggered CDE preparation; do not gate an explicit CDE launch
- Start CDE proximity loading from the tutorial boundary only after its pin settles; use an idle fallback only when `IntersectionObserver` is unavailable
- Resolve CDE dataset paths against `document.baseURI` before connection and treat the explorer as ready only after its nonempty `nodes` and `edges` events fire
- Hide the outer CDE scrollbars when the full native canvas fits; expose scrolling only when viewport width, height, or zoom would otherwise clip controls
- Keep tutorial images, the CDE launch image, and the live CDE shell on the shared `1320 / 760` outer stage with an `82.5rem` maximum width
- Scale the live CDE into that stage only at `92%` or larger; below that threshold, preserve usable control sizing and expose the shell's labeled scrolling region
- Keep CDE tutorial guidance as semantic ordered-list items using the shared information-banner treatment and decorative `../assets/icons/info.svg` icon
- Keep tutorial banners horizontally centered; place narrow-screen banners below the scaled tutorial image
- Use a brief crossfade only between tutorial screenshots 1 and 2; switch every later screenshot directly at its step boundary
- Animate tutorial banners with restrained opacity and transform changes, and keep their complete text visible in the reduced-motion layout
- Do not parse or duplicate the large CSV datasets in page state unless a demonstrated feature requires it
- Keep the splash visually editorial rather than application-like: preserve its asymmetric placement, restrained paper surface, compact accent rule, and clear title-first hierarchy
- Keep the splash background visible around the title card and avoid adding partner marks to the title card unless the user explicitly requests them
- Preserve the splash title, subtitle, credits, background crop, and opening-question transition as separate responsibilities so visual refinements do not alter narrative content or scroll behavior

## Scrolling and animation

- Preserve native browser scrolling and do not introduce scroll hijacking or a smoothing dependency
- Use the shared `pinnedScrollScrub` value for animated pinned scenes so transitions respond consistently
- Prefer compositor-friendly `transform` and `opacity` animation over layout-triggering properties
- Use `createTextboxTransition` and `addTextboxChoreography` for transition headings rather than duplicating timelines
- Present transition headings as an editorial left-aligned column over a section-level contrast scrim; do not reintroduce floating bubbles, borders, or card shadows
- Keep all four non-splash transition background images static; reserve transition motion for the scrim, heading, and emphasis underline
- Keep the complete transition sentence in its semantic heading and wrap only the emphasized phrase in `.transition-emphasis`; never construct or rewrite the accessible text character by character
- Limit each transition to one emphasized phrase and animate its underline once after the heading entrance; do not use color alone to communicate emphasis
- Keep transition questions left-aligned and maintain the narrower opening-question treatment
- In reduced-motion and animation-failure states, expose the complete heading with its underline already drawn
- Recalculate ScrollTrigger geometry after assets load and retain the mobile-resize protection
- Keep pinned-scene height based on `--story-viewport-height`; update it and refresh ScrollTrigger once after a real resize settles rather than on every resize event
- Any new motion must have a `prefers-reduced-motion` state that exposes the same narrative and controls without pinning or animation
- Never leave meaningful content hidden when GSAP, ScrollTrigger, IntersectionObserver, or the CDE module is unavailable
- After changing section height or removing content near pinned scenes, verify ScrollTrigger refresh behavior and scroll through the full story at both slow and fast speeds

## Tissue comparison

- Keep research context inside the tissue-comparison introduction rather than in a detached setup panel
- Present each organ as a semantic figure and its Young, Aged, and Aged + D&Q samples as an ordered list
- Preserve the Young, Aged, Aged + D&Q reading order for every organ
- Keep the comparison container centered while all copy and condition labels remain left-aligned
- Stack samples vertically on narrow screens without a horizontal carousel or hidden comparison state
- Keep the takeaway card immediately visible; do not gate it behind an observer or entrance animation
- Keep image descriptions observational and avoid inferring biological causes from spatial maps alone
- Do not leave placeholder or lorem ipsum sections in the published narrative

## Image handling

- Give every image in flowing narrative content accurate intrinsic `width` and `height` attributes so late media loading cannot shift downstream ScrollTrigger geometry
- Keep the 960, 1920, and 3840 WebP transition variants together and update the complete `srcset` and fallback `src` when renaming one
- Use the 1920 WebP as each transition image's fallback `src`; do not retain a duplicate PNG fallback
- Load Transition 3 eagerly at high priority so rapid scrolling cannot outrun its request; keep all other non-splash transition backgrounds lazy
- Preserve transparent backgrounds when optimizing transition images
- Use the 960 px transition settings below when regenerating that variant

```bash
cwebp -q 82 -alpha_q 90 -m 6 -mt -resize 960 540 story6/img/transition-N-1920.webp -o story6/img/transition-N-960.webp
```

- Run the command from the repository root and do not install `cwebp` or any other tool without explicit approval

## Validation

Run the dependency-free checks from the repository root after JavaScript or path changes:

```bash
for js_file in story6/story6.js story6/js/*.js; do node --check "$js_file" || exit 1; done
npx --no-install eslint story6/story6.js story6/js/*.js --no-config-lookup --rule 'no-unused-vars:error' --rule 'no-unreachable:error' --rule 'no-dupe-keys:error'
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
- Resize desktop width and height continuously, then confirm pinned scenes settle into the correct layout without overlapping or retaining stale measurements
- Open the story menu by pointer and keyboard, then close it with its button, `Escape`, and an outside click
- Confirm the menu stays inside the viewport and identifies Story 6 as the current page
- Dismiss the screen-size notice and confirm it stays dismissed until refresh
- Reload at several story positions and confirm Story 6 restarts at the top before pinned scenes initialize
- Enable reduced motion and confirm all narrative text, tutorial instructions, and the CDE launch button remain available
- Load the young mouse CDE, simulate a loading failure, and confirm its launch button can retry
- At narrow widths and high zoom, confirm the CDE remains usable by scrolling its labeled frame with touch, pointer, and keyboard input
- Confirm all local image, font, script, stylesheet, and dataset requests return successfully
- Select text with a mouse and with mobile long-press, then confirm the selection colors remain readable on light and dark Story 6 surfaces
- Confirm the tissue comparison is centered, its text remains left-aligned, and all nine samples are reachable without horizontal scrolling
- Confirm the Cell Distance Explorer section retains an accessible region name when visible introductory copy is intentionally absent
