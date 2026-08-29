#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { validateEndMatter } from "./story-end-matter-schema.mjs";

const START_MARKER = "<!-- story-end-matter:start -->";
const END_MARKER = "<!-- story-end-matter:end -->";
const checkOnly = process.argv.includes("--check");
const projectRoot = process.cwd();
const storyConfigurations = [
    { html: "story1.html", json: "stories/story1/end-matter.json", fixedLight: true },
    { html: "story2.html", json: "stories/story2/end-matter.json", fixedLight: true },
    { html: "story3.html", json: "stories/story3/end-matter.json", fixedLight: true },
    { html: "story4.html", json: "stories/story4/end-matter.json", fixedLight: true },
    { html: "story5.html", json: "stories/story5/end-matter.json", fixedLight: true, anchorId: "scrollto11" },
    { html: "story6.html", json: "story/6/end-matter.json", fixedLight: false },
];
const issues = [];

for (const configuration of storyConfigurations) {
    await processStory(configuration);
}

if (issues.length > 0) {
    console.error(`Story end-matter ${checkOnly ? "check" : "render"} failed with ${issues.length} issue${issues.length === 1 ? "" : "s"}:`);

    for (const issue of issues) {
        console.error(`- ${issue}`);
    }

    process.exitCode = 1;
} else {
    console.log(`Story end matter ${checkOnly ? "matches its JSON sources" : "rendered for 6 stories"}.`);
}

/**
 * Validates one JSON source and checks or updates its marked HTML block.
 *
 * @param {{html: string, json: string, fixedLight: boolean, anchorId?: string}} configuration Story paths and presentation options
 * @returns {Promise<void>} Promise resolved after the story is processed
 */
async function processStory(configuration) {
    const htmlPath = path.join(projectRoot, configuration.html);
    const jsonPath = path.join(projectRoot, configuration.json);
    let html;
    let data;

    try {
        [html, data] = await Promise.all([readFile(htmlPath, "utf8"), readJson(jsonPath)]);
    } catch (error) {
        issues.push(`${configuration.html}: ${error.message}`);
        return;
    }

    const validationIssues = validateEndMatter(data);

    if (validationIssues.length > 0) {
        validationIssues.forEach((issue) => issues.push(`${configuration.json}: ${issue}`));
        return;
    }

    const startIndex = html.indexOf(START_MARKER);
    const endIndex = html.indexOf(END_MARKER);

    if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
        issues.push(`${configuration.html}: missing ordered story end-matter markers`);
        return;
    }

    const existingBlock = html.slice(startIndex, endIndex + END_MARKER.length);
    const renderedBlock = renderEndMatter(data, configuration);

    if (existingBlock === renderedBlock) {
        return;
    }

    if (checkOnly) {
        issues.push(`${configuration.html}: generated end matter is stale; run node tools/render-story-end-matter.mjs`);
        return;
    }

    const updatedHtml = `${html.slice(0, startIndex)}${renderedBlock}${html.slice(endIndex + END_MARKER.length)}`;
    await writeFile(htmlPath, updatedHtml);
}

/**
 * Reads and parses a JSON file.
 *
 * @param {string} filename Absolute JSON path
 * @returns {Promise<object>} Parsed JSON value
 */
async function readJson(filename) {
    return JSON.parse(await readFile(filename, "utf8"));
}

/**
 * Renders the complete marked component block.
 *
 * @param {object} data Validated story content
 * @param {{json: string, fixedLight: boolean, anchorId?: string}} configuration Story presentation options
 * @returns {string} Generated semantic HTML
 */
function renderEndMatter(data, configuration) {
    const wrapperClasses = ["story-end-matter", "site-chrome"];

    if (configuration.fixedLight) {
        wrapperClasses.push("site-chrome--light");
    }

    const idAttribute = configuration.anchorId ? ` id="${escapeAttribute(configuration.anchorId)}"` : "";
    const sections = [
        renderResources(data.resources),
        renderAcknowledgments(data.acknowledgments),
        renderReferences(data.references),
    ].filter(Boolean);

    return [
        START_MARKER,
        `      <!-- Generated from ${configuration.json}; edit the JSON and rerun tools/render-story-end-matter.mjs -->`,
        `      <div class="${wrapperClasses.join(" ")}"${idAttribute}>`,
        sections.join("\n"),
        "      </div>",
        `      ${END_MARKER}`,
    ].join("\n");
}

