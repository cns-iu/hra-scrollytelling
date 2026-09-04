# Asset Map

This inventory records current ownership boundaries and known reference problems. It is a migration aid, not an
orphan-file deletion list: some animation paths may be constructed at runtime.

## Current asset areas

| Location | Current role | Migration status |
| --- | --- | --- |
| `landing/assets/backgrounds/` | Light and Dark decorative splash artwork | Organized; landing page only |
| `landing/assets/hero.png` | Previous single-theme hero artwork | Retained during redesign review; currently unreferenced |
| `landing/assets/social-preview.png` | Canonical link-preview artwork | Organized; landing page only |
| `landing/css/fonts.css` | Compatibility bridge for the former landing font URL | Retain while cached documents may request the old path |
| `shared/assets/fonts/` | HRA WOFF2 files and their original licenses | Consolidated; shared by the landing page, maintained page chrome, and Story 6 |
| `shared/assets/icons/` | Shared interface icons, cross-device favicon set, and retained organ icon assets | Every HTML entry point declares the HRA brandmark SVG, multi-size ICO fallback, and 180-pixel Apple touch icon; Menu glyph, Story 6 info icon, and organ inventory also live here |
| `shared/assets/images/` | Images shared across maintained stories and prototypes | Organized; contains three GIFs shared by Story 1 and Scrollytelling Effects, body-intro layers and telescope shared by Stories 2, 3, and 5, and the retained external-link arrow still used by Story 2's quiz |
| `shared/assets/logos/` | HRA, CNS, and retained SenNet organization marks | HRA and CNS marks are shared by the landing hero and canonical footer; SenNet marks are retained but currently unreferenced after the resource-card migration |
| `shared/assets/music/` | Shared story and prototype audio | Consolidated from the former root `music/` directory; `Piano.mp3` is used by Scrollytelling Effects, while maintained-story references to `dramatic.swf.mp3` remain commented out |
| `shared/assets/videos/` | Video shared by Story 1 and Scrollytelling Effects | Organized; contains the shared `image4.mp4` asset |
| `shared/` | Namespaced page chrome plus assets confirmed across maintained and prototype experiences | Menu and footer adopted by the landing page and all six stories; cross-experience media separated by type |
| `prototypes/` | Organized legacy prototype implementations, owned assets, and maintenance notes | Scrollytelling Effects, Organ Example, Visualizing Cells, and Drag-and-Drop Answer Demo organized; compatibility pages preserve published URLs |
| `prototypes/drag-and-drop/` | Drag-and-drop answer demo and its SVG artwork | Organized; `index.html` is the canonical implementation |
| `prototypes/organ-example/images/` | Organ Example artwork | Organized; prototype only |
| `prototypes/organ-example/styles.css` | Organ Example page, table, and illustration presentation | Organized; scoped to the prototype and independent of the former root `style.css` |
| `prototypes/scrollytelling-effects/images/` | Scrollytelling Effects artwork and backgrounds | Organized; prototype only |
| `prototypes/scrollytelling-effects/models/` | Scrollytelling Effects 3D brain model | Organized; prototype only |
| `prototypes/scrollytelling-effects/styles.css` | Scrollytelling Effects page and demonstration presentation | Organized; scoped to the prototype and independent of the former root `style.css` |
| `prototypes/scrollytelling-effects/effects.css` | Scrollytelling Effects interactive layouts and reveal animations | Organized; scoped to the prototype and independent of the former root `style.css` |
| `prototypes/scrollytelling-effects/navigation.css` | Scrollytelling Effects right-side table of contents and content framing | Organized; prototype only |
| `prototypes/shared/chrome.css` | Minimal layout adjustments shared by organized prototypes | Used by Organ Example and Visualizing Cells alongside shared page chrome |
| `prototypes/shared/typography.css` | Shared prototype typography contract | Nunito Sans default across all prototype entry points; prototype-owned rules may specify Metropolis |
| `prototypes/visualizing-cells/images/` | Visualizing Cells artwork | Organized; prototype only |
| `prototypes/visualizing-cells/styles.css` | Visualizing Cells page, video, and illustration presentation | Organized; scoped to the prototype and independent of the former root `style.css` |
| `prototypes/visualizing-cells/videos/` | Visualizing Cells background video | Organized; prototype only |
| `prototypes/scrollytelling-effects/wc.js` | Bundled CCF Organ Info web component | Organized; Scrollytelling Effects prototype only |
| `story/1/images/` | Story 1-owned narrative images | Organized; contains the HRA macro-to-micro scale overview used only by Story 1 |
| `story/1/video/` | Story 1-owned video backgrounds | Organized; contains two WebM files and one MP4 |
| `shared/css/narrative-foundation.css` | Page typography, narrative scenes, intro characters, and layered-image foundations shared by Stories 2, 3, and 5 | Organized; owns the remaining shared page foundation and applies the shared Nunito Sans body stack |
| `shared/css/narrative-accessibility.css` | Flowing layout and motion-preference overrides shared by Stories 2, 3, and 5 | Organized; loaded last by each consumer to preserve readable source order at reduced motion, narrow widths, and high zoom |
| `shared/css/character-dialogue.css` | Cece, Squiggy, Mac, and neutral dialogue presentation shared by Stories 2, 3, and 5 | Organized; common bubble geometry is consolidated while story-specific positioning variants are preserved |
| `shared/css/story-end-matter.css` | Resources, Acknowledgments, and References presentation shared by all maintained stories | Organized; uses shared page-chrome tokens, centered headings, intrinsic section heights, and responsive resource cards without thumbnails |
| `shared/css/appearance-controls.css` | Optional appearance fieldset and High contrast switch presentation | Organized; used only by the landing page and Story 6, while core Menu presentation remains in `navigation.css` |
| `shared/js/narrative-motion.js` | Progressive-enhancement motion gate shared by Stories 2, 3, and 5 | Organized; enables pinned animation only when user preferences and viewport geometry support it |
| `shared/css/story-navigation.css` | Two-link end-of-story navigation shared by all six maintained stories | Organized; Stories 2–5 link backward and forward, while Stories 1 and 6 use Home at the sequence boundaries |
| `story/1/end-matter.json` through `story/5/end-matter.json`, `story/6/end-matter.json` | Per-story Resources and optional Acknowledgments and References content | Organized; each JSON file is the only content source consumed by its story's runtime placeholder |
| `shared/js/story-end-matter.js`, `shared/js/story-end-matter-schema.mjs` | Shared end-matter rendering and content validation | Organized; dependency-free runtime creates semantic sections from each story-owned JSON source |
| `story/2/css/styles.css` | Story 2 scene, video, and legacy quiz presentation | Organized; owns scoped Story 2 quiz color tokens, and its final section uses intrinsic height so shared story navigation and footer remain visible |
| `story/2/images/` | Story 2-owned narrative and quiz images | Organized; contains character scenes, ASCT+B Reporter artwork, and quiz icons; obsolete resource thumbnails were removed after the shared card migration |
| `story/3/css/styles.css` | Story 3 scene and embedded-artwork presentation | Organized; Story 3 uses the shared narrative page foundation |
| `story/3/images/` | Story 3-owned narrative images | Organized; contains character scenes, collision-state artwork, and kidney variations; obsolete resource thumbnails were removed after the shared card migration |
| `story/4/` | Story 4 presentation, accessibility fallback, motion gate, particle runtime, initializer, and focused animation modules | Organized; independent of the former root `style.css` and used only by Story 4; unused Bootstrap, ScrollMagic, and MotionPath integrations were removed |
| `story/4/images/` | Story 4 narrative artwork | Organized; obsolete resource thumbnails were removed after the shared card migration |
| `story/5/css/styles.css` | Story 5 scene, animation, and media-control presentation | Organized; Story 5 uses the shared narrative page foundation |
| `story/5/images/` | Story 5 scene backgrounds, narrative illustrations, and controls | Organized; obsolete resource thumbnails were removed after the shared card migration |
| `story/5/video/` | Story 5 narrative videos | Organized; contains six MOV files used only by Story 5 |
| `tools/check-maintained-pages.mjs` | Dependency-free maintained-page structure and accessibility contract checker | Organized; validates all seven public entry points and freezes the known embedded-SVG duplicate-ID baselines |
| `story/6/images/` | Story 6 narrative artwork plus responsive splash, transition, tissue, mouse, cell-card, tutorial, and CDE comparison variants | Story-owned under the singular story path; visible source credits are maintained in `story/6/index.html`; dependency-free generation tools live under `tools/` |

