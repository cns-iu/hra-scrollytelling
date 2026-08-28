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
| `shared/assets/images/` | Images shared across maintained stories and prototypes | Organized; contains three GIFs shared by Story 1 and Scrollytelling Effects, body-intro layers and telescope shared by Stories 2, 3, and 5, and the external-link arrow shared by Stories 1–5 |
| `shared/assets/logos/` | Consumed HRA, CNS, and SenNet organization marks | Shared by the landing hero, canonical footer, and Story 6 resource cards |
| `shared/assets/music/` | Shared story and prototype audio | Consolidated from the former root `music/` directory; `Piano.mp3` is used by Scrollytelling Effects, while maintained-story references to `dramatic.swf.mp3` remain commented out |
| `shared/assets/videos/` | Video shared by Story 1 and Scrollytelling Effects | Organized; contains the shared `image4.mp4` asset |
| `shared/` | Namespaced page chrome plus assets confirmed across maintained and prototype experiences | Menu and footer adopted by the landing page and all six stories; cross-experience media separated by type |
| `prototypes/` | Organized legacy prototype implementations, owned assets, and maintenance notes | Scrollytelling Effects, Organ Example, Visualizing Cells, and Drag-and-Drop Answer Demo organized; compatibility pages preserve published URLs |
| `prototypes/drag-and-drop/` | Drag-and-drop answer demo and its SVG artwork | Organized; `index.html` is the canonical implementation |
| `prototypes/organ-example/images/` | Organ Example artwork | Organized; prototype only |
| `prototypes/organ-example/styles.css` | Organ Example page, table, and illustration presentation | Organized; scoped to the prototype and independent of root `style.css` |
| `prototypes/scrollytelling-effects/images/` | Scrollytelling Effects artwork and backgrounds | Organized; prototype only |
| `prototypes/scrollytelling-effects/models/` | Scrollytelling Effects 3D brain model | Organized; prototype only |
| `prototypes/scrollytelling-effects/styles.css` | Scrollytelling Effects page and demonstration presentation | Organized; scoped to the prototype and independent of root `style.css` |
| `prototypes/scrollytelling-effects/effects.css` | Scrollytelling Effects interactive layouts and reveal animations | Organized; scoped to the prototype and independent of root `style.css` |
| `prototypes/scrollytelling-effects/navigation.css` | Scrollytelling Effects right-side table of contents and content framing | Organized; prototype only |
| `prototypes/shared/chrome.css` | Minimal layout adjustments shared by organized prototypes | Used by Organ Example and Visualizing Cells alongside shared page chrome |
| `prototypes/shared/typography.css` | Shared prototype typography contract | Nunito Sans default across all prototype entry points; prototype-owned rules may specify Metropolis |
| `prototypes/visualizing-cells/images/` | Visualizing Cells artwork | Organized; prototype only |
| `prototypes/visualizing-cells/styles.css` | Visualizing Cells page, video, and illustration presentation | Organized; scoped to the prototype and independent of root `style.css` |
| `prototypes/visualizing-cells/videos/` | Visualizing Cells background video | Organized; prototype only |
| `prototypes/scrollytelling-effects/wc.js` | Bundled CCF Organ Info web component | Organized; Scrollytelling Effects prototype only |
| `stories/story1/images/` | Story 1-owned narrative images | Organized; contains the HRA macro-to-micro scale overview used only by Story 1 |
| `stories/story1/videos/` | Story 1-owned video backgrounds | Organized; contains two WebM files and one MP4 |
| `shared/css/narrative-foundation.css` | Narrative scene, intro-character, and layered-image foundations shared by Stories 2, 3, and 5 | Organized; loaded before the remaining legacy story stylesheet |
| `shared/css/character-dialogue.css` | Cece, Squiggy, Mac, and neutral dialogue presentation shared by Stories 2, 3, and 5 | Organized; common bubble geometry is consolidated while story-specific positioning variants are preserved |
| `stories/story2/styles.css` | Story 2 scene, video, and legacy quiz presentation | Organized; Story 2 still loads root `style.css` for the remaining legacy base, bottom-navigation, and resource-card rules |
| `stories/story2/images/` | Story 2-owned narrative and quiz images | Organized; contains character scenes, ASCT+B Reporter artwork, quiz icons, and resource thumbnails used only by Story 2 |
| `stories/story3/images/` | Story 3-owned narrative and resource images | Organized; contains character scenes, collision-state artwork, kidney variations, and resource thumbnails used only by Story 3 |
| `stories/story4/` | Story 4 presentation, particle runtime, initializer, Bootstrap starter hook, and configuration | Organized; independent of root `style.css` and used only by Story 4 |
| `stories/story4/images/` | Story 4 resource-card thumbnails | Organized; contains the three external-resource images used only by Story 4 |
| `stories/story5/styles.css` | Story 5 scene, animation, and media-control presentation | Organized; Story 5 still loads root `style.css` for the remaining legacy base, bottom-navigation, and resource-card rules |
| `stories/story5/images/` | Story 5 scene backgrounds, narrative illustrations, controls, and resource thumbnails | Organized; contains 23 image assets used only by Story 5 |
| `stories/story5/videos/` | Story 5 narrative videos | Organized; contains six MOV files used only by Story 5 |
| `stories/story6/img/` | Story 6 narrative artwork plus responsive splash, transition, tissue, mouse, cell-card, and tutorial variants | Story-owned; visible source credits are maintained in `story6.html`; dependency-free generation tools live under `tools/` |

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
| `stories/story6/img/cell-senescence-transition.webp` | National Institute on Aging, “Does Cellular Senescence Hold Secrets for Healthier Aging?” | Source is credited beside the image and in the references |
| `stories/story6/img/cell-changes.webp` | Chengying Xu, Zhimei Qiu, Qing Guo, Youyang Huang, Yongchao Zhao, and Ranzun Zhao, “The Role of Cellular Senescence in Cardiovascular Disease,” Figure 1 | CC BY 4.0; reformatted as WebP; source and license are linked beside the image |
| `stories/story6/img/cells.png` and `cells-{640,1280}.png` | Cropped derivative of the previously used Adobe Stock immune-cell collection | The stock-origin footer was removed from the visible crop; retain the corresponding license record outside the repository; responsive files are generated derivatives |
| `stories/story6/img/*-{320,640,660,1280,1320}.png` | Corresponding full-resolution tissue, mouse, or tutorial PNG in the same directory | Generated responsive derivatives; regenerate with `node tools/generate-story6-images.mjs` |
| `stories/story6/img/splash-bg-{960,1920}.webp` | `stories/story6/img/splash-bg.webp` | Generated responsive derivatives; regenerate with `node tools/generate-story6-splash.mjs --browser=/path/to/chromium` using an existing Chromium-compatible browser |
| `stories/story6/img/transition4-{960,1920,3840}.webp` | Planned post-CDE transition artwork | Reserved responsive source set for the next Story 6 section; intentionally retained before markup integration |

