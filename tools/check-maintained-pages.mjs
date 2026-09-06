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


/*
 * Canonical page chrome.
 *
 * The menu, footer and appearance controls are copied into every maintained
 * page by hand, and they had already drifted - modifier classes on some pages,
 * a self-closed <path> on another. Rather than add a build step, each block is
 * stored once under shared/fixtures/ and asserted here.
 *
 * Two differences are legitimate and normalised away before comparison:
 * the page's path back to the repository root, and the aria-current marker on
 * whichever navigation item is active.
 *
 * The appearance and contrast fieldsets live inside the Menu, so they are sliced
 * out of menu.html rather than stored again beside it. `derivedFrom` marks those:
 * one copy on disk, asserted on its own so a drifting fieldset names itself.
 */
const chromeBlocks = [
    { fixture: "menu.html", open: '<details class="site-menu', close: "</details>" },
    { fixture: "footer.html", open: '<footer class="site-footer', close: "</footer>" },
    { fixture: "appearance.html", open: '<fieldset class="site-appearance">', close: "</fieldset>", derivedFrom: "menu.html" },
    { fixture: "contrast.html", open: '<fieldset class="site-accessibility"', close: "</fieldset>", derivedFrom: "menu.html" },
];

/**
 * Extracts one chrome block from a page.
 *
 * @param {string} html Page source
 * @param {object} block Chrome block descriptor
 * @returns {string|null} Block source, or null when the page lacks it
 */
function extractBlock(html, block) {
    const start = html.indexOf(block.open);

    if (start < 0) {
        return null;
    }

    const end = html.indexOf(block.close, start);

    return end < 0 ? null : html.slice(start, end + block.close.length);
}

/**
 * Reduces a chrome block to a comparable form.
 *
 * The formatter re-wraps the surrounding tags whenever the aria-current marker
 * moves to a different navigation item, so comparison ignores whitespace
 * between and inside tags. Attribute values and element order are still
 * compared exactly. The marker itself is dropped because it legitimately
 * differs per page.
 *
 * @param {string} source Block source
 * @returns {string} Comparable block
 */
function normalizeChrome(source) {
    return source
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/\s*aria-current="page"/g, "")
        .replace(/\s+/g, " ")
        .replace(/\s+>/g, ">")
        .replace(/>\s+</g, "><")
        .trim();
}

/**
 * Renders a fixture for one page by resolving its root-relative placeholder.
 *
 * @param {string} source Fixture source
 * @param {string} root The page's relative path back to the repository root
 * @returns {string} Comparable block for that page
 */
