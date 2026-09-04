# Story 7

This directory is the planning and future implementation home for Story 7.

The numbered story-directory convention described here is now how every story in the repository is laid out; Stories
1–6 were migrated onto it. This file remains the reference for adding the next one.

## Publication route

Story 7 must use this file as its page entry point:

```text
story/7/index.html
```

When published through GitHub Pages, that entry point provides:

```text
https://cns-iu.github.io/hra-scrollytelling/story/7/
```

The repository-level `index.html` remains the landing page and must not move into this directory. The `index.html`
described here is a new, Story 7-specific document.

Story 7 does not have a published page yet. The clean URL will become available only after `story/7/index.html` is
created and merged into the branch published by GitHub Pages.

## Intended ownership

Create only the directories the implementation actually needs:

```text
story/7/
├── index.html
├── README.md
├── css/
├── images/
├── js/
└── video/
```

- Keep Story 7-exclusive presentation and scripts in this directory
- Keep Story 7-exclusive images and video in the corresponding local asset directories
- Use `shared/` only for components or assets confirmed to have multiple consumers
- Do not create a top-level `stories/` directory; that layout has been retired
- Do not create empty organizational directories before they are needed

From `story/7/index.html`, shared files are two directory levels above the page. For example:

```html
<link rel="stylesheet" href="../../shared/css/fonts.css" />
```

## Page requirements

The Story 7 entry point should:

- Use semantic `main`, `article`, section headings, paragraphs, figures, captions, and lists in meaningful source order
- Include the shared Menu, footer, story navigation, favicon set, fonts, and applicable shared design tokens
- Remain readable without JavaScript and in Firefox Reader View
- Meet the repository accessibility requirements for keyboard use, focus visibility, contrast, reflow, text spacing,
  motion preferences, forced colors, and accessible media controls
- Include a non-empty description and canonical metadata for the clean trailing-slash URL
- Use canonical DOI URLs for publications and Zenodo-hosted SOPs whenever a verified DOI exists
- Remain dependency-free unless a separate dependency change is explicitly approved

## Local preview and validation

Start the repository preview from the repository root:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/story/7/
```

Add Story 7 to the `stories` manifest at the top of `tools/check-maintained-pages.mjs` when its `index.html` is
created — every page path and asset assertion is derived from that manifest, so one entry is enough. Then run
`npm run check` and follow the validation workflow in the root `AGENTS.md` before presenting the page as ready to
commit.

## Shared foundations

Before adding anything to this directory, check whether it already exists:

- Colour values come from `shared/css/tokens.css`. Do not write a hex literal in story CSS; use `--hra-*` for roles
  that follow the appearance, or `--hra-light-*` / `--hra-dark-*` for a surface pinned to one appearance.
- Semantic component roles come from `shared/css/component-roles.css`.
- The Menu, footer, and appearance controls come from `shared/fixtures/`; copy them verbatim, adjusting only the
  `aria-current` marker. The maintained-page check fails on any other difference.
- Scroll timelines shared by the narrative stories live in `shared/js/narrative-timeline.js`, and the motion
  preference gate in `shared/js/motion-preferences.js`.

## Migration note

Stories 1–6 were migrated to this convention. Their root `storyN.html` files are redirect stubs that preserve the
former published URLs; keep them pointing at the matching story.