The former root `js/` directory was removed after its consumed Story 4 and prototype files were organized. Its five
remaining files were unconsumed: two standalone legacy scripts and three redundant fragments already embedded in the
prototype's `wc.js` bundle.

After the repository-wide unused-asset audit and ownership migrations, the former root `img/` directory was removed.
The drag-and-drop answer demo and its owned assets now live together under `prototypes/drag-and-drop/`.
The audit removed 85 files with no HTML, CSS, JavaScript, JSON, manifest, inline SVG, or dynamically constructed path
consumer, including the orphaned `TestSeq/` image sequence. Story 3 then moved 23 confirmed story-specific assets to
its owned image directory, Story 4 moved three exclusive resource thumbnails, and Story 5 moved 23 exclusive image
assets. The remaining consumed assets were organized under the landing page, their owning story or prototype, or a
shared directory selected according to actual consumers. File size alone is not evidence that an asset is unused.

## Font consolidation

Metropolis is consolidated under `shared/assets/fonts/metropolis/`. Stories 1–5 and all four prototype entry points
load the approved self-hosted declarations from `shared/css/fonts.css`; prototypes use Nunito Sans for body text and
may use Metropolis where specified through prototype-owned rules. The default is applied through
`prototypes/shared/typography.css`. The former root OTF and its legacy `style.css` declaration were removed. The
generated Scrollytelling Effects web-component bundle retains its encapsulated internal typography.

