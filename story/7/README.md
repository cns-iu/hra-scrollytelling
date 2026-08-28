# Story 7

This directory is the planning and future implementation home for Story 7. It establishes the singular, numbered
story-directory convention for new work without moving or renaming the maintained Stories 1–6.

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
- Do not place Story 7 files under the legacy `stories/story7/` convention
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

Add Story 7 to the maintained-page and local-reference checks when its `index.html` is created. Follow the validation
workflow documented in the root `AGENTS.md` before presenting the page as ready to commit.

## Migration boundary

Stories 1–6 currently retain their root `storyN.html` entry points and implementation files under `stories/storyN/`.
Migrating those published stories to `story/<number>/` is separate, copy-first work that requires reference auditing,
compatibility planning, and per-story visual regression testing.
