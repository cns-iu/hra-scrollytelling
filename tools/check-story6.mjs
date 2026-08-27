#!/usr/bin/env node

import { access, readFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const storyPath = path.join(projectRoot, "story6.html");
const files = {
    html: await readFile(storyPath, "utf8"),
    animations: await readFile(path.join(projectRoot, "stories", "story6", "js", "animations.js"), "utf8"),
    base: await readFile(path.join(projectRoot, "stories", "story6", "css", "base.css"), "utf8"),
    cde: await readFile(path.join(projectRoot, "stories", "story6", "css", "cde.css"), "utf8"),
    media: await readFile(path.join(projectRoot, "stories", "story6", "js", "media.js"), "utf8"),
    narrative: await readFile(path.join(projectRoot, "stories", "story6", "css", "narrative.css"), "utf8"),
};
const issues = [];

checkMarkupContracts();
checkReaderViewOrder();
checkAnimationGeometry();
checkImagePolicy();
await checkLocalImageReferences();
await checkAssetInventory();
checkIdsAndReferences();
checkElementNesting();

if (issues.length > 0) {
    console.error(`Story 6 check failed with ${issues.length} issue${issues.length === 1 ? "" : "s"}:`);

    for (const issue of issues) {
        console.error(`- ${issue}`);
    }

    process.exitCode = 1;
} else {
    console.log("Story 6 structure, Reader View, animation geometry, and image policy checks passed");
}

/**
 * Records whether an expected invariant remains true.
 *
 * @param {boolean} condition Result of the invariant check
 * @param {string} message Failure message
 * @returns {void}
 */
function check(condition, message) {
    if (!condition) {
        issues.push(message);
    }
}

/**
 * Checks maintained markup and removes opportunities for legacy dependencies to return unnoticed.
 *
 * @returns {void}
 */
function checkMarkupContracts() {
    check(!files.html.includes('href="style.css"'), "Story 6 must not load the legacy root style.css");
    check(files.html.includes('href="shared/css/story-navigation.css"'), "Story 6 must load the maintained story-navigation stylesheet");
    check(files.html.includes('class="site-story-navigation site-chrome"'), "Story 6 must use the shared story-navigation component");
    check(!files.html.includes("sceneEnd"), "Legacy sceneEnd markup must stay removed");
    check(!files.html.includes("showpicture2"), "The unused showpicture2 hook must stay removed");
    check(!/\bet al\./iu.test(files.html), "Story 6 publication citations must retain their complete named bylines");
    check(countMatches(files.html, /class="organ-comparison"/gu) === 3, "The tissue comparison must contain three organ cards");
    check(countMatches(files.html, /class="tissue-sample"/gu) === 9, "The tissue comparison must contain nine sample cards");
    check(countMatches(files.html, /class="tutorial-callout tutorial-callout--\d"/gu) === 5, "The CDE tutorial must contain five semantic steps");
    check(
        /<section\s+[^>]*class="transition transition5[^"]*"[^>]*aria-labelledby="conclusion-title"[\s\S]*?<h2[^>]*id="conclusion-title"[^>]*>Conclusion<\/h2>[\s\S]*?<p class="textbox-transition/iu.test(files.html),
        "The final transition must retain its explicit Conclusion heading and paragraph",
    );
}

/**
 * Checks the source order Firefox Reader View depends on for the complete narrative.
 *
 * @returns {void}
 */
function checkReaderViewOrder() {
    const landmarks = [
        "Pan-organ Immunosenescence Atlas",
        "What is <span class=\"transition-emphasis\">immunosenescence",
        "laboratory mice",
        "tissue-comparison-title",
        "cde-tutorial-title",
        "conclusion-title",
        "resources-title",
        "acknowledgments-title",
        "references-title",
    ];
    let previousIndex = -1;

    for (const landmark of landmarks) {
        const index = files.html.indexOf(landmark);
        check(index > previousIndex, `Reader View landmark is missing or out of order: ${landmark}`);
        previousIndex = index;
    }

    check(files.html.includes("class=\"mouse-reader-overview\""), "Reader View must retain the compact mouse overview");
    check(/<ol\s+[^>]*class="cde-tutorial-steps"/iu.test(files.html), "Reader View must retain the ordered CDE instructions");
}

/**
 * Checks the scene-height ownership that prevents comparison clipping and a frozen tutorial.
 *
 * @returns {void}
 */