## Known unresolved references

These references existed before repository organization began:

| Source | Reference | Status |
| --- | --- | --- |
| `prototypes/scrollytelling-effects/index.html` | `images/char1.png` | Missing; referenced twice by prototype markup |

The reference checker treats these as a documented baseline when run with `--allow-known`. Strict mode continues to
fail until they are repaired or intentionally removed:

```bash
node tools/check-local-links.mjs
node tools/check-local-links.mjs --allow-known
```

Remove the corresponding baseline entry from `tools/check-local-links.mjs` whenever a reference is resolved.

## Story 6 image provenance

| Asset | Source | Notes |
| --- | --- | --- |
| `story/6/images/cell-senescence-transition.webp` | National Institute on Aging, “Does Cellular Senescence Hold Secrets for Healthier Aging?” | Source is credited beside the image and in the references |
| `story/6/images/cell-changes.webp` | Chengying Xu, Zhimei Qiu, Qing Guo, Youyang Huang, Yongchao Zhao, and Ranzun Zhao, “The Role of Cellular Senescence in Cardiovascular Disease,” Figure 1 | CC BY 4.0; reformatted as WebP; source and license are linked beside the image |
| `story/6/images/cells.png` and `cells-{640,1280}.png` | Cropped derivative of the previously used Adobe Stock immune-cell collection | The stock-origin footer was removed from the visible crop; retain the corresponding license record outside the repository; responsive files are generated derivatives |
| `story/6/images/*-{320,640,660,1280,1320}.png` | Corresponding full-resolution tissue, mouse, or tutorial PNG in the same directory | Generated responsive derivatives; regenerate with `node tools/generate-story6-images.mjs` |
| `story/6/images/splash-bg-{960,1920}.webp` | `story/6/images/splash-bg.webp` | Generated responsive derivatives; regenerate with `node tools/generate-story6-splash.mjs --browser=/path/to/chromium` using an existing Chromium-compatible browser |
| `story/6/images/transition4-{960,1920,3840}.webp` | Post-tutorial CDE comparison transition artwork | Active responsive source set used between the tutorial and comparison section |
| `story/6/images/{2m,24m}-cell-distance-vis-{560,800}.png` | Supplied young- and aged-mouse cell-network visualizations | Responsive PNG candidates used by the CDE comparison |
| `story/6/images/{2m,24m}-{violin,histogram}-*.svg` | Supplied young- and aged-mouse comparison plots | Responsive SVG variants; each embeds the shared Nunito Sans font so browser image rendering retains the approved typography |

