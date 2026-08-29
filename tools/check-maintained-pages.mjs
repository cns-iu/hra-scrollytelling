import { readFile } from "node:fs/promises";

const maintainedPages = [
    "index.html",
    "story1.html",
    "story2.html",
    "story3.html",
    "story4.html",
    "story5.html",
    "story6.html",
];

const knownDuplicateIds = {
    "story2.html": [
        "Combined-Shape:5", "Group-2:10", "Group-3:8", "Group-4:2", "Group-5:2",
        "Oval:23", "Rectangle:15", "Triangle:12", "branchoff:13",
    ],
    "story3.html": [
        "2scene1-(2):2", "Combined-Shape:13", "Group-17:2", "Group-2:4", "Group-3:4",
        "Group-5:3", "Group:2", "KissMe,I’mSquamous:2", "Layer_3:2", "Oval:53",
        "Page-1:2", "Path:5", "Rectangle:8", "Screenshot-2023-09-29-at-14.22.11:2",
        "filter-1:2", "filter-3:2", "filter-4:2", "path-2:2",
    ],
    "story4.html": [
        "Artboard:8", "Bitmap:4", "CenterLogo:6", "Digestive-System:2", "Group-2:10",
        "Group-3:9", "Group-4:7", "Group-5:3", "Group-6:2", "Group:14",
        "Ice-cream:2", "KidneyExtractionCode-(1):2", "Large-Intestine:2", "Left-Female-Kidney:7",
        "Line-10:2", "Line-12:10", "Line-2:13", "Line-9:18", "Line:24", "Oval:47",
        "Path:24", "Pure-data:2", "Rectangle-2:3", "Rectangle-3:3", "Rectangle:22",
        "Respiratory-System:2", "Shape:31", "Systempt3:2", "Systempt4:2", "Trachea:2",
        "Tuft-cell:3", "TypeLogos:3", "bg:3", "check-circle-fill:3", "closeuplinks3:2",
        "database:2", "hra-logo-with-text-black:6", "linearGradient-2:2", "located_in:4",
        "lock-fill:2", "lungs-fill-(1):3", "ok:10", "part_of:4", "pc-display-horizontal-(2):2",
        "person-fill:2", "radialGradient-1:4", "rect-1:2",
    ],
};

const errors = [];

/**
 * Removes comments so retired markup does not satisfy maintained-page checks.
 *
 * @param {string} html Page source
 * @returns {string} Page source without HTML comments
 */
function withoutComments(html) {
    return html.replace(/<!--[\s\S]*?-->/g, "");
}

/**
 * Returns every value assigned to an HTML attribute.
 *
 * @param {string} html Page source
 * @param {string} attribute Attribute name
 * @returns {string[]} Attribute values
 */
function attributeValues(html, attribute) {
    const pattern = new RegExp(`\\s${attribute}=["']([^"']+)["']`, "gi");
    return [...html.matchAll(pattern)].map((match) => match[1]);
}

/**
 * Records a failed maintained-page contract.
 *
 * @param {boolean} condition Whether the contract passed
 * @param {string} file Page being checked
 * @param {string} message Failure description
 * @returns {void}
 */
function assertPage(condition, file, message) {
    if (!condition) {
        errors.push(`${file}: ${message}`);
    }
}

/**
 * Verifies relative ordering for stylesheet URLs that a page consumes.
 *
 * @param {string} html Page source
 * @param {string} file Page name
 * @param {string[]} orderedUrls Stylesheets in required order
 * @returns {void}
 */
function checkStylesheetOrder(html, file, orderedUrls) {
    let previous = -1;

    orderedUrls.forEach((url) => {
        const position = html.indexOf(`href="${url}"`);
        assertPage(position >= 0, file, `missing stylesheet ${url}`);
        assertPage(position > previous, file, `stylesheet ${url} is out of order`);
        previous = position;
    });
}

/**
 * Produces the exact duplicate-ID signature used to guard known SVG debt.
 *
 * @param {string[]} ids Page ID values
 * @returns {string[]} Sorted ID-and-count entries
 */
function duplicateIdSignature(ids) {
    const counts = new Map();

    ids.forEach((id) => counts.set(id, (counts.get(id) ?? 0) + 1));
    return [...counts]
        .filter(([, count]) => count > 1)
        .map(([id, count]) => `${id}:${count}`)
        .sort();
}

