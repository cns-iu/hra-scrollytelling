#!/usr/bin/env node

import { access, readFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const storyPath = path.join(projectRoot, "story6.html");
const storyDirectory = path.join(projectRoot, "story", "6");
const storyImageDirectory = path.join(storyDirectory, "img");
const chartSvgNames = [
    "2m-cde-600x600.svg",
    "2m-violin-800x533.svg",
    "24m-violin-600x600.svg",
    "24m-violin-800x533.svg",
    "2m-histogram-640x560.svg",
    "2m-histogram-900x600.svg",
    "2m-histogram-1200x600.svg",
    "24m-histogram-640x560.svg",
    "24m-histogram-900x600.svg",
    "24m-histogram-1200x600.svg",
];
const files = {
    html: await readFile(storyPath, "utf8"),
    endMatter: JSON.parse(await readFile(path.join(storyDirectory, "end-matter.json"), "utf8")),
    entry: await readFile(path.join(storyDirectory, "story6.js"), "utf8"),
    animations: await readFile(path.join(storyDirectory, "js", "animations.js"), "utf8"),
    base: await readFile(path.join(storyDirectory, "css", "base.css"), "utf8"),
    cde: await readFile(path.join(storyDirectory, "css", "cde.css"), "utf8"),
    cdeComparison: await readFile(path.join(storyDirectory, "css", "cde-comparison.css"), "utf8"),
    layout: await readFile(path.join(storyDirectory, "js", "layout.js"), "utf8"),
    media: await readFile(path.join(storyDirectory, "js", "media.js"), "utf8"),
    narrative: await readFile(path.join(storyDirectory, "css", "narrative.css"), "utf8"),
    reveals: await readFile(path.join(storyDirectory, "js", "reveals.js"), "utf8"),
    splashTransitions: await readFile(path.join(storyDirectory, "css", "splash-transitions.css"), "utf8"),
    theme: await readFile(path.join(storyDirectory, "css", "theme.css"), "utf8"),
};
const chartSvgs = await Promise.all(
    chartSvgNames.map(async (name) => ({
        name,
        source: await readFile(path.join(storyImageDirectory, name), "utf8"),
    })),
);
const nunitoSansFont = await readFile(
    path.join(projectRoot, "shared", "assets", "fonts", "nunito-sans", "nunito-sans-latin-wght-normal.woff2"),
);
const issues = [];

checkMarkupContracts();
checkReaderViewOrder();
checkAnimationGeometry();
checkImagePolicy();
checkSvgTypography();
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
    check(files.html.includes('href="shared/css/story-end-matter.css"'), "Story 6 must load the shared end-matter stylesheet");
    check(files.html.includes('src="shared/js/story-end-matter.js"'), "Story 6 must load the shared end-matter runtime");
    check(files.html.includes('class="site-story-navigation site-chrome"'), "Story 6 must use the shared story-navigation component");
    check(
        files.html.includes('class="story-end-matter site-chrome" data-story-end-matter-source="story/6/end-matter.json"'),
        "Story 6 must use its story-owned runtime end-matter source",
    );
    check(!files.html.includes("story-end-matter__section"), "Story 6 must not duplicate JSON-authored end matter in HTML");
    check(!files.html.includes("sceneEnd"), "Legacy sceneEnd markup must stay removed");
    check(!files.html.includes("showpicture2"), "The unused showpicture2 hook must stay removed");
    check(!/\bet al\./iu.test(JSON.stringify(files.endMatter)), "Story 6 publication citations must retain their complete named bylines");
    check(
        /#main-content\s*>\s*:not\(\.story-end-matter\)\s+a\s*\{\s*color:\s*inherit;/u.test(files.base),
        "Story 6 in-text links must inherit the surrounding text color",
    );
    check(countMatches(files.html, /class="organ-comparison"/gu) === 3, "The tissue comparison must contain three organ cards");
    check(countMatches(files.html, /class="tissue-sample"/gu) === 9, "The tissue comparison must contain nine sample cards");
    check(countMatches(files.html, /class="tutorial-callout tutorial-callout--\d"/gu) === 5, "The CDE tutorial must contain five semantic steps");
    check(files.html.includes('href="story/6/css/cde-comparison.css"'), "Story 6 must load the CDE comparison stylesheet");
    check(countMatches(files.html, /class="cde-comparison__figure/gu) === 6, "The CDE comparison must contain six semantic figures");
    check(countMatches(files.html, /class="cell-type-legend/gu) === 2, "The network and histogram comparisons must each retain a shared legend");
    check(
        countMatches(files.html, /<li data-cell-type="endothelial">Endothelial<\/li>/gu) === 1 &&
            files.cdeComparison.includes('li[data-cell-type="endothelial"] { --cell-type-color: #ad584f; }'),
        "The node-distance legend must include the Endothelial cell type with its supplied color",
    );
    check(files.reveals.includes("setupCdeComparisonReveal()"), "The cell networks and legend must retain their coordinated viewport reveal");
    check(
        /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.cde-network-figure,[\s\S]*?\.cde-network-legend[\s\S]*?transition:\s*none\s*!important;/u.test(
            files.cdeComparison,
        ),
        "The CDE comparison reveal must expose static content when reduced motion is requested",
    );
    check(
        files.theme.includes("--hra-background: var(--story-color-page)") &&
            files.theme.includes("--hra-on-background: var(--story-color-text)") &&
            files.theme.includes("--hra-on-surface-variant: var(--story-color-text)") &&
            files.cdeComparison.includes("color: var(--hra-on-background)") &&
            files.cdeComparison.includes("color: var(--hra-on-surface-variant)") &&
            files.cdeComparison.includes("background: var(--hra-background)"),
        "The CDE comparison must use Story 6's scoped background, on-background, and on-surface-variant roles",
    );
    check(
        files.cdeComparison.includes("--cde-comparison-section-gap: clamp(7rem, 12vw, 12rem)") &&
            files.cdeComparison.includes("--cde-comparison-visual-gap: clamp(5rem, 10vw, 10rem)"),
        "The CDE comparison must retain breathing room between narrative and visualization groups",
    );
    check(
        countMatches(files.cdeComparison, /font:\s*var\(--hra-type-title-medium\);/gu) >= 2,
        "CDE visualization and legend titles must use shared Title Medium typography",
    );
    check(
        /font:\s*var\(--type-body-primary-weight\)\s+var\(--type-body-medium-size\)\s*\/\s*var\(--type-body-medium-line-height\)[\s\S]*?var\(--hra-font-plain\);/u.test(
            files.cdeComparison,
        ),
        "CDE legend labels must use shared Body Medium typography",
    );
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
        "Measuring distances between cells reveals how their spatial",
        "cde-comparison-title",
        "conclusion-title",
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
        /html:has\(body#six\)\s*\{\s*overflow-x:\s*clip;/u.test(files.base),
        "Story 6 must clip transformed illustration overflow at the root viewport",
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
        /\.cde-histogram-legend\s*\{[\s\S]*?position:\s*sticky;[\s\S]*?@media\s*\(max-width:\s*47\.999rem\)[\s\S]*?\.cde-histogram-legend\s*\{[\s\S]*?position:\s*static;/u.test(
            files.cdeComparison,
        ),
        "The histogram legend must be sticky above mobile and static on mobile",
    );
    check(
        files.cdeComparison.includes("margin-block-end: clamp(2rem, 2.5vw, 3rem)"),
        "The histogram legend must stop above the chart boundary at the final axis",
    );
    check(
        /\.cde-histogram-charts\s*\{[\s\S]*?grid-row:\s*1;[\s\S]*?\.cde-histogram-legend\s*\{[\s\S]*?grid-row:\s*2;/u.test(
            files.cdeComparison,
        ) &&
            /@media\s*\(max-width:\s*47\.999rem\)[\s\S]*?\.cell-type-legend h4\s*\{[\s\S]*?text-align:\s*center;/u.test(
                files.cdeComparison,
            ),
        "Mobile histograms must precede their centered legend title",
    );
    check(
        /\.body-outline\s*\{[\s\S]*?width:\s*auto;[\s\S]*?height:\s*100%;[\s\S]*?object-fit:\s*contain;/u.test(files.narrative),
        "Body artwork must retain height-driven, aspect-preserving sizing",
    );
    check(
        files.narrative.includes("aspect-ratio: 16 / 9") &&
            files.narrative.includes("pointer-events: none") &&
            /\.mouse-image\s*\{[\s\S]*?img\s*\{[\s\S]*?object-fit:\s*contain;/u.test(files.narrative),
        "The desktop mouse stage must preserve the complete artwork and leave narrative text selectable",
    );
    check(
        files.entry.includes("setupStoryImagePreparation();") && files.media.includes("await prepareImagesSequentially(images)"),
        "Mouse image preparation must stage and decode images without a downstream ScrollTrigger refresh",
    );
    check(
        files.entry.includes("const STORY_MOTION_QUERY = '(prefers-reduced-motion: no-preference)'") &&
            files.entry.includes("const STORY_HEIGHT_QUERY = '(min-height: 36rem)'") &&
            /coarsePointerQuery\.matches\s*\?\s*measureStableViewportHeight\(\)/u.test(files.entry),
        "Mobile animation eligibility must use the stable Story 6 viewport instead of browser chrome-sensitive height changes",
    );
    check(
        files.layout.includes("createSettledLayoutRefresh(ScrollTrigger)") &&
            files.layout.includes("if (isScrolling || refreshRunning || pendingResolvers.length === 0)") &&
            /window\.addEventListener\(\s*'scroll',[\s\S]*?\{ passive: true \}/u.test(files.layout),
        "ScrollTrigger refreshes must wait until active scrolling settles before rebuilding pin spacers",
    );
    check(
        files.html.includes('root.classList.add("story6-loading")') &&
            files.html.includes('root.classList.add("story6-ready")') &&
            files.entry.includes("void revealStoryWhenReady(refreshStoryLayout)") &&
            files.entry.includes("await Promise.allSettled(preparation)") &&
            /html\.story6-loading #six::before\s*\{[\s\S]*?transition:\s*opacity 1250ms/u.test(files.base),
        "Story 6 must retain its fail-safe page-color loading overlay and settled fade-in",
    );
    check(
        /class="transition transition5[\s\S]*?class="transition__stage"/u.test(files.html) &&
            files.animations.includes("createTextboxTransition(gsap, '.transition5')") &&
            /@media\s*\(hover:\s*none\)\s*and\s*\(pointer:\s*coarse\)[\s\S]*?&\.story-animations-enabled section\.transition[\s\S]*?height:\s*calc\(var\(--story-viewport-height\) \* 3\.4\);[\s\S]*?\.transition__stage\s*\{[\s\S]*?position:\s*sticky;/u.test(
                files.splashTransitions,
            ),
        "The mobile conclusion must use an intrinsic native-sticky scene instead of a fixed ScrollTrigger pin",
    );
    check(
        files.animations.includes("function createResponsiveSceneTrigger(") &&
            !files.animations.includes("nativeStickyOnTouch") &&
            files.animations.includes("createResponsiveSceneTrigger('.page-header-scene', '+=325%')") &&
            files.animations.includes("createResponsiveSceneTrigger('.section2', '+=250%')") &&
            files.animations.includes("createResponsiveSceneTrigger('.section3', '+=500%')"),
        "Every scroll-driven Story 6 scene must resolve its ScrollTrigger through createResponsiveSceneTrigger so coarse pointers stay on one native-sticky mechanism end to end",
    );
    check(
        /class="page-header-scene"[\s\S]*?class="page-header /u.test(files.html) &&
            /@media\s*\(hover:\s*none\)\s*and\s*\(pointer:\s*coarse\)[\s\S]*?&\.story-animations-enabled \.page-header-scene\s*\{[\s\S]*?height:\s*calc\(var\(--story-viewport-height\) \* 4\.25\);[\s\S]*?&\.story-animations-enabled \.page-header-scene \.page-header\s*\{[\s\S]*?position:\s*sticky;/u.test(
                files.splashTransitions,
            ),
        "The splash header must use an intrinsic native-sticky scene on coarse pointers instead of a fixed ScrollTrigger pin",
    );
    check(
        /@media\s*\(hover:\s*none\)\s*and\s*\(pointer:\s*coarse\)[\s\S]*?&\.story-animations-enabled section\.section2\s*\{[\s\S]*?height:\s*calc\(var\(--story-viewport-height\) \* 3\.5\);[\s\S]*?&\.story-animations-enabled section\.section3\s*\{[\s\S]*?height:\s*calc\(var\(--story-viewport-height\) \* 6\);[\s\S]*?position:\s*sticky;/u.test(
            files.narrative,
        ),
        "The cell-introduction and mouse scenes must use an intrinsic native-sticky stage on coarse pointers instead of a fixed ScrollTrigger pin",
    );
    check(
        files.media.includes("setupConclusionImagePreparation()") &&
            files.media.includes("document.querySelector('.cde-histogram-comparison')") &&
            files.media.includes("document.querySelectorAll('.transition5 .transition__background')"),
        "The conclusion artwork must begin decoding from the preceding histogram comparison",
    );
    check(
        /\.tutorial\s*\{[\s\S]*?opacity:\s*0;[\s\S]*?visibility:\s*hidden;[\s\S]*?\.tutorial1\s*\{[\s\S]*?opacity:\s*1;[\s\S]*?visibility:\s*visible;/u.test(
            files.cde,
        ),
        "The CDE tutorial must expose only its starter screenshot before its timeline begins",
    );
    check(!/textbox[^\n]*autoAlpha|autoAlpha[^\n]*textbox/iu.test(files.animations), "Semantic transition text must not use autoAlpha");

    for (const selector of [".page-header", ".section2", ".section3", ".transition1", ".transition2", ".transition3", ".section5", ".transition4", ".transition5"]) {
        check(files.html.includes(selector.slice(1)), `Animation selector has no matching Story 6 markup: ${selector}`);
    }
}

/**
 * Checks responsive image candidates, staged requests, and loading metadata.
 *
 * @returns {void}
 */
function checkImagePolicy() {
    const storyImages = Array.from(files.html.matchAll(/<img\b[^>]*(?:src|data-src)="story\/6\/img\/[^>]*>/giu), (match) => match[0]);

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
    check(countMatches(files.html, /cell-distance-vis-(?:560|800)\.png\s+(?:560|800)w/gu) === 4, "Both cell networks must retain 560px and 800px candidates");
    check(countMatches(files.html, /histogram-(?:640x560|900x600|1200x600)\.svg/gu) === 6, "Both histograms must retain all three responsive layouts");
    check(countMatches(files.html, /\bdata-src="story\/6\/img\//gu) === 8, "Four mouse layers and four tutorial frames must stay request-staged");
    check(files.media.includes("prepareImagesSequentially"), "Story 6 media preparation must remain sequential");
    check(!files.media.includes("DEFAULT_PRELOAD_MARGIN = '300% 0px'"), "The former 300% tissue preload burst must stay removed");
}

/**
 * Checks that responsive chart SVGs load Nunito Sans and retain shared axis typography.
 *
 * @returns {void}
 */
function checkSvgTypography() {
    for (const { name, source } of chartSvgs) {
        const bodyValueCount = name.includes('histogram') ? 21 : 19;
        const embeddedFont = source.match(/src: url\("data:font\/woff2;base64,([^"]+)"\) format\("woff2-variations"\)/u);

        check(Boolean(embeddedFont), `${name} must embed the shared Nunito Sans font for external-image rendering`);

        if (embeddedFont) {
            check(
                Buffer.from(embeddedFont[1], 'base64').equals(nunitoSansFont),
                `${name} embedded Nunito Sans data must match the shared font source`,
            );
        }

        check(
            !source.includes('../../../shared/assets/fonts/'),
            `${name} must not depend on an external font request from SVG image context`,
        );
        check(
            countMatches(
                source,
                /font-family="Nunito Sans Variable, sans-serif" font-size="12" font-weight="400" letter-spacing="0\.4px"/gu,
            ) === bodyValueCount,
            `${name} axis values must use 12px Body Small typography`,
        );
        check(
            countMatches(
                source,
                /font-family="Nunito Sans Variable, sans-serif" font-size="14" font-weight="500" letter-spacing="0\.5px"/gu,
            ) === 2,
            `${name} axis titles must use 14px Label Medium typography`,
        );
        check(!source.includes('font-family="Nunito Sans"'), `${name} must not depend on an unavailable local Nunito Sans face`);
    }
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

            if (reference.startsWith("story/6/img/")) {
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
 * Verifies the Story 6 binary inventory, including removed and required assets.
 *
 * @returns {Promise<void>} Resolves after each inventory path is checked
 */
async function checkAssetInventory() {
    const removed = ["CDE-Placeholder.png", "cells.webp"];
    const required = ["transition4-960.webp", "transition4-1920.webp", "transition4-3840.webp"];

    for (const filename of removed) {
        try {
            await access(path.join(storyImageDirectory, filename));
            issues.push(`Verified dead asset was reintroduced: story/6/img/${filename}`);
        } catch {
            // Absence is the expected state.
        }
    }

    for (const filename of required) {
        try {
            await access(path.join(storyImageDirectory, filename));
        } catch {
            issues.push(`Required Story 6 transition asset is missing: story/6/img/${filename}`);
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
