#!/usr/bin/env node

import { createServer } from "node:http";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";

const browserArgument = process.argv.find((argument) => argument.startsWith("--browser="));

if (!browserArgument) {
    throw new Error("Pass an existing Chromium browser path with --browser=/absolute/path/to/browser");
}

const browserPath = browserArgument.slice("--browser=".length);
const projectRoot = process.cwd();
const imageDirectory = path.join(projectRoot, "stories", "story6", "img");
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

/**
 * Runs a Chromium browser long enough for the renderer page to emit an encoded data URL.
 *
 * @param {string} executable Existing Chromium-compatible browser executable
 * @param {string} profilePath Isolated temporary browser profile
 * @param {string} pageUrl Local renderer page
 * @returns {Promise<string>} Serialized renderer document
 */
function renderDocument(executable, profilePath, pageUrl) {
    return new Promise((resolve, reject) => {
        const args = [
            "--headless=new",
            "--disable-background-networking",
            "--disable-component-update",
            "--disable-default-apps",
            "--disable-extensions",
            "--no-default-browser-check",
            "--no-first-run",
            `--user-data-dir=${profilePath}`,
            "--virtual-time-budget=10000",
            "--dump-dom",
            pageUrl,
        ];
        const child = spawn(executable, args, {
            cwd: executable.toLowerCase().endsWith(".exe") ? "/mnt/c/Windows" : projectRoot,
            stdio: ["ignore", "pipe", "pipe"],
        });
        const output = [];
        const errors = [];
        const timeout = setTimeout(() => {
            child.kill();
            reject(new Error("Browser image rendering timed out"));
        }, 30000);

        child.stdout.on("data", (chunk) => output.push(chunk));
        child.stderr.on("data", (chunk) => errors.push(chunk));
        child.once("error", (error) => {
            clearTimeout(timeout);
            reject(error);
        });
        child.once("close", (code) => {
            clearTimeout(timeout);

            if (code !== 0) {
                const detail = Buffer.concat(errors).toString("utf8").slice(-2000);
                reject(new Error(`Browser image rendering exited with code ${code}: ${detail}`));
                return;
            }

            resolve(Buffer.concat(output).toString("utf8"));
        });
    });
}

/**
 * Converts a WSL temporary path for a Windows browser while leaving Linux browser paths unchanged.
 *
 * @param {string} profileDirectory Local temporary directory
 * @param {string} executable Browser executable
 * @returns {string} Browser-readable profile path
 */
function toBrowserPath(profileDirectory, executable) {
    if (!executable.toLowerCase().endsWith(".exe")) {
        return profileDirectory;
    }

    const distribution = process.env.WSL_DISTRO_NAME;

    if (!distribution) {
        throw new Error("A Windows browser path requires WSL_DISTRO_NAME");
    }

    return `\\\\wsl.localhost\\${distribution}${profileDirectory.replaceAll("/", "\\")}`;
}
