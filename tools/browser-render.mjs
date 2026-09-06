/**
 * Runs a headless Chromium long enough for a local page to emit an encoded
 * image, shared by the story image generators.
 *
 * The browser is the encoder: this repository declares no npm dependencies and
 * assumes no image binaries, so `canvas.toDataURL` is the only WebP encoder
 * available. Callers pass their own executable with `--browser=`.
 *
 * Note that `toDataURL("image/avif")` silently returns PNG - the canvas API
 * cannot encode AVIF - so anything built on this is WebP-only.
 */

import { spawn } from "node:child_process";

const projectRoot = process.cwd();

export { renderDocument, toBrowserPath, resolveBrowserPath };

/**
 * Reads the required --browser= argument.
 *
 * @param {string[]} argv Process arguments
 * @returns {string} Browser executable path
 */
function resolveBrowserPath(argv) {
    const argument = argv.find((value) => value.startsWith("--browser="));

    if (!argument) {
        throw new Error("Pass an existing Chromium browser path with --browser=/absolute/path/to/browser");
    }

    return argument.slice("--browser=".length);
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
