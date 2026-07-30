# Asset Map

This inventory records current ownership boundaries and known reference problems. It is a migration aid, not an
orphan-file deletion list: some animation and generated-application paths may be constructed at runtime.

## Current asset areas

| Location | Current role | Migration status |
| --- | --- | --- |
| `landing/assets/` | Landing-page hero and social-preview artwork | Organized; keep isolated |
| `landing/assets/fonts/` | Landing-page HRA WOFF2 files and their original licenses | Organized; keep isolated |
| `shared/` | Namespaced page-chrome styles and progressive-enhancement modules for maintained public pages | Foundation added; no entry point consumes it yet |
| `img/` | Shared story media, story-specific sequences, legacy UI assets, fonts, and prototypes | Unsorted legacy area |
| `img/TestSeq/` | Image sequence used by a legacy story or prototype | Ownership must be verified |
| `img/UI Assets/` | Legacy shared interface images and font files | Shared paths contain spaces; do not rename broadly |
| `music/` | Story audio | Ownership must be verified story by story |
| `stories/story-4/config/` | Story 4 particle configuration reference | Organized; runtime currently uses the equivalent inline configuration |
| `Game/` | Generated game images, icons, scripts, manifest, and offline files | Isolated; do not reorganize |

At the time of this inventory, `img/` contains 211 tracked content files and is the largest working-tree asset area. The
repository also contains large video, model, sprite-sheet, and embedded-data files. File size alone is not evidence
that an asset is unused.

## Known unresolved references

These references existed before repository organization began:

| Source | Reference | Status |
| --- | --- | --- |
| `story0.html` | `img/char1.png` | Missing; referenced twice by prototype markup |
| `style.css` | `img/ASCT-2.svg` | Missing; associated story rule appears stale and requires visual verification |
| `style.css` | `img/ASCT-3.svg` | Missing; associated story rule appears stale and requires visual verification |

The reference checker treats these as a documented baseline when run with `--allow-known`. Strict mode continues to
fail until they are repaired or intentionally removed:

```bash
node tools/check-local-links.mjs
node tools/check-local-links.mjs --allow-known
```

Remove the corresponding baseline entry from `tools/check-local-links.mjs` whenever a reference is resolved.

## Story migration register

| Area | Status | Notes |
| --- | --- | --- |
| Landing page | Organized | Owned by `index.html` and `landing/` |
| Story 1 | Not started | Recommended first migration because it is comparatively small |
| Story 2 | Not started | Shares global styling, animation libraries, and mixed assets |
| Story 3 | Deferred | Contains large embedded data; avoid broad rewrites |
| Story 4 | Config organized | Particle JSON ownership is established; broader migration remains deferred because the page contains large embedded data |
| Story 5 | Not started | Shares global styling and mixed assets |
| Prototypes | Deferred | Preserve existing paths until their publication status is decided |
| Generated game | Excluded | Keep `Game/` intact |

## Naming rules for future migrations

- Prefer lowercase, hyphen-separated filenames for newly organized assets.
- Do not rename an existing asset solely to enforce naming consistency.
- Keep file extensions accurate and preserve case-sensitive paths.
- Place story-exclusive assets under that story's directory.
- Place an asset under `stories/shared/` only when at least two maintained stories consume it.
- Place page-chrome code under `shared/` only when it serves the landing page and at least one maintained story.
- Record provenance or licensing information alongside assets when it is known.