/**
 * Renders the optional Resources section.
 *
 * @param {object|undefined} resources Resources content
 * @returns {string} Resources HTML or an empty string
 */
function renderResources(resources) {
    if (!resources) {
        return "";
    }

    const cards = resources.items.map((item) => renderResourceCard(item)).join("\n");

    return [
        "        <section class=\"story-end-matter__section story-end-matter__resources\" aria-labelledby=\"resources-title\">",
        "          <div class=\"story-end-matter__content\">",
        renderSectionHeader(resources.title, resources.intro, "resources-title", 12),
        "            <ul class=\"story-resource-list\">",
        cards,
        "            </ul>",
        "          </div>",
        "        </section>",
    ].join("\n");
}

/**
 * Renders one simple resource card.
 *
 * @param {object} item Resource item
 * @returns {string} Resource-card HTML
 */
function renderResourceCard(item) {
    const attributes = item.newTab ? ' target="_blank" rel="noopener noreferrer"' : "";
    const externalNotice = item.newTab
        ? '<span class="story-end-matter__visually-hidden"> opens in a new tab</span>'
        : "";

    return [
        "              <li>",
        "                <article class=\"story-resource-card\">",
        `                  <p class="story-resource-card__eyebrow">${escapeHtml(item.eyebrow)}</p>`,
        "                  <h3 class=\"story-resource-card__title\">",
        `                    <a class="story-resource-card__link" href="${escapeAttribute(item.href)}"${attributes}>${escapeHtml(item.title)}${externalNotice}</a>`,
        "                  </h3>",
        `                  <p class="story-resource-card__description">${escapeHtml(item.description)}</p>`,
        "                </article>",
        "              </li>",
    ].join("\n");
}

/**
 * Renders the optional Acknowledgments section.
 *
 * @param {object|undefined} acknowledgments Acknowledgment content
 * @returns {string} Acknowledgments HTML or an empty string
 */
function renderAcknowledgments(acknowledgments) {
    if (!acknowledgments) {
        return "";
    }

    const items = acknowledgments.items
        .map(
            (item) =>
                `              <li><strong>${escapeHtml(item.label)}:</strong> <span>${escapeHtml(item.text)}</span></li>`,
        )
        .join("\n");
    const funding = acknowledgments.funding
        ? `\n            <p class="story-acknowledgments__funding"><strong>${escapeHtml(acknowledgments.funding.label)}:</strong> ${escapeHtml(acknowledgments.funding.text)}</p>`
        : "";
    const funders = renderFunders(acknowledgments.funders);

    return [
        "        <section class=\"story-end-matter__section story-end-matter__acknowledgments\" aria-labelledby=\"acknowledgments-title\">",
        "          <div class=\"story-end-matter__content\">",
        renderSectionHeader(acknowledgments.title, acknowledgments.intro, "acknowledgments-title", 12),
        "            <ul class=\"story-acknowledgments-list\">",
        items,
        `            </ul>${funding}${funders}`,
        "          </div>",
        "        </section>",
    ].join("\n");
}

/**
 * Renders optional linked funder marks.
 *
 * @param {object[]|undefined} funders Funder entries
 * @returns {string} Funder-list HTML or an empty string
 */
function renderFunders(funders) {
    if (!funders?.length) {
        return "";
    }

    const items = funders
        .map(
            (funder) =>
                `              <li><a href="${escapeAttribute(funder.href)}" aria-label="${escapeAttribute(funder.name)}"><img src="${escapeAttribute(funder.logo)}" alt="" width="${funder.width}" height="${funder.height}" /></a></li>`,
        )
        .join("\n");

    return [
        "",
        "            <ul class=\"story-acknowledgments__funders\" aria-label=\"Funding organizations\">",
        items,
        "            </ul>",
    ].join("\n");
}