The unused `CDE-Placeholder.png`, duplicate `cells.webp`, and four unconsumed CDE CSV datasets were removed after
repository-wide reference checks.

## Story migration register

| Area | Status | Notes |
| --- | --- | --- |
| Landing page | Organized | Owned by `index.html`, `landing/`, shared HRA fonts, and shared page chrome |
| Story 1 | Organized | Independent of the former root `style.css`; uses runtime shared end matter, the navigation-only shared Menu, shared story navigation, and fixed-Dark shared footer; `story/1/` owns Story 1 presentation, motion behavior, image, videos, and end-matter content; animated media shared with a prototype is under `shared/assets/` |
| Story 2 | Presentation, runtime, and images organized | Uses the shared semantic narrative and flowing accessibility foundations, character-dialogue system, runtime end matter, two-link story navigation, navigation-only shared Menu, and fixed-Dark shared footer; `story/2/` owns its story-specific presentation, animation runtime, quiz tokens, end-matter content, and confirmed story-specific images; its embedded SVG labels retain one Inter request |
| Story 3 | Presentation, runtime, and images organized | Uses the shared semantic narrative and flowing accessibility foundations, character-dialogue system, runtime end matter, two-link story navigation, navigation-only shared Menu, and fixed-Dark shared footer; `story/3/` owns its split general and RUI animation modules, story-specific presentation, end-matter content, and confirmed images, while cross-story artwork is under `shared/assets/images/`; 18 pre-existing repeated ID values remain deferred with its embedded SVG data |
| Story 4 | Presentation and runtime organized | Independent of the former root `style.css`; uses a readable static default, a guarded enhanced layout, an ambient-animation control, runtime end matter, shared two-link story navigation, navigation-only shared Menu, and fixed-Dark shared footer; `story/4/` owns its presentation, particle scripts, focused animation modules, JSON configuration, and end-matter content; 47 pre-existing duplicated ID values remain deferred with its embedded SVG data |
| Story 5 | Presentation, runtime, and media organized | Uses the shared semantic narrative and flowing accessibility foundations, character-dialogue system, runtime end matter, two-link story navigation, navigation-only shared Menu, and fixed-Dark shared footer; reduced-motion and narrow layouts expose native video controls, while enhanced layouts provide visible play/pause controls; `story/5/` owns its story-specific animation and media-control modules, presentation, accessibility stylesheet, end-matter content, confirmed story-specific images, and videos |
| Story 6 | Organized | Independent of the former root `style.css`; `story/6/` owns the narrative implementation, generated responsive artwork, end-matter content, and Story 6 contributor instructions; the page uses shared runtime end matter, two-link story navigation with Home in the next slot, the appearance-enabled shared Menu, theme-aware shared footer, consolidated fonts, logos, and interface icons |
| Prototypes | Implementations, media, and page chrome organized | All four prototype implementations own their files under `prototypes/` and are independent of the former root `style.css`; Scrollytelling Effects, Organ Example, and Visualizing Cells use the navigation-only shared Menu with a fixed-Dark shared footer; compatibility pages preserve published URLs |

## Naming rules for future migrations

- Prefer lowercase, hyphen-separated filenames for newly organized assets.
- Do not rename an existing asset solely to enforce naming consistency.
- Keep file extensions accurate and preserve case-sensitive paths.
- Place story-exclusive assets under that story's directory.
- Place an image under `shared/assets/images/` when multiple maintained stories or a maintained story and prototype consume it.
- Place page-chrome code under `shared/` only when it serves the landing page and at least one maintained story.
- Record provenance or licensing information alongside assets when it is known.
