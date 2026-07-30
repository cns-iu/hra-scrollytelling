# Repository Architecture

This document describes the current ownership boundaries and the intended path toward a more maintainable repository.
The site is served directly by GitHub Pages, so file locations and letter casing are part of the public interface.

## Stability rules

- Keep `index.html` and the root `story*.html` entry points at their current URLs.
- Keep the landing-page implementation isolated under `landing/`.
- Treat `style.css`, `scripts.js`, `img/`, and `js/` as shared legacy resources until each consumer has been mapped.
- Treat `Game/` as an isolated generated application. Preserve its directory name, internal paths, manifest, and service
  worker scope.
- Do not mechanically format `story3.html` or `story4.html`; both contain large embedded data.
- Move files in small batches and run the local-reference checker before and after every batch.

## Current ownership

| Area | Entry points | Implementation |
| --- | --- | --- |
| Landing page | `index.html` | `landing/assets/`, `landing/css/`, and `landing/js/` |
| Primary stories | `story1.html` through `story5.html` | Shared `style.css`, shared or story-specific scripts, `img/`, `music/`, and gradually organized files under `stories/` |
| Prototypes | `story0.html`, `VisualizingCells.html`, `organExample.html`, and `img/test.html` | Shared legacy files |
| Generated game | `Game/index.html` | Everything under `Game/` |

Some story pages load established libraries from content-delivery networks. The repository has no package manager or
build step, but those existing runtime integrations must still be preserved during story migrations.

## Intended organization

Root HTML files remain stable public entry points while their implementation files are gradually compartmentalized:

```text
.
├── index.html
├── story1.html
├── story2.html
├── story3.html
├── story4.html
├── story5.html
├── landing/
├── stories/
│   ├── shared/
│   │   ├── css/
│   │   ├── js/
│   │   └── assets/
│   ├── story-1/
│   │   └── assets/
│   ├── story-2/
│   │   └── assets/
│   ├── story-4/
│   │   └── config/
│   │       └── particles.json
│   └── …
├── docs/
├── tools/
├── img/
└── Game/
```

The `img/` directory remains in place until each asset has a verified owner. Empty target directories should not be
created in advance.

## Migration workflow

Migrate one small story at a time. Start broad story migration with `story1.html`; defer broad edits to the
embedded-data-heavy third and fourth stories. Isolated, verified files such as Story 4's particle configuration may
move independently when their ownership is unambiguous.

1. Run `node tools/check-local-links.mjs --allow-known`.
2. Identify every HTML, CSS, JavaScript, JSON, manifest, and service-worker consumer of the files being considered.
3. Copy the selected implementation files into the intended story or shared directory.
4. Update only the selected story's references.
5. Preview the complete story in a local web server and test its primary interactions.
6. Run the local-reference checker again.
7. Remove an old file only after repository-wide search confirms that no consumer remains.
8. Update `docs/asset-map.md`, `README.md`, and accessibility documentation when ownership or behavior changes.

Copying before deleting keeps the original experience recoverable during validation. A move is complete only when the
old path has no remaining consumers.

## Validation boundaries

The local-reference checker statically validates HTML attributes, HTML fragments, and CSS `url()` values. It cannot
prove that dynamically constructed JavaScript paths, animation timelines, third-party libraries, service workers, or
visual layouts still behave correctly. Every migration therefore also requires a real-browser review of the affected
page.

Repository organization alone does not establish accessibility conformance. Story migrations must preserve source
order, keyboard operation, focus behavior, reduced-motion behavior, and meaningful alternatives for media.