/**
 * Renders the optional References section.
 *
 * @param {object|undefined} references Reference content
 * @returns {string} References HTML or an empty string
 */
function renderReferences(references) {
    if (!references) {
        return "";
    }

    const items = references.items
        .map((item) => ["              <li>", `                <p>${renderCitation(item)}</p>`, "              </li>"].join("\n"))
        .join("\n");

    return [
        "        <section class=\"story-end-matter__section story-end-matter__references\" aria-labelledby=\"references-title\">",
        "          <div class=\"story-end-matter__content\">",
        renderSectionHeader(references.title, references.intro, "references-title", 12),
        "            <ol class=\"story-reference-list\">",
        items,
        "            </ol>",
        "          </div>",
        "        </section>",
    ].join("\n");
}

/**
 * Renders a centered section header.
 *
 * @param {string} title Heading text
 * @param {string|undefined} intro Optional introduction
 * @param {string} id Heading ID
 * @param {number} indentation Leading spaces
 * @returns {string} Header HTML
 */
function renderSectionHeader(title, intro, id, indentation) {
    const space = " ".repeat(indentation);
    const introMarkup = intro
        ? `\n${space}  <p class="story-end-matter__intro">${escapeHtml(intro)}</p>`
        : "";

    return [
        `${space}<header class="story-end-matter__header article-header">`,
        `${space}  <h2 class="story-end-matter__heading" id="${id}">${escapeHtml(title)}</h2>${introMarkup}`,
        `${space}</header>`,
    ].join("\n");
}

/**
 * Formats one supported citation in the established Story 6 presentation.
 *
 * @param {object} item Reference data
 * @returns {string} Escaped citation HTML
 */
function renderCitation(item) {
    const authors = escapeHtml(joinAuthors(item.authors));
    const title = formatQuotedTitle(item.title);
    let citation;

    if (item.type === "journal-article") {
        const issue = item.issue ? `, no. ${escapeHtml(item.issue)}` : "";
        const location = item.pages ? `: ${escapeHtml(item.pages)}` : item.articleNumber ? `: ${escapeHtml(item.articleNumber)}` : "";
        const published = item.date ? ` Published ${escapeHtml(item.date)}.` : "";

        citation = `${authors}. ${title} <em>${escapeHtml(item.containerTitle)}</em> ${escapeHtml(item.volume)}${issue} (${escapeHtml(item.year)})${location}.${published}`;
    } else if (item.type === "preprint") {
        citation = `${authors}. ${title} <em>${escapeHtml(item.containerTitle)}</em> preprint, ${escapeHtml(item.date)}.`;
    } else {
        citation = `${authors}. ${title} ${escapeHtml(item.publisher)}, ${escapeHtml(item.date)}.`;
    }

    const url = item.doi ? `https://doi.org/${item.doi}` : item.url;

    return `${citation} <a href="${escapeAttribute(url)}">${escapeHtml(url)}</a>.`;
}

/**
 * Wraps a title in quotation marks without duplicating terminal punctuation.
 *
 * @param {string} title Publication title
 * @returns {string} Escaped, quoted title
 */
function formatQuotedTitle(title) {
    const escapedTitle = escapeHtml(title);
    const punctuation = /[.!?]$/u.test(title) ? "" : ".";

    return `“${escapedTitle}${punctuation}”`;
}

/**
 * Joins a complete author list without shortening it.
 *
 * @param {string[]} authors Display-ready author names
 * @returns {string} Chicago-style joined byline
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
 * Escapes text for HTML content.
 *
 * @param {unknown} value Text value
 * @returns {string} Escaped HTML text
 */
function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

/**
 * Escapes text for an HTML attribute.
 *
 * @param {unknown} value Attribute value
 * @returns {string} Escaped attribute text
 */
function escapeAttribute(value) {
    return escapeHtml(value);
}
