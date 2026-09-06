#!/usr/bin/env node

import { createServer } from "node:http";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import { renderDocument, toBrowserPath, resolveBrowserPath } from "./browser-render.mjs";

const browserPath = resolveBrowserPath(process.argv);
const projectRoot = process.cwd();
const imageDirectory = path.join(projectRoot, "story", "6", "images");
const source = await readFile(path.join(imageDirectory, "splash-bg.webp"));
const server = createServer((request, response) => {
    const requestUrl = new URL(request.url ?? "/", "http://localhost");
    const width = Number.parseInt(requestUrl.searchParams.get("width") ?? "", 10);
    const height = Math.round(width * 9 / 16);

    if (![960, 1920].includes(width)) {
        response.writeHead(400, { "Content-Type": "text/plain" });
        response.end("Unsupported output width");
        return;
    }

    response.writeHead(200, {
        "Cache-Control": "no-store",
        "Content-Type": "text/html; charset=utf-8",
    });
    response.end(`<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Story 6 splash renderer</title></head>
<body>
<img id="source" alt="" src="data:image/webp;base64,${source.toString("base64")}">
<pre id="output">pending</pre>
<script>
    (() => {
        const image = document.querySelector("#source");
        const output = document.querySelector("#output");
        let rendered = false;
        const render = () => {
            if (rendered) {
                return;
            }

            rendered = true;
            const canvas = document.createElement("canvas");
            canvas.width = ${width};
            canvas.height = ${height};
            const context = canvas.getContext("2d", { alpha: true });
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = "high";
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            output.textContent = "story6-output:" + canvas.toDataURL("image/webp", 0.82);
        };

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

const profileDirectory = await mkdtemp(path.join(tmpdir(), "story6-browser-"));

try {
    for (const width of [960, 1920]) {
        const pageUrl = `http://localhost:${address.port}/?width=${width}`;
        const profilePath = toBrowserPath(profileDirectory, browserPath);
        const html = await renderDocument(browserPath, profilePath, pageUrl);
        const match = html.match(/story6-output:data:image\/webp;base64,([a-z\d+/=]+)/iu);

        if (!match) {
            throw new Error(`Browser did not return a WebP image for ${width}px: ${html.slice(-500)}`);
        }

        const outputPath = path.join(imageDirectory, `splash-bg-${width}.webp`);
        await writeFile(outputPath, Buffer.from(match[1], "base64"));
        console.log(`${path.relative(projectRoot, outputPath)} ${width}x${Math.round(width * 9 / 16)}`);
    }
} finally {
    server.close();
    await rm(profileDirectory, { recursive: true, force: true });
}
