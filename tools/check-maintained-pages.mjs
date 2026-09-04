import { readFile } from "node:fs/promises";
import path from "node:path";
import { validateEndMatter } from "../shared/js/story-end-matter-schema.mjs";

/*
 * Story layout manifest.
 *
 * Every page and asset path in this file is derived from these entries, so a
 * story that moves only needs its `page`, `dir`, `cssDir` and `jsDir` updated
 * here. `narrative` marks the stories that consume the shared narrative motion
 * gate and chapter headings.
 */
const stories = [
    { n: 1, page: "story/1/index.html", dir: "story/1", cssDir: "css", jsDir: "js" },
    { n: 2, page: "story/2/index.html", dir: "story/2", cssDir: "css", jsDir: "js", narrative: true },
    { n: 3, page: "story/3/index.html", dir: "story/3", cssDir: "css", jsDir: "js", narrative: true },
    { n: 4, page: "story/4/index.html", dir: "story/4", cssDir: "css", jsDir: "js" },
    { n: 5, page: "story/5/index.html", dir: "story/5", cssDir: "css", jsDir: "js", narrative: true },
    { n: 6, page: "story/6/index.html", dir: "story/6", cssDir: "css", jsDir: "js" },
];

const maintainedPages = [
    { page: "index.html", tokensUrl: "landing/css/tokens.css" },
    ...stories.map((story) => ({ page: story.page, tokensUrl: "shared/css/tokens.css", story })),
];

