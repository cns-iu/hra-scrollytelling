# Story 6 contributor instructions

## Scope and structure

- Treat `../../story6.html`, the styles in `css/`, and `story6.js` as one feature even though the HTML entry point remains at the repository root
- When creating or substantially restructuring files, keep each file at 500 lines or fewer where practical; split larger files by clear responsibility
- Keep `story6.js` as the small entry point; place focused UI, animation, reveal, and layout responsibilities in `js/` modules
- Keep `css/base.css` responsible for Story 6 typography tokens, accessibility, and page primitives; use `../../shared/css/fonts.css` for font declarations and the repository-level `shared/` styles and modules for the Menu and appearance controls
- Keep `css/theme.css` responsible for Story 6 semantic color roles and scoped System, Light, Dark, High contrast, and forced-colors adaptations
- Keep `css/splash-transitions.css`, `css/narrative.css`, `css/tissue-comparison.css`, `css/cde.css`, and `css/cde-comparison.css` scoped to their named Story 6 regions
- Keep Resources, Acknowledgments, and References content in `end-matter.json`; shared presentation and runtime rendering belong to `../../shared/css/story-end-matter.css` and `../../shared/js/story-end-matter.js`
- Keep responsive, animation-failure, and reduced-motion rules beside the component styles they modify rather than collecting them in a separate responsive file
- Keep Story 6–specific narrative images in `img/`
- Keep fonts, organization logos, and shared interface icons, including the favicon, under the repository-level `../../shared/assets/` directory; keep cross-story narrative images under `../../shared/assets/images/`
- Resolve paths in `../../story6.html` from the repository root, such as `story/6/img/example.webp`
- Resolve paths in `css/*.css` from the `css/` directory, such as `../../../shared/assets/icons/info.svg`
- Preserve current narrative copy unless the user explicitly requests content editing because Story 6 content may be changing concurrently

## Implementation guidance

- Do not add a build step or dependency for Story 6 without explicit approval
- Keep styles scoped under `#six` unless behavior is genuinely shared by every story
- Use the page-scoped HRA color and typography tokens for new Story 6 UI rather than introducing unscoped colors or type rules
- Preserve the image-backed `.transition1`, `.transition2`, `.transition3`, `.transition4`, and `.transition5` art direction across System, Light, and Dark; High contrast and forced-colors adaptations may strengthen text and scrims
- Keep Story 6 text selectable and preserve the accessible HRA-token-based `::selection` treatment
- Disable Story 6 custom selection colors in forced-colors mode so the operating system controls the selected-text palette
- Keep display formatting in the HTML or presenting component rather than caching formatted strings in JavaScript state
- Prefer semantic headings, lists, buttons, and links over recreating their behavior with generic elements and ARIA
- Preserve keyboard operation, visible focus states, native Menu disclosure state, and `aria-current="page"`
- Keep the shared Menu markup in `../../story6.html` and load `shared/js/main.js`; do not duplicate its disclosure, appearance, or contrast behavior in Story 6 JavaScript
- Keep external links opened in a new tab paired with `rel="noopener noreferrer"`
- Do not embed, import, preload, or construct the Cell Distance Explorer web component in Story 6 because its runtime and dataset parsing block tutorial scrolling
- End the native-sticky CDE tutorial after its fifth screenshot and proceed into Transition 4 and the static CDE comparison without a launch control or interactive explorer state
- Keep tutorial images on the shared `1320 / 760` stage with an `82.5rem` maximum width
- Keep CDE tutorial callouts as semantic ordered-list items using the `.tutorial-callout` component and decorative `../../shared/assets/icons/info.svg` icon
- Keep tutorial callouts horizontally centered; place narrow-screen callouts below the scaled tutorial image
- Use a brief crossfade only between tutorial screenshots 1 and 2; switch every later screenshot directly at its step boundary
- Animate tutorial callouts with restrained opacity and transform changes, and keep their complete text visible in the reduced-motion layout
- Do not introduce large CSV datasets unless a demonstrated feature requires them and their ownership is documented
- Keep the splash visually editorial rather than application-like: preserve its asymmetric placement, restrained paper surface, compact accent rule, and clear title-first hierarchy
- Keep the splash background visible around the title card and avoid adding partner marks to the title card unless the user explicitly requests them
- Preserve the splash title, subtitle, credits, background crop, and opening-question transition as separate responsibilities so visual refinements do not alter narrative content or scroll behavior
- Keep closing resources as a semantic card list with eyebrow, title, and description; keep contributor acknowledgments in a separate section rather than mixing credits into resource cards

## Scrolling and animation

