# Shared Page Chrome

This directory contains the dependency-free Menu, appearance, footer, and end-of-story navigation foundations used by
the maintained landing page and story pages.

## Loading order

Pages adopting the shared components load the stylesheets directly:

```html
<link rel="stylesheet" href="shared/css/tokens.css">
<link rel="stylesheet" href="shared/css/navigation.css">
<link rel="stylesheet" href="shared/css/story-navigation.css">
<link rel="stylesheet" href="shared/css/footer.css">
```

Only pages with the shared Menu and appearance controls load the module entry point:

```html
<script type="module" src="shared/js/main.js"></script>
```

The current page may omit a component stylesheet it does not use. Token styles must remain first.

## Markup contract

- Add `site-chrome` to each shared component root, including the skip link, so theme tokens remain scoped away from
  story artwork.
- Implement the Menu with a `details[data-site-menu]` root and a visible `summary` labeled “Menu.”
- Add `data-site-menu-panel` and `tabindex="-1"` to the disclosure panel.
- Add `data-site-menu-close` to the explicit close button.
- Add `data-site-theme-choice` to each System settings, Light, and Dark radio input.
- Add `data-site-theme-status` to the visually hidden polite status region.
- Use `aria-current="page"` on the current internal page link.
- Keep the footer in a native `footer` and each link collection in an appropriately named `nav`.
- Keep previous and next story links in a separate `nav` labeled “Story navigation.”

Essential landmarks and links must remain in the page HTML. Shared JavaScript enhances the native disclosure and
appearance controls; it does not fetch or inject component markup. Appearance choices remain hidden if JavaScript is
unavailable so the page does not present controls that cannot change the saved preference.

## Ownership

Selectors are prefixed with `site-` or `site-chrome-` to avoid collisions with legacy story rules. Story-specific
layout, artwork, animation, and color rules do not belong here. Prototype pages and `Game/` are not consumers.

See [`../docs/architecture.md`](../docs/architecture.md#shared-page-chrome) for the staged migration workflow.
