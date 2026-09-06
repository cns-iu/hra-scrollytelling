#!/usr/bin/env node

/*
 * Re-encodes Story 4's raster artwork as WebP and repoints the markup at it.
 *
 * WebP roughly halves these files: 4.18 MB of PNG becomes about 1.87 MB at
 * quality 0.9, with alpha preserved exactly - 17 of the 22 sources have a
 * transparency channel, and a round-trip check found zero difference in the
 * alpha plane.
 *
 * AVIF would be smaller still, but `canvas.toDataURL("image/avif")` silently
 * returns a PNG rather than failing, so building on it would ship mislabelled
 * files. WebP is what this toolchain can actually encode.
 *
 * The browser is the encoder, following tools/generate-story6-splash.mjs: no npm
 * dependencies and no image binaries are assumed, so pass a Chromium-compatible
 * executable with --browser=/path/to/browser.
 *
 * Sources are kept. They are the master copies the WebP is derived from, and
 * regenerating from a lossy file would compound the loss.
 */

import { createServer } from "node:http";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import { renderDocument, toBrowserPath, resolveBrowserPath } from "./browser-render.mjs";

const QUALITY = 0.9;
const browserPath = resolveBrowserPath(process.argv);
const projectRoot = process.cwd();
const imageDirectory = path.join(projectRoot, "story", "4", "images");
const markupPath = path.join(projectRoot, "story", "4", "index.html");
const markup = await readFile(markupPath, "utf8");
const sources = (await readdir(imageDirectory))
    .filter((name) => name.endsWith(".png") && markup.includes(`images/${name}`))
    .sort();

if (sources.length === 0) {
    throw new Error("No referenced PNG sources found");
}

let pending = null;
const server = createServer(async (request, response) => {
    if (!pending) {
        response.writeHead(404).end("Nothing to encode");
        return;
    }

    response.writeHead(200, {
        "Cache-Control": "no-store",
        "Content-Type": "text/html; charset=utf-8",
    });
    response.end(`<!doctype html>
<html lang="en">
<body>
<img id="source" alt="" src="data:image/png;base64,${pending}">
<script>
    /*
     * Encodes on the image's load event rather than awaiting decode(): the
     * browser is driven with --virtual-time-budget and --dump-dom, which does
     * not wait on a promise chain, so an async encode raced the dump.
     */
    (function () {
        var image = document.getElementById("source");

        function render() {
            var canvas = document.createElement("canvas");

            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            canvas.getContext("2d").drawImage(image, 0, 0);
            image.remove();
            document.body.textContent = "story4-output:" + canvas.toDataURL("image/webp", ${QUALITY});
        }

        image.addEventListener("load", render, { once: true });

        if (image.complete) {
            render();
        }
    })();
</script>
</body>
</html>`);
});

await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "0.0.0.0", resolve);
});

const address = server.address();

if (!address || typeof address === "string") {
    throw new Error("Could not determine the local rendering server port");
}

const profileDirectory = await mkdtemp(path.join(tmpdir(), "story4-browser-"));
const converted = [];
let sourceBytes = 0;
let outputBytes = 0;

try {
    for (const name of sources) {
        const source = await readFile(path.join(imageDirectory, name));

        pending = source.toString("base64");

        const html = await renderDocument(
            browserPath,
            toBrowserPath(profileDirectory, browserPath),
            `http://localhost:${address.port}/`,
        );
        const match = html.match(/story4-output:data:image\/webp;base64,([a-z\d+/=]+)/iu);

        if (!match) {
            throw new Error(`Browser did not return WebP for ${name}: ${html.slice(-300)}`);
        }

        const encoded = Buffer.from(match[1], "base64");

        /* A WebP larger than its source would be a pointless extra request. */
        if (encoded.length >= source.length) {
            console.log(`keep ${name} — WebP is larger (${sizeOf(source)} -> ${sizeOf(encoded)})`);
            continue;
        }

        const output = name.replace(/\.png$/u, ".webp");

        await writeFile(path.join(imageDirectory, output), encoded);
        converted.push([name, output]);
        sourceBytes += source.length;
        outputBytes += encoded.length;
        console.log(`${name} -> ${output}  ${sizeOf(source)} -> ${sizeOf(encoded)}`);
    }
} finally {
    server.close();
    await rm(profileDirectory, { recursive: true, force: true });
}

let updated = markup;

for (const [source, output] of converted) {
    updated = updated.replaceAll(`images/${source}`, `images/${output}`);
}

await writeFile(markupPath, updated);
console.log(
    `\n${converted.length} converted, ` +
    `${(sourceBytes / 1024 / 1024).toFixed(2)} MB -> ${(outputBytes / 1024 / 1024).toFixed(2)} MB ` +
    `(${(100 - outputBytes / sourceBytes * 100).toFixed(0)}% smaller); markup repointed`,
);

/**
 * Formats a buffer length for the progress log.
 *
 * @param {Buffer} buffer Encoded image
 * @returns {string} Human-readable size
 */
function sizeOf(buffer) {
    return `${(buffer.length / 1024).toFixed(0)}KB`;
}