function renderFixture(source, root) {
    return normalizeChrome(source.split("{{root}}").join(root));
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

    // The appearance bootstrap must stay a shared blocking script ahead of the
    // stylesheets; inlining it again would reintroduce seven copies to maintain.
    const bootstrapRef = relativeRef(file, "shared/js/theme-bootstrap.js");
    const bootstrapAt = html.indexOf(`<script src="${bootstrapRef}"></script>`);

    assertPage(bootstrapAt >= 0, file, `must load ${bootstrapRef} as a blocking script`);
    assertPage(!html.includes("localStorage.getItem(\"hra-landing-theme\")"), file, "inlines the appearance bootstrap instead of loading the shared script");

    if (bootstrapAt >= 0) {
        const firstStylesheet = html.indexOf("<link rel=\"stylesheet\"");

        assertPage(firstStylesheet < 0 || bootstrapAt < firstStylesheet, file, "the appearance bootstrap must precede the stylesheets");
    }

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

    /*
     * The full shared preamble, in load order. It had been asserted five deep,
     * which let component-roles.css reach only two of the seven pages; the
     * shared components then needed var(--role, fallback) workarounds, and one
     * story shipped a hard-coded radius its token could never reach.
     *
     * component-roles.css maps tokens.css to semantic roles, so it follows the
     * palette and precedes every component that consumes one.
     */
    checkStylesheetOrder(html, file, [
        "shared/css/fonts.css",
        entry.tokensUrl,
        "shared/css/component-roles.css",
        "shared/css/buttons.css",
        "shared/css/numbers.css",
        "shared/css/selection.css",
        "shared/css/navigation.css",
        "shared/css/appearance-controls.css",
        "shared/css/footer.css",
    ].map((url) => relativeRef(file, url)));

    if (story?.narrative) {
        /*
         * The narrative stories layer the shared foundation and dialogue on
         * top, and close with narrative-accessibility.css, whose rules are
         * scoped to html.story-flowing and carry !important: it has to win over
         * the story's own presentation, so it stays the final stylesheet.
         */
        checkStylesheetOrder(html, file, [
            "shared/css/narrative-foundation.css",
            "shared/css/character-dialogue.css",
        ].map((url) => relativeRef(file, url)));

        const accessibility = relativeRef(file, "shared/css/narrative-accessibility.css");
        const stylesheets = [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map((match) => match[1]);

        assertPage(
            stylesheets.at(-1) === accessibility,
            file,
            `${accessibility} must be the last stylesheet so its linear-layout rules win`,
        );
    }

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

const fixtures = {};

for (const block of chromeBlocks.filter((candidate) => !candidate.derivedFrom)) {
    fixtures[block.fixture] = await readSource(joinPath("shared/fixtures", block.fixture));
}

for (const block of chromeBlocks.filter((candidate) => candidate.derivedFrom)) {
    const parent = fixtures[block.derivedFrom];
    const slice = parent === undefined ? null : extractBlock(parent, block);

    if (slice === null) {
        errors.push(`shared/fixtures/${block.derivedFrom} no longer contains the ${block.fixture} block`);
    }

    fixtures[block.fixture] = slice ?? "";
}


/**
 * Asserts a page carries the canonical chrome verbatim.
 *
 * @param {object} entry Maintained-page manifest entry
 * @param {string} source Raw page source
 * @returns {void}
 */
function checkChrome(entry, source) {
    const depth = entry.page.split("/").length - 1;
    const root = "../".repeat(depth);

    chromeBlocks.forEach((block) => {
        const found = extractBlock(source, block);

        if (found === null) {
            assertPage(false, entry.page, `missing the shared ${block.fixture.replace(".html", "")} chrome`);
            return;
        }

        assertPage(
            normalizeChrome(found) === renderFixture(fixtures[block.fixture], root),
            entry.page,
            `${block.fixture.replace(".html", "")} chrome has drifted from shared/fixtures/${block.derivedFrom ?? block.fixture}`,
        );
    });
}

for (const entry of maintainedPages) {
    const source = await readSource(entry.page);

    checkPage(entry, source);
    checkChrome(entry, source);
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
const story4Entry = storyJs(storyByNumber.get(4), "story4.js");
const story5Animations = storyJs(storyByNumber.get(5), "animations.js");
const story5MediaControls = storyJs(storyByNumber.get(5), "media-controls.js");
const story4EntrySource = await readSource(story4Entry);
const storyEndMatterRuntime = await readFile("shared/js/story-end-matter.js", "utf8");
const narrativeFoundation = await readFile("shared/css/narrative-foundation.css", "utf8");
const narrativeDialogue = await readFile("shared/css/character-dialogue.css", "utf8");
const narrativeAccessibility = await readFile("shared/css/narrative-accessibility.css", "utf8");
const narrativeMotion = await readFile("shared/js/narrative-motion.js", "utf8");
const motionPreferences = await readFile("shared/js/motion-preferences.js", "utf8");
const story3Styles = await readSource(storyCss(storyByNumber.get(3), "styles.css"));
const story5AnimationsSource = await readSource(story5Animations);
const story5MediaControlsSource = await readSource(story5MediaControls);
assertPage(
    story4EntrySource.includes("window.hraStory4MotionEnabled") &&
        story4EntrySource.includes("setupParticles"),
    story4Entry,
    "Story 4's entry point does not motion-gate its scroll and particle setup",
);
/*
 * The intro columns are pinned by ScrollTrigger. A pinned element sized as a
 * percentage and centred with auto margins makes the pin-spacer copy the
 * resolved margin and add its own inset offset, so the same centring is counted
 * twice and the splash sits off centre on phones. Two rules keep that from
 * returning: the timeline pins the full-width parent, and the episode-block
 * children stay border-box so their padding and accent border cannot push the
 * page into horizontal scroll.
 */
const narrativeTimelineSource = await readFile("shared/js/narrative-timeline.js", "utf8");

assertPage(
    !/trigger:\s*container2,[\s\S]{0,600}?pin:\s*true\b/.test(narrativeTimelineSource) &&
        !/trigger:\s*container,[\s\S]{0,600}?pin:\s*true\b/.test(narrativeTimelineSource),
    "shared/js/narrative-timeline.js",
    "pin the full-width parent, not the centred .container/.container2, or the pinned splash goes off centre",
);
assertPage(
    /\.introline > :where\(p, h1\) \{[^}]*box-sizing: border-box/.test(narrativeFoundation),
    "shared/css/narrative-foundation.css",
    "the episode block children must stay border-box so their padding cannot overflow the viewport",
);

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
    motionPreferences.includes("autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'") &&
        motionPreferences.includes("window.innerWidth === coarseViewportWidth") &&
        motionPreferences.includes("if (!supportedViewport.matches)"),
    "shared/js/motion-preferences.js",
    "coarse-pointer scrolling can regress during browser-chrome changes",
);
assertPage(
    narrativeMotion.includes("!event.matches && !coarsePointer.matches") &&
        narrativeMotion.includes("!window.gsap || !window.ScrollTrigger") &&
        narrativeMotion.includes("stabilizeScrollGeometry"),
    "shared/js/narrative-motion.js",
    "narrative motion can regress when setup fails or the viewport becomes unsupported",
);
assertPage(
    (await readSource(storyJs(storyByNumber.get(4), "motion.js"))).includes("stabilizeScrollGeometry"),
    storyJs(storyByNumber.get(4), "motion.js"),
    "Story 4 does not stabilize coarse-pointer scroll geometry",
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