The unused `CDE-Placeholder.png`, duplicate `cells.webp`, and four unconsumed CDE CSV datasets were removed after
repository-wide reference checks.

## Story migration register

| Area | Status | Notes |
| --- | --- | --- |
| Landing page | Organized | Owned by `index.html`, `landing/`, shared HRA fonts, and shared page chrome |
| Story 1 | Organized | Independent of root `style.css`; uses the navigation-only shared Menu, shared story navigation, and fixed-Dark shared footer; `stories/story1/` owns Story 1 presentation, motion behavior, image, and videos; animated media shared with a prototype is under `shared/assets/` |
| Story 2 | Presentation and images organized | Uses the shared narrative foundation and character-dialogue system, navigation-only shared Menu, and fixed-Dark shared footer; `stories/story2/` owns its story-specific presentation, quiz, and confirmed story-specific images; root `style.css` remains loaded only for the legacy base, bottom navigation, and resource cards |
| Story 3 | Images and shared narrative styles organized | Uses the shared narrative foundation and character-dialogue system, navigation-only shared Menu, and fixed-Dark shared footer; `stories/story3/` owns its confirmed story-specific images, while cross-story artwork is under `shared/assets/images/`; embedded data remains deferred |
| Story 4 | Organized | Independent of root `style.css`; uses the navigation-only shared Menu and fixed-Dark shared footer; `stories/story4/` owns its presentation, particle scripts, JSON configuration, and confirmed story-specific resource thumbnails; 47 pre-existing duplicated ID values remain deferred with its embedded SVG data |
| Story 5 | Presentation and media organized | Uses the shared narrative foundation and character-dialogue system, navigation-only shared Menu, and fixed-Dark shared footer; `stories/story5/` owns its story-specific presentation, accessibility stylesheet, confirmed story-specific images, and videos; root `style.css` remains loaded only for the legacy base, bottom navigation, and resource cards |
| Story 6 | Organized | Independent of root `style.css`; `stories/story6/` owns the narrative implementation, generated responsive artwork, and Story 6 contributor instructions; the page uses the appearance-enabled shared Menu, theme-aware shared footer, consolidated fonts, logos, and interface icons |
| Prototypes | Implementations, media, and page chrome organized | All four prototype implementations own their files under `prototypes/` and are independent of root `style.css`; Scrollytelling Effects, Organ Example, and Visualizing Cells use the navigation-only shared Menu with a fixed-Dark shared footer; compatibility pages preserve published URLs |

## Naming rules for future migrations

- Prefer lowercase, hyphen-separated filenames for newly organized assets.
- Do not rename an existing asset solely to enforce naming consistency.
- Keep file extensions accurate and preserve case-sensitive paths.
- Place story-exclusive assets under that story's directory.
- Place an image under `shared/assets/images/` when multiple maintained stories or a maintained story and prototype consume it.
- Place page-chrome code under `shared/` only when it serves the landing page and at least one maintained story.
- Record provenance or licensing information alongside assets when it is known.