- Preserve native browser scrolling and do not introduce scroll hijacking or a smoothing dependency
- Use the shared `pinnedScrollScrub` value for animated pinned scenes on fine-pointer devices so transitions respond consistently; use direct scrubbing on coarse-pointer devices so touch scrolling does not retain a catch-up tween
- Keep every scroll-driven scene (the splash header, `.section2`, `.section3`, and Transitions 1 through 5 including the conclusion) on an intrinsic native-sticky stage for coarse-pointer devices, resolved through the single `createResponsiveSceneTrigger` helper in `animations.js`; scrub each timeline against its own section's scroll range instead of a fixed ScrollTrigger pin. Mixing a JS-driven pin on one scene with native-sticky on an adjacent one desynced ScrollTrigger's cached geometry on upward and fast mobile scroll, so keep every scene on the same mechanism rather than reintroducing `pin: true` for any of them. `.section2`/`.section3` reuse their existing `.fadeimage`/`.scene5-1` inner wrapper as the sticky stage; the splash header is wrapped in a new `.page-header-scene` div (a no-op on fine-pointer devices) because `.page-header` carries its own grid and pseudo-element CSS that would otherwise need duplicating onto a new inner element
- Keep the native-sticky CDE tutorial mapped directly to scroll position with `scrub: true`; do not add smoothing that can let its timeline lag behind the sticky scene
- Prefer compositor-friendly `transform` and `opacity` animation over layout-triggering properties
- Use `createTextboxTransition` and `addTextboxChoreography` for transition headings rather than duplicating timelines
- Present transition headings as an editorial left-aligned column over a section-level contrast scrim; do not reintroduce floating bubbles, borders, or card shadows
- Keep all five non-splash transition background images static; reserve transition motion for the scrim, heading, and emphasis underline
- Keep each transition question or section-introducing statement in its semantic heading; keep the final conclusion as a paragraph under the explicit Conclusion heading and wrap only the emphasized phrase in `.transition-emphasis`; never construct or rewrite accessible text character by character
- Limit each transition to one emphasized phrase and animate its underline once after the heading entrance; do not use color alone to communicate emphasis
- Keep transition questions left-aligned and maintain the narrower opening-question treatment
- In reduced-motion and animation-failure states, expose the complete heading with its underline already drawn
- Recalculate ScrollTrigger geometry after assets load and retain the mobile-resize protection
- `--story-viewport-height` (set in `layout.js`) is always the exact measured `window.innerHeight`, with no added margin, and updates only on load and once a genuine width-change resize (orientation) settles — never reactively on scroll, and never from a live `svh`/`lvh`/`dvh` CSS unit
    - Do not derive this value from a live viewport-height CSS unit, even indirectly, and do not update it on every scroll settle. Both were tried and both failed differently: a live unit (including `lvh`/`svh`, which per spec should be static but are not on Firefox mobile in practice) changes an element's rendered size continuously through an in-progress scroll gesture, which is most visible right at the splash, where the reader's first scroll is typically also the first moment the toolbar starts retracting — the whole header visibly grows while GSAP is simultaneously animating scroll-driven transforms inside it. Updating reactively on scroll settle instead leaves the value stale for the entire duration of an active scroll (undersized relative to the real, currently-retracted toolbar), which leaves a visible gap under sticky content and shrinks a scene's effective scroll distance enough that a fast flick can blow through an entire reveal in too few frames to render
    - Use this bare token directly for every inner sticky stage that actually renders on screen (`.page-header` itself, `.fadeimage`, `.scene5-1`, `.transition__stage`, `.cde-tutorial-stage`). These boxes must equal the true viewport exactly: a stage taller than the real viewport still gets its content centered or end-aligned within its own box, which pushes that content visibly below where the true viewport ends — first tried by adding a flat safety margin directly into `--story-viewport-height`, which fixed scroll-distance undershoot but pushed every sticky stage's content downward by roughly half the margin (centered content) or off-screen entirely (end-aligned content, e.g. the splash title-card), because the margin leaked into a value that is also read as a literal rendered box height
    - Use `calc((var(--story-viewport-height) * N) + var(--story-scroll-safety-margin))` for a scene's outer ScrollTrigger-measured scroll-distance box (`.page-header-scene`, `.section2`, `.section3`, `section.transition`, `section.section5`) instead. `--story-scroll-safety-margin` (declared in `base.css`, `0px` by default and `150px` under `(hover: none) and (pointer: coarse)`) is what actually solves the gap this scroll distance exists to prevent: it makes the one-time-measured scroll distance generously larger than the true viewport even once the toolbar fully retracts, so it never needs to grow reactively. Overshooting only crops slightly off-screen on an `overflow: hidden` stage, which is invisible; only undershooting is visible, so err generous rather than precise. Keep this margin a flat, unscaled addend (added once, not multiplied by the scene's own viewport-height multiplier) since toolbar retraction is a fixed pixel amount regardless of how long the scene's scroll range is
