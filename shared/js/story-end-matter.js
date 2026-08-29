import { validateEndMatter } from "./story-end-matter-schema.mjs";

const placeholders = document.querySelectorAll("[data-story-end-matter-source]");

placeholders.forEach((placeholder) => loadEndMatter(placeholder));

/**
 * Loads and renders one story's end matter from its owning JSON file.
 *
 * @param {HTMLElement} placeholder Story-owned rendering target
 * @returns {Promise<void>} Promise resolved after content or an error state is rendered
 */
async function loadEndMatter(placeholder) {
    const source = placeholder.dataset.storyEndMatterSource;

    placeholder.classList.add("story-end-matter--loading");
    placeholder.setAttribute("aria-busy", "true");

    try {
        const response = await fetch(source, { credentials: "same-origin" });

        if (!response.ok) {
            throw new Error(`request returned ${response.status}`);
        }

        const data = await response.json();
        const issues = validateEndMatter(data);

        if (issues.length > 0) {
            throw new Error(issues.join("; "));
        }

        placeholder.replaceChildren(renderEndMatter(data));
        restoreEndMatterHash(placeholder);
    } catch (error) {
        renderLoadFailure(placeholder);
        console.error(`Story end matter could not load from ${source}.`, error);
    } finally {
        placeholder.classList.remove("story-end-matter--loading");
        placeholder.removeAttribute("aria-busy");
    }
}

/**
 * Creates every configured end-matter section in source order.
 *
 * @param {object} data Validated end-matter content
 * @returns {DocumentFragment} Rendered section fragment
 */
function renderEndMatter(data) {
    const fragment = document.createDocumentFragment();
    const sections = [
        data.resources ? renderResources(data.resources) : null,
        data.acknowledgments ? renderAcknowledgments(data.acknowledgments) : null,
        data.references ? renderReferences(data.references) : null,
    ];

    sections.filter(Boolean).forEach((section) => fragment.append(section));
    return fragment;
}

/**
 * Creates the resource-card section.
 *
 * @param {object} resources Validated resource content
 * @returns {HTMLElement} Resources section
 */
function renderResources(resources) {
    const section = createSection("resources", resources.title, resources.intro);
    const list = createElement("ul", "story-resource-list");

    resources.items.forEach((item) => {
        const listItem = document.createElement("li");
        const card = createElement("article", "story-resource-card");
        const eyebrow = createElement("p", "story-resource-card__eyebrow", item.eyebrow);
        const title = createElement("h3", "story-resource-card__title");
        const link = createElement("a", "story-resource-card__link", item.title);
        const description = createElement("p", "story-resource-card__description", item.description);

        link.href = item.href;

        if (item.newTab) {
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.append(createElement("span", "story-end-matter__visually-hidden", " opens in a new tab"));
        }

        title.append(link);
        card.append(eyebrow, title, description);
        listItem.append(card);
        list.append(listItem);
    });

    section.content.append(list);
    return section.root;
}

/**
 * Creates the acknowledgment section and its optional funding information.
 *
 * @param {object} acknowledgments Validated acknowledgment content
 * @returns {HTMLElement} Acknowledgments section
 */
function renderAcknowledgments(acknowledgments) {
    const section = createSection("acknowledgments", acknowledgments.title, acknowledgments.intro);
    const list = createElement("ul", "story-acknowledgments-list");

    acknowledgments.items.forEach((item) => {
        const listItem = document.createElement("li");
        const label = document.createElement("strong");

        label.textContent = `${item.label}:`;
        listItem.append(label, ` ${item.text}`);
        list.append(listItem);
    });

    section.content.append(list);

    if (acknowledgments.funding) {
        const funding = createElement("p", "story-acknowledgments__funding");
        const label = document.createElement("strong");

        label.textContent = `${acknowledgments.funding.label}:`;
        funding.append(label, ` ${acknowledgments.funding.text}`);
        section.content.append(funding);
    }

    if (acknowledgments.funders?.length) {
        section.content.append(renderFunders(acknowledgments.funders));
    }

    return section.root;
}

/**
 * Creates linked funding-organization marks.
 *
 * @param {object[]} funders Validated funder entries
 * @returns {HTMLElement} Funder list
 */
function renderFunders(funders) {
    const list = createElement("ul", "story-acknowledgments__funders");

    list.setAttribute("aria-label", "Funding organizations");

    funders.forEach((funder) => {
        const listItem = document.createElement("li");
        const link = document.createElement("a");
        const image = document.createElement("img");

        link.href = funder.href;
        link.setAttribute("aria-label", funder.name);
        image.src = funder.logo;
        image.alt = "";
        image.width = funder.width;
        image.height = funder.height;
        link.append(image);
        listItem.append(link);
        list.append(listItem);
    });

    return list;
}

/**
 * Creates the formatted reference list.
 *
 * @param {object} references Validated reference content
 * @returns {HTMLElement} References section
 */
