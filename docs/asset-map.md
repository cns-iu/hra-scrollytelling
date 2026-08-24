# Asset Map

This inventory records current ownership boundaries and known reference problems. It is a migration aid, not an
orphan-file deletion list: some animation and generated-application paths may be constructed at runtime.

## Current asset areas

| Location | Current role | Migration status |
| --- | --- | --- |
| `landing/assets/backgrounds/` | Light and Dark decorative splash artwork | Organized; landing page only |
| `landing/assets/hero.png` | Previous single-theme hero artwork | Retained during redesign review; currently unreferenced |
| `landing/assets/social-preview.png` | Canonical link-preview artwork | Organized; landing page only |
| `landing/css/fonts.css` | Compatibility bridge for the former landing font URL | Retain while cached documents may request the old path |
| `shared/assets/fonts/` | HRA WOFF2 files and their original licenses | Consolidated; shared by the landing page, maintained page chrome, and Story 6 |
| `shared/assets/icons/` | Shared interface icons and retained organ icon assets | Menu glyph shared by maintained pages; Story 6 info icon and organ inventory relocated from the former root `assets/` directory |
| `shared/assets/logos/` | Light- and dark-surface HRA, CNS, and SenNet organization marks | Shared by the canonical footer and Story 6 resource cards |
| `shared/assets/music/` | Shared story and prototype audio | Consolidated from the former root `music/` directory; `Piano.mp3` is used by Scrollytelling Effects, while maintained-story references to `dramatic.swf.mp3` remain commented out |
| `shared/` | Namespaced page-chrome fonts, styles, and progressive-enhancement modules for maintained public pages | Menu and footer adopted by the landing page and all six stories |
| `prototypes/` | Organized legacy prototype implementations and maintenance notes | Scrollytelling Effects, Organ Example, and Visualizing Cells organized; published entry URLs retained |
| `img/` | Shared story media, story-specific sequences, legacy UI assets, fonts, and prototypes | Unsorted legacy area |
| `img/TestSeq/` | Image sequence used by a legacy story or prototype | Ownership must be verified |
| `img/UI Assets/` | Legacy shared interface images and font files | Shared paths contain spaces; do not rename broadly |
| `story6/img/` | Story 6 narrative artwork and responsive transition images | Story-owned; visible source credits are maintained in `story6.html` |
| `stories/story4/config/` | Story 4 particle configuration reference | Organized; runtime currently uses the equivalent inline configuration |
| `Game/` | Generated game images, icons, scripts, manifest, and offline files | Isolated; do not reorganize |

At the time of this inventory, `img/` contains 211 tracked content files and is the largest working-tree asset area. The
repository also contains large video, model, sprite-sheet, and embedded-data files. File size alone is not evidence
that an asset is unused.

## Known unresolved references

These references existed before repository organization began:

| Source | Reference | Status |
| --- | --- | --- |
| `prototypes/scrollytelling-effects/index.html` | `../../img/char1.png` | Missing; referenced twice by prototype markup |
| `style.css` | `img/ASCT-2.svg` | Missing; associated story rule appears stale and requires visual verification |
| `style.css` | `img/ASCT-3.svg` | Missing; associated story rule appears stale and requires visual verification |

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
| `story6/img/cell-senescence-transition.webp` | National Institute on Aging, “Does Cellular Senescence Hold Secrets for Healthier Aging?” | Source is credited beside the image and in the references |
| `story6/img/cell-changes.webp` | Chengying Xu, Zhimei Qiu, Qing Guo, Youyang Huang, Yongchao Zhao, and Ranzun Zhao, “The Role of Cellular Senescence in Cardiovascular Disease,” Figure 1 | CC BY 4.0; reformatted as WebP; source and license are linked beside the image |
| `story6/img/cells.png` | Cropped derivative of the previously used Adobe Stock immune-cell collection | The stock-origin footer was removed from the visible crop; retain the corresponding license record outside the repository |

## Story migration register

| Area | Status | Notes |
| --- | --- | --- |
| Landing page | Organized | Owned by `index.html`, `landing/`, shared HRA fonts, and shared page chrome |
| Story 1 | Page chrome and accessibility behavior adopted | Uses the navigation-only shared Menu, shared story navigation, and fixed-Dark shared footer; `stories/story1/` owns Story 1 presentation and motion behavior |
| Story 2 | Page chrome adopted | Uses the navigation-only shared Menu and fixed-Dark shared footer; `stories/story2/` is reserved for future story-owned files |
| Story 3 | Page chrome adopted | Uses the navigation-only shared Menu and fixed-Dark shared footer; `stories/story3/` is reserved and embedded data remains deferred |
| Story 4 | Page chrome and config adopted | Uses the navigation-only shared Menu and fixed-Dark shared footer; particle JSON ownership is established and embedded data remains deferred |
| Story 5 | Page chrome adopted | Uses the navigation-only shared Menu and fixed-Dark shared footer; `stories/story5/` is reserved for future story-owned files |
| Story 6 | Page chrome and shared assets adopted | Uses the appearance-enabled shared Menu, theme-aware shared footer, consolidated fonts, logos, and interface icons; narrative implementation remains under `story6/` |
| Prototypes | Partially organized | Scrollytelling Effects, Organ Example, and Visualizing Cells implementations moved under `prototypes/`; compatibility pages preserve published URLs; `img/test.html` remains in place |
| Generated game | Excluded | Keep `Game/` intact |

## Naming rules for future migrations

- Prefer lowercase, hyphen-separated filenames for newly organized assets.
- Do not rename an existing asset solely to enforce naming consistency.
- Keep file extensions accurate and preserve case-sensitive paths.
- Place story-exclusive assets under that story's directory.
- Place an asset under `stories/shared/` only when at least two maintained stories consume it.
- Place page-chrome code under `shared/` only when it serves the landing page and at least one maintained story.
- Record provenance or licensing information alongside assets when it is known.