function checkAnimationGeometry() {
    check(
        !/&\.story-animations-enabled\s*\{\s*\.story-scene\b/u.test(files.base),
        "Enhanced mode must not force every story scene to one clipped viewport",
    );
    check(
        /&\.story-animations-enabled\s*\{\s*\.section2,\s*\.section3,\s*\.transition\s*\{\s*height:\s*var\(--story-viewport-height\);\s*overflow:\s*hidden;/u.test(files.base),
        "Enhanced viewport sizing must stay limited to the genuinely pinned scenes",
    );
    check(
        /section\.section4\s*\{[\s\S]*?height:\s*auto;[\s\S]*?overflow:\s*visible;/u.test(files.narrative),
        "The organ comparison must retain flowing height and visible overflow",
    );
    check(
        /section\.section5\s*\{[\s\S]*?height:\s*calc\([\s\S]*?overflow:\s*visible;/u.test(files.cde),
        "The CDE tutorial must retain its multi-viewport scroll range",
    );
    check(files.animations.includes("createScrubbedTrigger('.section5', 'bottom bottom', true)"), "The CDE tutorial must remain directly scrubbed");
    check(
        /\.body-outline\s*\{[\s\S]*?width:\s*auto;[\s\S]*?height:\s*100%;[\s\S]*?object-fit:\s*contain;/u.test(files.narrative),
        "Body artwork must retain height-driven, aspect-preserving sizing",
    );
    check(
        /\.tutorial\s*\{[\s\S]*?opacity:\s*0;[\s\S]*?visibility:\s*hidden;[\s\S]*?\.tutorial1\s*\{[\s\S]*?opacity:\s*1;[\s\S]*?visibility:\s*visible;/u.test(
            files.cde,
        ),
        "The CDE tutorial must expose only its starter screenshot before its timeline begins",
    );
    check(!/textbox[^\n]*autoAlpha|autoAlpha[^\n]*textbox/iu.test(files.animations), "Semantic transition text must not use autoAlpha");

    for (const selector of [".page-header", ".section2", ".section3", ".transition1", ".transition2", ".transition3", ".section5", ".transition5"]) {
        check(files.html.includes(selector.slice(1)), `Animation selector has no matching Story 6 markup: ${selector}`);
    }
}

/**
 * Checks responsive image candidates, staged requests, and loading metadata.
 *
 * @returns {void}
 */
function checkImagePolicy() {
    const storyImages = Array.from(files.html.matchAll(/<img\b[^>]*(?:src|data-src)="stories\/story6\/img\/[^>]*>/giu), (match) => match[0]);

    for (const image of storyImages) {
        check(/\balt="[^"]*"/u.test(image), `Story 6 image is missing alt text: ${summarizeTag(image)}`);
        check(/\bwidth="\d+"/u.test(image) && /\bheight="\d+"/u.test(image), `Story 6 image is missing dimensions: ${summarizeTag(image)}`);
        check(/\bdecoding="async"/u.test(image), `Story 6 image is missing async decoding: ${summarizeTag(image)}`);

        if (!/\bfetchpriority="high"/u.test(image)) {
            check(/\bloading="(?:lazy|eager)"/u.test(image), `Story 6 image needs an explicit loading policy: ${summarizeTag(image)}`);
        }
    }

    check(/splash-bg-960\.webp\s+960w/u.test(files.html), "The splash must retain its 960px source");
    check(/splash-bg-1920\.webp\s+1920w/u.test(files.html), "The splash must retain its 1920px source");
    check(countMatches(files.html, /-320\.png\s+320w/gu) === 9, "All nine tissue maps must retain 320px candidates");
    check(countMatches(files.html, /-640\.png\s+640w/gu) >= 15, "Tissue, cell, and mouse artwork must retain 640px candidates");
    check(countMatches(files.html, /tutorial\d-660\.png\s+660w/gu) === 5, "All tutorial frames must retain 660px candidates");
    check(countMatches(files.html, /tutorial\d-1320\.png\s+1320w/gu) === 5, "All tutorial frames must retain 1320px candidates");
    check(countMatches(files.html, /\bdata-src="stories\/story6\/img\//gu) === 8, "Four mouse layers and four tutorial frames must stay request-staged");
    check(files.media.includes("prepareImagesSequentially"), "Story 6 media preparation must remain sequential");
    check(!files.media.includes("DEFAULT_PRELOAD_MARGIN = '300% 0px'"), "The former 300% tissue preload burst must stay removed");
}

/**
 * Verifies local Story 6 image references, including deferred data attributes ignored by the general link checker.
 *
 * @returns {Promise<void>} Resolves after every candidate path is checked
 */
async function checkLocalImageReferences() {
    const attributePattern = /\b(?:data-src|data-srcset|src|srcset)="([^"]+)"/giu;
    const references = new Set();

    for (const match of files.html.matchAll(attributePattern)) {
        for (const candidate of match[1].split(",")) {
            const reference = candidate.trim().split(/\s+/u)[0];

            if (reference.startsWith("stories/story6/img/")) {
                references.add(reference);
            }
        }
    }

    for (const reference of references) {
        try {
            await access(path.join(projectRoot, reference));
        } catch {
            issues.push(`Missing Story 6 image candidate: ${reference}`);
        }
    }
}

/**
 * Verifies the Story 6 binary inventory, including removed and reserved assets.
 *
 * @returns {Promise<void>} Resolves after each inventory path is checked
 */
async function checkAssetInventory() {
    const removed = ["CDE-Placeholder.png", "cells.webp"];
    const reserved = ["transition4-960.webp", "transition4-1920.webp", "transition4-3840.webp"];

    for (const filename of removed) {
        try {
            await access(path.join(projectRoot, "stories", "story6", "img", filename));
            issues.push(`Verified dead asset was reintroduced: stories/story6/img/${filename}`);
        } catch {
            // Absence is the expected state.
        }
    }

    for (const filename of reserved) {
        try {
            await access(path.join(projectRoot, "stories", "story6", "img", filename));
        } catch {
            issues.push(`Reserved Story 6 transition asset is missing: stories/story6/img/${filename}`);
        }
    }
}

/**
 * Checks unique IDs plus local fragment and ARIA ID references.
 *
 * @returns {void}
 */
function checkIdsAndReferences() {
    const ids = new Set();

    for (const match of files.html.matchAll(/\bid="([^"]+)"/gu)) {
        const id = match[1];
        check(!ids.has(id), `Duplicate Story 6 ID: ${id}`);
        ids.add(id);
    }

    const idReferencePattern = /\b(?:aria-controls|aria-describedby|aria-labelledby|aria-owns|for)="([^"]+)"/gu;

    for (const match of files.html.matchAll(idReferencePattern)) {
        for (const id of match[1].trim().split(/\s+/u)) {
            check(ids.has(id), `Unresolved Story 6 ARIA or label reference: ${id}`);
        }
    }

    for (const match of files.html.matchAll(/\bhref="#([^"]+)"/gu)) {
        check(ids.has(match[1]), `Unresolved Story 6 fragment link: #${match[1]}`);
    }
}

/**
 * Checks explicit Story 6 element nesting without attempting to emulate optional HTML closing rules.
 *
 * @returns {void}
 */
function checkElementNesting() {
    const voidElements = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
    const source = files.html
        .replace(/<!--[\s\S]*?-->/gu, "")
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, "");
    const stack = [];

    for (const match of source.matchAll(/<\/?([a-z][a-z\d-]*)\b[^>]*>/giu)) {
        const tag = match[1].toLowerCase();
        const token = match[0];

        if (token.startsWith("</")) {
            const expected = stack.pop();
            check(expected === tag, `Unexpected closing element </${tag}>; expected ${expected ? `</${expected}>` : "no closing element"}`);
        } else if (!voidElements.has(tag) && !token.endsWith("/>")) {
            stack.push(tag);
        }
    }

    check(stack.length === 0, `Unclosed Story 6 elements: ${stack.reverse().join(", ")}`);
}

/**
 * Counts non-overlapping regular-expression matches.
 *
 * @param {string} source Source text
 * @param {RegExp} pattern Global regular expression
 * @returns {number} Match count
 */
function countMatches(source, pattern) {
    return Array.from(source.matchAll(pattern)).length;
}

/**
 * Produces a compact image tag excerpt for a validation error.
 *
 * @param {string} tag Complete image tag
 * @returns {string} Single-line tag excerpt
 */
function summarizeTag(tag) {
    return tag.replace(/\s+/gu, " ").slice(0, 140);
}
