# Shared Page Chrome

This directory contains the dependency-free Menu, appearance, footer, and end-of-story navigation foundations used by
the maintained landing page and story pages.

## Loading order

Pages adopting the shared components load the stylesheets directly:

```html
<link rel="stylesheet" href="shared/css/fonts.css">
<link rel="stylesheet" href="shared/css/tokens.css">
<link rel="stylesheet" href="shared/css/selection.css">
<link rel="stylesheet" href="shared/css/navigation.css">
<!-- Only on index.html and story6.html: -->
<link rel="stylesheet" href="shared/css/appearance-controls.css">
<link rel="stylesheet" href="shared/css/story-navigation.css">
<link rel="stylesheet" href="shared/css/footer.css">
```

Pages with the enhanced shared Menu load the module entry point:

```html
<script type="module" src="shared/js/main.js"></script>
```

Story 1 through Story 5 and the organized Scrollytelling Effects, Organ Example, and Visualizing Cells prototypes load
only navigation and back-to-top behavior:

```html
<script type="module" src="shared/js/navigation-only.js"></script>
```

All prototype entry points consume the approved font declarations here through
`prototypes/shared/typography.css`, which defaults prototype-owned content to Nunito Sans. Prototype-owned rules may
select Metropolis where specified.

The current page may omit a component stylesheet it does not use. Font declarations and typography roles must load
before component tokens and styles. `navigation.css` owns only the core Menu and skip link;
`appearance-controls.css` is optional and belongs immediately after it on pages that offer theme and contrast
controls.

The landing page keeps `landing/js/main.js` as its page entry point; that module initializes the canonical shared
Menu, appearance, contrast, and back-to-top modules.

## Markup contract

- Add `site-chrome` to each shared component root, including the skip link, so theme tokens remain scoped away from
  story artwork.
- Add `site-chrome--light` to the Menu root when the page does not offer appearance selection. This keeps that Menu
  light regardless of the operating-system preference without changing other shared components.
- Implement the Menu with a `details[data-site-menu]` root and a visible `summary` labeled “Menu.”
- Add `data-site-menu-panel`, `role="region"`, an accessible label, and `tabindex="-1"` to the disclosure panel.
- Add `data-site-menu-close` to the explicit close button.
- Use `shared/assets/icons/menu.svg` as the canonical visible Menu glyph.
- Keep `favicon.svg`, `favicon.ico`, and `apple-touch-icon.png` together under `shared/assets/icons/`, and declare all
  three on every HTML entry point.
- On pages that support theme selection, add `data-site-theme-choice` to each System settings, Light, and Dark radio
  input and `data-site-theme-status` to the visually hidden polite status region.
- Omit the complete appearance fieldset and theme-status region when appearance is not an available page option, and
  apply the light-only Menu modifier described above.
- On `index.html` and `story6.html`, add a hidden fieldset with `data-contrast-controls`, a visible High contrast button
  with `role="switch"`, `aria-checked`, and `data-contrast-toggle`, plus visible state text marked with
  `data-contrast-state`. The shared module reveals the fieldset only after the control is functional.
- Use `aria-current="page"` on the current internal page link.
- Keep the footer in a native `footer` and each link collection in an appropriately named `nav`.
- Use the organization marks under `shared/assets/logos/` for the landing hero and canonical footer.
- Add `site-chrome--dark` to footers on Story 1 through Story 5 so they use the fixed Dark treatment.
- Add `data-back-to-top` to the footer's same-page link so the shared enhancement moves focus to the main target.
- Keep previous and next story links in a separate `nav` labeled “Story navigation.”

Every maintained page uses the default `.site-menu` FAB geometry. Page-specific box-model resets must remain scoped
to story-owned surfaces instead of compensating for shared chrome with page-level size modifiers. Keep previous and
next navigation outside pinned story scenes, and keep the shared footer outside story-owned wrappers so animation,
link, and theme rules cannot obscure or restyle those components.

Essential landmarks and links must remain in the page HTML. Shared JavaScript enhances the native disclosure and any
available appearance controls; it does not fetch or inject component markup. Appearance choices remain hidden if
JavaScript is unavailable so the page does not present controls that cannot change the saved preference.

The landing page and Story 6 use the complete shared Menu with System settings, Light, Dark, and High contrast
controls. Story 1 through Story 5 use the navigation-only variant. Shared component styles remain scoped to the Menu,
skip link, footer, and any shared story navigation.

`selection.css` applies theme-aware selection colors only inside `.site-chrome` components. Light chrome uses deep
plum with white text, while Dark chrome uses pale pink with deep burgundy text. The stylesheet defers to operating-
system selection colors when forced-colors mode is active.

`contrast.js` follows `prefers-contrast` until a visitor explicitly selects On or Off, persists the choice under
`hra-high-contrast`, and synchronizes every switch's visible and announced state. Story contrast rules must remain
inside `.site-chrome` roots so legacy story content is never recolored by this control.

## Shared narrative foundation

Stories 2, 3, and 5 use `.story-narrative` as their semantic page contract and load the shared narrative styles after
page chrome. Their story-owned styles follow the shared foundation, and `narrative-accessibility.css` loads last.
Each document starts with `.story-flowing`; `narrative-motion.js` enables pinned animation only when reduced motion is
off and the viewport is sufficiently large. The flowing mode preserves source order without JavaScript, disables
nonessential animation, avoids fixed-height text containers, and makes Story 5 narrative videos user-controlled.
Story-owned chapter headings and summaries remain available to linear and Reader View presentations even when their
enhanced scene layout visually relies on pinned dialogue and artwork. Dialogue boundaries remain visible in forced
colors mode.

## Ownership

Selectors are prefixed with `site-` or `site-chrome-` to avoid collisions with legacy story rules. Story-specific
layout, artwork, animation, and color rules do not belong here. Scrollytelling Effects, Organ Example, and Visualizing
Cells consume only the navigation-only Menu and fixed-Dark shared footer; their page layout remains prototype-owned.

The shared Menu and footer are the single maintained implementations for every public page. Do not add page-specific
copies of their layout, interaction, appearance, or accessibility rules.

Shared font binaries and licenses belong under `shared/assets/fonts/`, interface icons under `shared/assets/icons/`,
and theme-aware organization marks under `shared/assets/logos/`. Images shared by multiple maintained stories or by a
maintained page and a prototype belong under `shared/assets/images/`; shared video belongs under
`shared/assets/videos/`. Do not duplicate these files at the repository root.

See [`../docs/architecture.md`](../docs/architecture.md#shared-page-chrome) for component ownership boundaries.