function renderReferences(references) {
    const section = createSection("references", references.title, references.intro);
    const list = createElement("ol", "story-reference-list");

    references.items.forEach((item) => {
        const listItem = document.createElement("li");
        const citation = document.createElement("p");

        appendCitation(citation, item);
        listItem.append(citation);
        list.append(listItem);
    });

    section.content.append(list);
    return section.root;
}

/**
 * Creates one end-matter section with a centered heading and optional introduction.
 *
 * @param {string} name Section name used in class names and the heading ID
 * @param {string} title Visible section title
 * @param {string|undefined} intro Optional section introduction
 * @returns {{root: HTMLElement, content: HTMLElement}} Section root and content container
 */
function createSection(name, title, intro) {
    const root = createElement("section", `story-end-matter__section story-end-matter__${name}`);
    const content = createElement("div", "story-end-matter__content");
    const header = createElement("header", "story-end-matter__header article-header");
    const heading = createElement("h2", "story-end-matter__heading", title);
    const headingId = `${name}-title`;

    root.setAttribute("aria-labelledby", headingId);
    heading.id = headingId;
    header.append(heading);

    if (intro) {
        header.append(createElement("p", "story-end-matter__intro", intro));
    }

    content.append(header);
    root.append(content);
    return { root, content };
}

/**
 * Appends a Chicago-style citation using semantic emphasis and a visible source link.
 *
 * @param {HTMLElement} paragraph Citation paragraph
 * @param {object} item Validated reference entry
 * @returns {void}
 */
function appendCitation(paragraph, item) {
    paragraph.append(`${joinAuthors(item.authors)}. ${formatQuotedTitle(item.title)} `);

    if (item.type === "journal-article") {
        paragraph.append(createElement("em", "", item.containerTitle));
        paragraph.append(` ${item.volume}${item.issue ? `, no. ${item.issue}` : ""} (${item.year})`);

        if (item.pages) {
            paragraph.append(`: ${item.pages}`);
        } else if (item.articleNumber) {
            paragraph.append(`: ${item.articleNumber}`);
        }

        paragraph.append(`.${item.date ? ` Published ${item.date}.` : ""}`);
    } else if (item.type === "preprint") {
        paragraph.append(createElement("em", "", item.containerTitle));
        paragraph.append(` preprint, ${item.date}.`);
    } else {
        paragraph.append(`${item.publisher}, ${item.date}.`);
    }

    const url = item.doi ? `https://doi.org/${item.doi}` : item.url;
    const link = createElement("a", "", url);

    link.href = url;
    paragraph.append(" ", link, ".");
}

/**
 * Joins a complete display-ready author list without shortening it.
 *
 * @param {string[]} authors Publication authors
 * @returns {string} Joined author byline
 */
function joinAuthors(authors) {
    if (authors.length === 1) {
        return authors[0];
    }

    if (authors.length === 2) {
        return `${authors[0]} and ${authors[1]}`;
    }

    return `${authors.slice(0, -1).join(", ")}, and ${authors.at(-1)}`;
}

/**
 * Wraps a publication title in quotation marks with terminal punctuation.
 *
 * @param {string} title Publication title
 * @returns {string} Display-ready quoted title
 */
function formatQuotedTitle(title) {
    const punctuation = /[.!?]$/u.test(title) ? "" : ".";

    return `“${title}${punctuation}”`;
}

/**
 * Reapplies a deep link whose target was unavailable before runtime rendering.
 *
 * @param {HTMLElement} placeholder Rendered end-matter root
 * @returns {void}
 */
function restoreEndMatterHash(placeholder) {
    if (!window.location.hash) {
        return;
    }

    let id;

    try {
        id = decodeURIComponent(window.location.hash.slice(1));
    } catch {
        return;
    }

    const target = document.getElementById(id);

    if (target && placeholder.contains(target)) {
        window.requestAnimationFrame(() => target.scrollIntoView());
    }
}

/**
 * Replaces a failed component with a concise in-flow message.
 *
 * @param {HTMLElement} placeholder End-matter rendering target
 * @returns {void}
 */
function renderLoadFailure(placeholder) {
    const message = createElement(
        "p",
        "story-end-matter__status story-end-matter__status--error",
        "End-of-story resources could not be loaded. Please refresh the page to try again.",
    );

    message.setAttribute("role", "status");
    placeholder.replaceChildren(message);
}

/**
 * Creates an element with optional classes and text content.
 *
 * @param {string} tagName HTML element name
 * @param {string} className Space-separated class names
 * @param {string|undefined} text Optional text content
 * @returns {HTMLElement} Created element
 */
function createElement(tagName, className, text) {
    const element = document.createElement(tagName);

    if (className) {
        element.className = className;
    }

    if (text !== undefined) {
        element.textContent = text;
    }

    return element;
}
