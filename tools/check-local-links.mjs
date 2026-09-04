#!/usr/bin/env node

import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const allowKnown = process.argv.includes("--allow-known");
// "fixtures" holds canonical chrome templates whose {{root}} placeholders are
// resolved per page by check-maintained-pages.mjs, not by a browser.
const ignoredDirectories = new Set([".agents", ".codex", ".git", "fixtures"]);
const scannableExtensions = new Set([".css", ".html"]);

// Remove an entry when its underlying reference is repaired or intentionally deleted.
const knownMissingReferences = new Set([
    "prototypes/scrollytelling-effects/index.html::images/char1.png",
]);

async function collectFiles(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
        if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
            continue;
        }

        const absolutePath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            files.push(...await collectFiles(absolutePath));
        } else if (scannableExtensions.has(path.extname(entry.name).toLowerCase())) {
            files.push(absolutePath);
        }
    }

    return files;
}

function extractHtmlReferences(source) {
    // `xlink:href` included so inline-SVG <image> references are checked too;
    // Story 4's illustration rasters are addressed that way.
    const attributePattern = /\b(?:xlink:)?(href|poster|src|srcset)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
    const references = [];
    let match;

    while ((match = attributePattern.exec(source)) !== null) {
        const attribute = match[1].toLowerCase();
        const value = match[2] ?? match[3] ?? "";

        if (attribute === "srcset" && !value.trim().startsWith("data:")) {
            for (const candidate of value.split(",")) {
                const url = candidate.trim().split(/\s+/u)[0];

                if (url) {
                    references.push(url);
                }
            }
        } else {
            references.push(value);
        }
    }

    return references;
}

function extractCssReferences(source) {
    const urlPattern = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)/gi;
    const references = [];
    let match;

    while ((match = urlPattern.exec(source)) !== null) {
        const value = (match[1] ?? match[2] ?? match[3] ?? "")
            .trim()
            .replaceAll("\\ ", " ");

        references.push(value);
    }

    return references;
}

function extractIds(source) {
    const idPattern = /\bid\s*=\s*(?:"([^"]+)"|'([^']+)')/gi;
    const ids = new Set();
    let match;

    while ((match = idPattern.exec(source)) !== null) {
        ids.add(match[1] ?? match[2]);
    }

    return ids;
}

function shouldIgnoreReference(reference) {
    return !reference
        || reference.startsWith("//")
        || /^(?:blob|data|javascript|mailto|tel):/iu.test(reference)
        || /^[a-z][a-z\d+.-]*:/iu.test(reference);
}

function decodePathname(pathname) {
    try {
        return decodeURIComponent(pathname);
    } catch {
        return pathname;
    }
}

async function resolveTarget(sourcePath, pathname) {
    const decodedPathname = decodePathname(pathname);
    const target = decodedPathname.startsWith("/")
        ? path.join(projectRoot, decodedPathname.slice(1))
        : path.resolve(path.dirname(sourcePath), decodedPathname);

    try {
        const targetStats = await stat(target);

        if (targetStats.isDirectory()) {
            return path.join(target, "index.html");
        }

        return target;
    } catch {
        return target;
    }
}

function relativePath(filePath) {
    return path.relative(projectRoot, filePath).split(path.sep).join("/");
}

const files = await collectFiles(projectRoot);
const htmlIds = new Map();
const issues = [];
let referenceCount = 0;

for (const file of files.filter((candidate) => path.extname(candidate) === ".html")) {
    const source = await readFile(file, "utf8");
    htmlIds.set(file, extractIds(source));
}

for (const file of files) {
    const extension = path.extname(file).toLowerCase();
    const source = await readFile(file, "utf8");
    const references = extension === ".html"
        ? extractHtmlReferences(source)
        : extractCssReferences(source);

    for (const reference of new Set(references)) {
        const trimmedReference = reference.trim();

        if (shouldIgnoreReference(trimmedReference)) {
            continue;
        }

        const [pathname, rawFragment = ""] = trimmedReference.split("#", 2);

        if (!pathname && extension === ".css") {
            continue;
        }

        referenceCount += 1;
        const target = pathname
            ? await resolveTarget(file, pathname.split("?")[0])
            : file;

        try {
            await stat(target);
        } catch {
            issues.push({
                kind: "missing-file",
                source: relativePath(file),
                reference: trimmedReference,
            });
            continue;
        }

        if (rawFragment && path.extname(target).toLowerCase() === ".html") {
            const targetSource = htmlIds.has(target)
                ? null
                : await readFile(target, "utf8");
            const targetIds = htmlIds.get(target) ?? extractIds(targetSource);
            htmlIds.set(target, targetIds);

            if (!targetIds.has(decodePathname(rawFragment))) {
                issues.push({
                    kind: "missing-fragment",
                    source: relativePath(file),
                    reference: trimmedReference,
                });
            }
        }
    }
}

const uniqueIssues = [
    ...new Map(
        issues.map((issue) => [
            `${issue.kind}::${issue.source}::${issue.reference}`,
            issue,
        ]),
    ).values(),
];

const unexpectedIssues = [];

for (const issue of uniqueIssues) {
    const baselineKey = `${issue.source}::${issue.reference.split("#", 1)[0]}`;
    const isKnownMissing = issue.kind === "missing-file"
        && knownMissingReferences.has(baselineKey);
    const label = isKnownMissing ? "KNOWN" : "ERROR";

    console.log(`${label} ${issue.kind}: ${issue.source} -> ${issue.reference}`);

    if (!isKnownMissing || !allowKnown) {
        unexpectedIssues.push(issue);
    }
}

console.log(
    `Checked ${files.length} HTML/CSS files and ${referenceCount} unique local references.`,
);

if (uniqueIssues.length === 0) {
    console.log("All checked local references resolve.");
} else if (allowKnown && unexpectedIssues.length === 0) {
    console.log("No new broken references were found beyond the documented baseline.");
}

if (unexpectedIssues.length > 0) {
    process.exitCode = 1;
}