- Every sticky stage (`.page-header`, `.fadeimage`, `.scene5-1`, `.transition__stage`, `.cde-tutorial-stage`) carries `will-change: transform`. This is a mitigation for a documented Firefox/Android engine issue, not a confirmed fix: `position: sticky`'s async (compositor-thread) scroll path can fall out of sync with the main thread specifically when a `position: fixed` element is also present on the page — which the shared site menu always is — making the sticky element visually lag behind the true scroll position. `will-change: transform` promotes the element to its own compositor layer, which several Mozilla bug reports cite as reducing this class of lag. If reported lag persists after this, the next step is live remote debugging (Chrome `chrome://inspect` or Safari Web Inspector over USB) rather than another speculative CSS or JS change — this symptom has already survived several code-only attempts
- Limit the enhanced one-viewport height and clipping rule to `.section2`, `.section3`, and `.transition` on fine-pointer devices; never apply it to every `.story-scene`, because the flowing tissue comparison and six-viewport CDE tutorial own different geometry. On coarse-pointer devices each scene's outer element instead gets a taller `calc(var(--story-viewport-height) * N)` height (matching its original pinned scroll distance) with `overflow: visible`, so its inner sticky stage has room to scroll past
- Do not add a ScrollTrigger refresh in response to image loading unless a specific element's layout box genuinely depends on the image's own dimensions; a refresh queued during an async load only fires whenever scrolling next settles, which during continuous fast scrolling can be far downstream and will reset whatever scene the reader has since reached. Prefer reserving layout space with CSS (`aspect-ratio`, absolutely-positioned layers, explicit `width`/`height`) so no refresh is needed at all
- Assign every scene's ScrollTrigger a descending `refreshPriority` in document order (handled automatically inside `createScrubbedTrigger`); GSAP recommends this for pages with several sequential pinned or scrubbed scenes so each pin-spacer's height is added to downstream scenes' start/end values before they refresh, not after
- `html.story6-loading` sets `overflow: hidden` (`base.css`) so the reader cannot scroll while the opaque loading overlay is up. Triggers are created against whatever layout exists at that moment, including flowing, non-`.story-scene` content like `.intro`, whose height depends on font metrics and can still shift once web fonts finish loading; the settled-fonts refresh corrects that afterward. Without the scroll lock, a fast scroll during that window can reach a scene before the correction lands, so its scrub timeline is driven by a stale start/end and visibly snaps to the corrected position the moment the refresh fires — reproducible on every reload by scrolling immediately, and absent once the page has settled. The overlay's own `pointer-events: auto` only blocks clicks, not scrolling, so it does not prevent this on its own
- Enable pinned animation only while `prefers-reduced-motion` is `no-preference` and the viewport is at least `36rem` high; follow live preference and viewport changes by reverting timelines and restoring the linear layout
- Any new motion must have a `prefers-reduced-motion` state that exposes the same narrative and controls without pinning or animation
- Never leave meaningful content hidden when GSAP, ScrollTrigger, or IntersectionObserver is unavailable
- Animate semantic transition text with `opacity` and transforms, never `autoAlpha` or `visibility`, so it remains in the accessibility tree
- After changing section height or removing content near pinned scenes, verify ScrollTrigger refresh behavior and scroll through the full story at both slow and fast speeds

## Reader View

- Treat Firefox Reader View as a supported Story 6 presentation and preserve `article-content` and `article-header` extraction hints alongside semantic HTML
- Keep all narrative copy, transition sentences, and the explicit Conclusion heading and paragraph inside the primary article source order; runtime end matter may be omitted from Reader View
- Keep transition backgrounds, layered mouse anatomy, tutorial screenshots, overlays, and interface accents decorative with empty alternatives and `aria-hidden="true"`
- Keep `.mouse-reader-overview` in the HTML without `aria-hidden`; Story 6 CSS hides it during the enhanced mouse animation while Reader View and the linear fallback expose it
- Keep the CDE tutorial instructions as an ordered list containing the complete text equivalent of its screenshots
- Do not hide Reader View fallback content with the HTML `hidden` attribute, inline styles, or `aria-hidden`; browser Reader View removes page styling but may preserve those states
- Preserve the current compact image `width` and `height` attributes as a deliberate Reader View sizing exception; keep every pair proportional to its source asset and verify normal-page layout stability
- After structural or narrative changes, verify the Firefox Reader View output from the title through the conclusion, checking for missing, duplicated, or out-of-order narrative content

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

