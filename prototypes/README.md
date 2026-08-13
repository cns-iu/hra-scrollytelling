# Legacy Prototypes

This directory contains experiments and superseded experiences that remain publicly available for reference but are
not maintained as part of the primary story collection.

## Current prototypes

| Prototype | Implementation | Compatibility URL |
| --- | --- | --- |
| Scrollytelling Effects | `scrollytelling-effects/index.html` | `story0.html` at the repository root |
| Organ Example | `organ-example/index.html` | `organExample.html` at the repository root |
| Visualizing Cells | `visualizing-cells/index.html` | `VisualizingCells.html` at the repository root |

The compatibility pages at the repository root preserve previously published GitHub Pages URLs. They forward browsers
with JavaScript to the organized implementation and provide an ordinary link when JavaScript is unavailable. Do not
remove these pages without confirming that no external links or bookmarks still depend on them.

The Organ Example and Visualizing Cells prototypes continue to use the root legacy `style.css` and `img/` paths. That
coupling is intentional for this organizational phase; separating their assets or remediating their interfaces should
happen in independent, explicitly reviewed changes.

The Scrollytelling Effects prototype owns its behavior in `scrollytelling-effects/scripts.js` while continuing to use
the root legacy `style.css`, `img/`, `music/`, and `js/wc.js` resources. `img/test.html` and the generated `Game/`
application remain in their established locations. `Game/` is a published application embedded by the prototype, not
a prototype folder to move without a dedicated migration plan.

## Maintenance rules

- Treat every directory and filename as case-sensitive.
- Search the entire repository before moving or renaming prototype files or their assets.
- Preserve the root compatibility URLs when changing a prototype's implementation path.
- Keep prototype changes separate from maintained story and shared page-chrome changes.
- Run `node tools/check-local-links.mjs --allow-known` after changing paths.
- Preview affected prototypes through a local HTTP server; opening HTML files directly does not reproduce GitHub Pages
  path behavior.
