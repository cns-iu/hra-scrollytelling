# Shared HRA fonts

These webfont assets were downloaded from [Fontsource](https://fontsource.org/) and support maintained public pages,
shared page chrome, and retained prototypes.

## Included files

- **Metropolis:** Latin, normal style, static weights 500 and 700.
- **Nunito Sans:** Latin and Latin Extended, normal style, variable weight axis.
- **Roboto Mono:** Latin and Latin Extended, normal style, static weight 400.

Only WOFF2 files used by the HRA typography scale are retained. Source ZIP archives, WOFF, TTF, unused weights, italic
styles, and unrelated language subsets are intentionally excluded.

Each family directory includes the license distributed with its Fontsource download. Do not replace a font without
reviewing its source, supported characters, license, file size, and effect on maintained page layouts.

The exact HRA display, headline, title, label, body, and mono scale is represented as reusable custom properties in
`shared/css/fonts.css`. Landing-page component mappings live in `landing/css/styles.css`; shared page-chrome mappings
live in `shared/css/`. Story 6 also loads these shared declarations and must not add page-local copies of the same
font files. The Scrollytelling Effects, Visualizing Cells, and Organ Example prototypes load the same declarations
alongside the legacy root `style.css`.