- Give new flowing narrative images source-pixel `width` and `height` attributes by default; preserve Story 6's documented compact Reader View dimensions while keeping their aspect ratios accurate so late loading cannot shift downstream ScrollTrigger geometry
- Keep the full-resolution tissue, mouse, cell-card, tutorial, and splash masters alongside their generated responsive candidates; update every related `src`, `srcset`, `data-src`, and `data-srcset` together
- Keep meaningful tissue maps as native lazy-loaded `src` images so no-JavaScript and Reader View users receive them; stage only decorative mouse layers and tutorial screenshots with `data-src`, activate each nearby narrative group together, and decode its images sequentially from `js/media.js`
- Prepare image groups by narrative proximity rather than changing every below-fold image to eager loading at startup
- Keep the 960, 1920, and 3840 WebP transition variants together and update the complete `srcset` and fallback `src` when renaming one
- Use the 1920 WebP as each transition image's fallback `src`; do not retain a duplicate PNG fallback
- Load Transition 3 eagerly at high priority so rapid scrolling cannot outrun its request; keep all other non-splash transition backgrounds lazy
- Prepare and decode Transition 5 from the histogram comparison so its lazy artwork is ready before the native-sticky conclusion begins
- Preserve transparent backgrounds when optimizing transition images
- On coarse pointers, `.body-outline` renders at 90% height instead of 100% (`narrative.css`) because at full height this figure's outstretched hands are wider than a typical phone screen and get cropped by `.section2`'s overflow; this value is a measured estimate (hands span roughly 79% of the source image's width), not an exact fit, so re-check it visually against both `2-bodyintro1.webp` and `2-bodyintro2.webp` if either is replaced
- Use the 960 px transition settings below when regenerating that variant

```bash
cwebp -q 82 -alpha_q 90 -m 6 -mt -resize 960 540 story/6/img/transition-N-1920.webp -o story/6/img/transition-N-960.webp
```

- Run the command from the repository root and do not install `cwebp` or any other tool without explicit approval
- Regenerate responsive PNG candidates with `node tools/generate-story6-images.mjs`; the tool uses only Node built-ins and preserves RGB/RGBA transparency and source color metadata
- Regenerate the responsive splash with `node tools/generate-story6-splash.mjs --browser=/path/to/chromium`; use an existing Chromium-compatible browser and do not install one for this task without approval

## Validation

Run the dependency-free checks from the repository root after JavaScript or path changes:

```bash
for js_file in story/6/story6.js story/6/js/*.js; do node --check "$js_file" || exit 1; done
npx --no-install eslint story/6/story6.js story/6/js/*.js --no-config-lookup --rule 'no-unused-vars:error' --rule 'no-unreachable:error' --rule 'no-dupe-keys:error'
node tools/check-story6.mjs
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
- On desktop with a mouse, scroll slowly and quickly through every pinned scene and confirm animations follow without jumps
- On an actual mobile browser (not desktop device emulation), scroll through the entire story at a normal pace, then again with fast flick scrolling, paying particular attention to the boundary right after the intro body text and right after the mouse-organ sequence; confirm every sticky stage fills the full device height with no gap beneath it as the browser's toolbar retracts, and that fast flicking never skips a transition heading's reveal entirely
- On an actual mobile browser, scroll continuously and quickly through several scenes in a row, then stop to read partway through a later scene; confirm that scene does not reset or replay once you stop
- On an actual mobile browser, scroll both forward and backward through the entire story, especially reversing direction mid-scene and across scene boundaries; confirm nothing desyncs, jumps, or offsets
- Resize desktop width and height continuously, then confirm pinned scenes settle into the correct layout without overlapping or retaining stale measurements
- Open the story menu by pointer and keyboard, then close it with its button, `Escape`, and an outside click
- Confirm the menu stays inside the viewport and identifies Story 6 as the current page
- Reload at several story positions and confirm Story 6 restarts at the top before pinned scenes initialize
- Enable reduced motion and confirm all narrative text and tutorial instructions remain available
- Change reduced motion while the page is open and resize below and above `36rem` in height; confirm pins are removed and restored without stale spacing or hidden content
- Confirm Story 6 does not request the CDE web component bundle or stylesheet
- Confirm all requested local image, font, script, and stylesheet resources return successfully
- Select text with a mouse and with mobile long-press, then confirm the selection colors remain readable on light and dark Story 6 surfaces
- Confirm the tissue comparison is centered, its text remains left-aligned, and all nine samples are reachable without horizontal scrolling
- Confirm the Cell Distance Explorer tutorial retains an accessible section name when visible introductory copy is intentionally absent
- Open Firefox Reader View and confirm the title, all five transition sentences, compact mouse overview, tissue comparison, ordered CDE instructions, CDE comparison, and Conclusion heading and paragraph appear once in source order