const knownDuplicateIds = {
    2: [
        "Combined-Shape:5", "Group-2:10", "Group-3:8", "Group-4:2", "Group-5:2",
        "Oval:23", "Rectangle:15", "Triangle:12", "branchoff:13",
    ],
    3: [
        "2scene1-(2):2", "Combined-Shape:13", "Group-17:2", "Group-2:4", "Group-3:4",
        "Group-5:3", "Group:2", "KissMe,I’mSquamous:2", "Layer_3:2", "Oval:53",
        "Page-1:2", "Path:5", "Rectangle:8", "Screenshot-2023-09-29-at-14.22.11:2",
        "filter-1:2", "filter-3:2", "filter-4:2", "path-2:2",
    ],
    4: [
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
 * Joins repository-relative path segments, ignoring empty ones.
 *
 * @param {...string} segments Path segments
 * @returns {string} Repository-relative path
 */
function joinPath(...segments) {
    return path.posix.join(...segments.filter((segment) => segment !== ""));
}

/**
 * Rewrites a repository-relative path as the page itself would reference it.
 *
 * @param {string} page Repository-relative page path
 * @param {string} target Repository-relative target path
 * @returns {string} Reference as it appears in the page source
 */
function relativeRef(page, target) {
    return path.posix.relative(path.posix.dirname(page), target);
}

/**
 * Resolves a story-owned stylesheet path.
 *
 * @param {object} story Story manifest entry
 * @param {string} name Stylesheet file name
 * @returns {string} Repository-relative path
 */
function storyCss(story, name) {
    return joinPath(story.dir, story.cssDir, name);
}

/**
 * Resolves a story-owned script path.
 *
 * @param {object} story Story manifest entry
 * @param {string} name Script file name
 * @returns {string} Repository-relative path
 */
function storyJs(story, name) {
    return joinPath(story.dir, story.jsDir, name);
}

/**
 * Resolves a story's end-matter document.
 *
 * @param {object} story Story manifest entry
 * @returns {string} Repository-relative path
 */
function storyEndMatter(story) {
    return joinPath(story.dir, "end-matter.json");
}

/**
 * Reads a repository file, recording a readable failure when it is missing.
 *
 * Story-owned paths are derived from the manifest, so a stale manifest entry
 * must report which contract lost its file rather than crashing on ENOENT.
 *
 * @param {string} file Repository-relative path
 * @returns {Promise<string>} File contents, or an empty string when missing
 */
async function readSource(file) {
    try {
        return await readFile(file, "utf8");
    } catch (error) {
        errors.push(`${file}: cannot be read (${error.code ?? error.message})`);
        return "";
    }
}

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
 * @param {object} entry Maintained-page manifest entry
 * @param {string} source Raw page source
 * @returns {void}
 */
function checkPage(entry, source) {
    const { page: file, story } = entry;
    const html = withoutComments(source);
    const ids = attributeValues(html, "id");
    const idSet = new Set(ids);
    const headings = [...html.matchAll(/<h([1-6])\b/gi)].map((match) => Number(match[1]));
    const description = html.match(/<meta\s+name=["']description["']\s+content="([^"]*)"/i);
    const actualDuplicates = duplicateIdSignature(ids);
    const expectedDuplicates = [...(knownDuplicateIds[story?.n] ?? [])].sort();

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
        entry.tokensUrl,
        "shared/css/selection.css",
        "shared/css/navigation.css",
        "shared/css/footer.css",
    ].map((url) => relativeRef(file, url)));

    if (story) {
        const endMatterSource = relativeRef(file, storyEndMatter(story));

        assertPage(html.includes(relativeRef(file, "shared/css/story-navigation.css")), file, "missing shared story navigation styles");
        assertPage(html.includes("site-story-navigation"), file, "missing shared story navigation markup");
        assertPage(html.includes(relativeRef(file, "shared/css/story-end-matter.css")), file, "missing shared story end-matter styles");
        assertPage(html.includes(relativeRef(file, "shared/js/story-end-matter.js")), file, "missing shared story end-matter runtime");
        assertPage(
            (html.match(/data-story-end-matter-source=/g) ?? []).length === 1,
            file,
            "must provide exactly one story end-matter placeholder",
        );
        assertPage(
            html.includes(`data-story-end-matter-source="${endMatterSource}"`),
            file,
            `end-matter placeholder must reference ${endMatterSource}`,
        );
        assertPage(html.includes("story-end-matter site-chrome"), file, "missing shared story end-matter surface");
        assertPage(!html.includes("story-end-matter__section"), file, "contains duplicated generated end-matter content");
    }

    if (story?.narrative) {
        assertPage(/<html[^>]*\bstory-flowing\b/.test(html), file, "missing the linear-layout default");
        assertPage(html.includes(relativeRef(file, "shared/js/narrative-motion.js")), file, "missing the narrative motion gate");
        assertPage(html.includes("story-chapter-heading"), file, "missing the narrative chapter heading");
        assertPage(html.includes(relativeRef(file, storyJs(story, "animations.js"))), file, "missing its story-owned animation runtime");
    }

    if (story?.n === 4) {
        assertPage(/<html[^>]*\bstory4-flowing\b/.test(html), file, "missing Story 4's linear-layout default");
        assertPage(html.includes(relativeRef(file, storyJs(story, "motion.js"))), file, "missing Story 4's motion gate");
        assertPage(html.includes("data-story4-ambient-toggle"), file, "missing Story 4's ambient-animation control");
    }

    if (story?.n === 5) {
        assertPage((html.match(/data-story5-action=["']toggle["']/g) ?? []).length === 6, file, "must provide six video pause controls");
        assertPage((html.match(/<video\b[^>]*\bcontrols\b/gi) ?? []).length === 6, file, "must provide six no-JavaScript video controls");
        assertPage(!/<video\b[^>]*\bautoplay\b/i.test(html), file, "must not autoplay video before enhancement");
    }
}

for (const entry of maintainedPages) {
    checkPage(entry, await readSource(entry.page));
}

for (const story of stories) {
    const source = storyEndMatter(story);

    try {
        const data = JSON.parse(await readFile(source, "utf8"));
        const issues = validateEndMatter(data);

        issues.forEach((issue) => assertPage(false, source, issue));
    } catch (error) {
        assertPage(false, story.page, `cannot read ${source}: ${error.message}`);
    }
}

const storyByNumber = new Map(stories.map((story) => [story.n, story]));
const story4App = storyJs(storyByNumber.get(4), "app.js");
const story5Animations = storyJs(storyByNumber.get(5), "animations.js");
const story5MediaControls = storyJs(storyByNumber.get(5), "media-controls.js");
const story4AppSource = await readSource(story4App);
const storyEndMatterRuntime = await readFile("shared/js/story-end-matter.js", "utf8");
const narrativeFoundation = await readFile("shared/css/narrative-foundation.css", "utf8");
const narrativeDialogue = await readFile("shared/css/character-dialogue.css", "utf8");
const narrativeAccessibility = await readFile("shared/css/narrative-accessibility.css", "utf8");
const narrativeMotion = await readFile("shared/js/narrative-motion.js", "utf8");
const story3Styles = await readSource(storyCss(storyByNumber.get(3), "styles.css"));
const story5AnimationsSource = await readSource(story5Animations);
const story5MediaControlsSource = await readSource(story5MediaControls);
assertPage(story4AppSource.includes("window.hraStory4MotionEnabled"), story4App, "particle initialization is not motion-gated");
assertPage(
    storyEndMatterRuntime.includes("validateEndMatter") &&
        storyEndMatterRuntime.includes("fetch(source") &&
        storyEndMatterRuntime.includes("document.createElement") &&
        !storyEndMatterRuntime.includes("innerHTML"),
    "shared/js/story-end-matter.js",
    "runtime must validate and render story-owned JSON without HTML-string injection",
);
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
for (const story of stories.filter((entry) => entry.narrative)) {
    const file = storyCss(story, "styles.css");

    assertPage(!/height:\s*100vh/u.test(await readSource(file)), file, "contains a browser-chrome-sensitive scene height");
}
assertPage(!/opacity:\s*100\b/u.test(story3Styles), storyCss(storyByNumber.get(3), "styles.css"), "contains an invalid opacity value");
assertPage(!/\brepeatmovie\d\b/.test(story5AnimationsSource), story5Animations, "references a removed global video callback");
assertPage(story5AnimationsSource.includes("enableStory5FlowingFallback"), story5Animations, "missing its initialization fallback");
assertPage(story5MediaControlsSource.includes("IntersectionObserver"), story5MediaControls, "video autoplay is not viewport-gated");

if (errors.length > 0) {
    console.error(`Maintained-page checks failed (${errors.length}):`);
    errors.forEach((error) => console.error(`- ${error}`));
    process.exitCode = 1;
} else {
    console.log(`Maintained-page checks passed for ${maintainedPages.length} pages.`);
}
