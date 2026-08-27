# Legacy Prototypes

This directory contains experiments and superseded experiences that remain publicly available for reference but are
not maintained as part of the primary story collection.

## Current prototypes

| Prototype | Implementation | Compatibility URL |
| --- | --- | --- |
| Scrollytelling Effects | `scrollytelling-effects/index.html` | `story0.html` at the repository root |
| Organ Example | `organ-example/index.html` | `organExample.html` at the repository root |
| Visualizing Cells | `visualizing-cells/index.html` | `VisualizingCells.html` at the repository root |
| Drag-and-drop answer demo | `drag-and-drop/index.html` | — |

The compatibility pages at the repository root preserve previously published GitHub Pages URLs. They forward browsers
with JavaScript to the organized implementation and provide an ordinary link when JavaScript is unavailable. Do not
remove these pages without confirming that no external links or bookmarks still depend on them.

The Organ Example and Visualizing Cells prototypes continue to use the root legacy `style.css`, but each prototype now
owns its images and videos. Their shared legacy logo lives under `shared/images/`, while the small content offset they
both need beside the shared Menu lives in `shared/chrome.css`.

The Scrollytelling Effects prototype owns its behavior and bundled web component in
`scrollytelling-effects/scripts.js` and `scrollytelling-effects/wc.js` while continuing to use the root legacy
`style.css`. Its images and model are organized with the prototype, its audio is under `shared/assets/music/`, and the
animated media it shares with Story 1 is under `shared/assets/images/` and `shared/assets/videos/`. The drag-and-drop
answer demo and its three SVG assets live together under `drag-and-drop/`.

Scrollytelling Effects, Organ Example, and Visualizing Cells adopt the navigation-only shared Menu and fixed-Dark
shared footer. Scrollytelling Effects' lightweight right-side table of contents and responsive content framing remain
owned by `scrollytelling-effects/navigation.css`; all other demonstration styles remain prototype-owned.

## Maintenance rules

- Treat every directory and filename as case-sensitive.
- Search the entire repository before moving or renaming prototype files or their assets.
- Preserve the root compatibility URLs when changing a prototype's implementation path.
- Keep prototype changes separate from maintained story and shared page-chrome changes except for the documented
  shared Menu and footer integration.
- Run `node tools/check-local-links.mjs --allow-known` after changing paths.
- Preview affected prototypes through a local HTTP server; opening HTML files directly does not reproduce GitHub Pages
  path behavior.