/**
 * Checks one public entry point against shared structure and accessibility contracts.
 *
 * @param {string} file Page name
 * @param {string} source Raw page source
 * @returns {void}
 */
function checkPage(file, source) {
    const html = withoutComments(source);
    const ids = attributeValues(html, "id");
    const idSet = new Set(ids);
    const headings = [...html.matchAll(/<h([1-6])\b/gi)].map((match) => Number(match[1]));
    const description = html.match(/<meta\s+name=["']description["']\s+content="([^"]*)"/i);
    const actualDuplicates = duplicateIdSignature(ids);
    const expectedDuplicates = [...(knownDuplicateIds[file] ?? [])].sort();

    assertPage(description?.[1].trim().length > 0, file, "missing a non-empty meta description");
    assertPage(!/<meta\s+name=["']keywords["']/i.test(html), file, "contains obsolete keyword metadata");
    assertPage((html.match(/<h1\b/gi) ?? []).length === 1, file, "must contain exactly one h1");
    assertPage(headings[0] === 1, file, "the first heading must be h1");
    assertPage(idSet.has("main-content"), file, "missing #main-content");
    assertPage(/href=["']#main-content["']/.test(html), file, "missing the main-content skip link");
    assertPage(/class=["'][^"']*site-menu\b/.test(html), file, "missing the shared Menu");
    assertPage(/class=["'][^"']*site-footer\b/.test(html), file, "missing the shared footer");
    assertPage(!/\son(?:click|ended|load|scroll)=/i.test(html), file, "contains an inline event handler");
    assertPage(!/\b(?:ScrollMagic|botNav)\b/.test(html), file, "contains a retired runtime or component");
    assertPage(JSON.stringify(actualDuplicates) === JSON.stringify(expectedDuplicates), file, "duplicate-ID baseline changed");
    assertPage(html.lastIndexOf("<script") < html.indexOf("</body>"), file, "loads scripts outside the body");

    attributeValues(html, "aria-labelledby")
        .concat(attributeValues(html, "aria-describedby"), attributeValues(html, "aria-controls"))
        .flatMap((value) => value.split(/\s+/))
        .forEach((reference) => {
            assertPage(idSet.has(reference), file, `ARIA reference #${reference} does not resolve`);
        });

    [...html.matchAll(/href=["']#([^"']+)["']/gi)].forEach((match) => {
        assertPage(idSet.has(match[1]), file, `fragment #${match[1]} does not resolve`);
    });

    [...html.matchAll(/<a\b([^>]*\btarget=["']_blank["'][^>]*)>/gi)].forEach((match) => {
        const rel = match[1].match(/\brel=["']([^"']+)["']/i)?.[1] ?? "";
        assertPage(rel.includes("noopener") && rel.includes("noreferrer"), file, "new-tab link needs noopener noreferrer");
    });

    checkStylesheetOrder(html, file, [
        "shared/css/fonts.css",
        file === "index.html" ? "landing/css/tokens.css" : "shared/css/tokens.css",
        "shared/css/selection.css",
        "shared/css/navigation.css",
        "shared/css/footer.css",
    ]);

    if (/^story[1-6]\.html$/.test(file)) {
        assertPage(html.includes("shared/css/story-navigation.css"), file, "missing shared story navigation styles");
        assertPage(html.includes("site-story-navigation"), file, "missing shared story navigation markup");
        assertPage(html.includes("shared/css/story-end-matter.css"), file, "missing shared story end-matter styles");
        assertPage(html.includes("story-end-matter site-chrome"), file, "missing generated story end matter");
        assertPage(html.includes('id="resources-title"'), file, "missing the centered Resources section heading");
    }

    if (["story2.html", "story3.html", "story5.html"].includes(file)) {
        assertPage(/<html[^>]*\bstory-flowing\b/.test(html), file, "missing the linear-layout default");
        assertPage(html.includes("shared/js/narrative-motion.js"), file, "missing the narrative motion gate");
        assertPage(html.includes("story-chapter-heading"), file, "missing the narrative chapter heading");
        assertPage(html.includes(`stories/${file.replace(".html", "")}/animations.js`), file, "missing its story-owned animation runtime");
    }

    if (file === "story4.html") {
        assertPage(/<html[^>]*\bstory4-flowing\b/.test(html), file, "missing Story 4's linear-layout default");
        assertPage(html.includes("stories/story4/motion.js"), file, "missing Story 4's motion gate");
        assertPage(html.includes("data-story4-ambient-toggle"), file, "missing Story 4's ambient-animation control");
    }

    if (file === "story5.html") {
        assertPage((html.match(/data-story5-action=["']toggle["']/g) ?? []).length === 6, file, "must provide six video pause controls");
        assertPage((html.match(/<video\b[^>]*\bcontrols\b/gi) ?? []).length === 6, file, "must provide six no-JavaScript video controls");
        assertPage(!/<video\b[^>]*\bautoplay\b/i.test(html), file, "must not autoplay video before enhancement");
    }
}

for (const file of maintainedPages) {
    checkPage(file, await readFile(file, "utf8"));
}

const story4App = await readFile("stories/story4/app.js", "utf8");
const narrativeFoundation = await readFile("shared/css/narrative-foundation.css", "utf8");
const narrativeDialogue = await readFile("shared/css/character-dialogue.css", "utf8");
const narrativeAccessibility = await readFile("shared/css/narrative-accessibility.css", "utf8");
const narrativeMotion = await readFile("shared/js/narrative-motion.js", "utf8");
const story2Styles = await readFile("stories/story2/styles.css", "utf8");
const story3Styles = await readFile("stories/story3/styles.css", "utf8");
const story5Styles = await readFile("stories/story5/styles.css", "utf8");
const story5Animations = await readFile("stories/story5/animations.js", "utf8");
const story5MediaControls = await readFile("stories/story5/media-controls.js", "utf8");
assertPage(story4App.includes("window.hraStory4MotionEnabled"), "stories/story4/app.js", "particle initialization is not motion-gated");
assertPage(
    narrativeFoundation.includes("--narrative-type-body:") &&
        narrativeFoundation.includes("--narrative-type-dialogue:") &&
        narrativeFoundation.includes("--narrative-type-episode-title:"),
    "shared/css/narrative-foundation.css",
    "missing the shared semantic narrative typography roles",
);
assertPage(
    narrativeFoundation.includes("--narrative-viewport-height: 100svh"),
    "shared/css/narrative-foundation.css",
    "missing the stable mobile scene-height enhancement",
);
assertPage(
    narrativeDialogue.includes("font: var(--narrative-type-dialogue)"),
    "shared/css/character-dialogue.css",
    "dialogue does not consume the shared typography role",
);
assertPage(
    narrativeAccessibility.includes("font: var(--narrative-type-section-heading)"),
    "shared/css/narrative-accessibility.css",
    "flowing chapter headings do not consume the shared typography role",
);
assertPage(
    narrativeMotion.includes("autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'") &&
        narrativeMotion.includes("window.innerWidth === coarseViewportWidth") &&
        narrativeMotion.includes("!event.matches && !coarsePointer.matches") &&
        narrativeMotion.includes("if (!supportedViewport.matches)") &&
        narrativeMotion.includes("!window.gsap || !window.ScrollTrigger"),
    "shared/js/narrative-motion.js",
    "coarse-pointer scrolling can regress during browser-chrome changes or failed motion setup",
);
for (const [file, source] of [
    ["stories/story2/styles.css", story2Styles],
    ["stories/story3/styles.css", story3Styles],
    ["stories/story5/styles.css", story5Styles],
]) {
    assertPage(!/height:\s*100vh/u.test(source), file, "contains a browser-chrome-sensitive scene height");
}
assertPage(!/opacity:\s*100\b/u.test(story3Styles), "stories/story3/styles.css", "contains an invalid opacity value");
assertPage(!/\brepeatmovie\d\b/.test(story5Animations), "stories/story5/animations.js", "references a removed global video callback");
assertPage(story5Animations.includes("enableStory5FlowingFallback"), "stories/story5/animations.js", "missing its initialization fallback");
assertPage(story5MediaControls.includes("IntersectionObserver"), "stories/story5/media-controls.js", "video autoplay is not viewport-gated");

if (errors.length > 0) {
    console.error(`Maintained-page checks failed (${errors.length}):`);
    errors.forEach((error) => console.error(`- ${error}`));
    process.exitCode = 1;
} else {
    console.log(`Maintained-page checks passed for ${maintainedPages.length} pages.`);
}
