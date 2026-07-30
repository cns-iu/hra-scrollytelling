# Landing-page fonts

These webfont assets were downloaded from [Fontsource](https://fontsource.org/) and are isolated to the landing-page
experience.

## Included files

- **Metropolis:** Latin, normal style, static weights 500 and 700.
- **Nunito Sans:** Latin and Latin Extended, normal style, variable weight axis.
- **Roboto Mono:** Latin and Latin Extended, normal style, static weight 400.

Only WOFF2 files used by the HRA typography scale are retained. Source ZIP archives, WOFF, TTF, unused weights, italic
styles, and unrelated language subsets are intentionally excluded.

Each family directory includes the license distributed with its Fontsource download. Do not replace a font without
reviewing its source, supported characters, license, file size, and effect on landing-page layout.

The exact HRA display, headline, title, label, body, and mono scale is represented as reusable custom properties in
`landing/css/fonts.css`. Component-to-role mappings live in `landing/css/styles.css`.
