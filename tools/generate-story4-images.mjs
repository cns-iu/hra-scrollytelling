#!/usr/bin/env node

/*
 * Downscales Story 4's raster artwork to roughly twice its rendered size.
 *
 * The illustrations ship as Sketch exports at their original capture
 * resolution, several of them far larger than the box they are drawn into -
 * scene2-kidney-extraction-network.png was 5476px wide for a 512px slot. At 2x
 * they stay sharp on high-density displays while the page stops carrying
 * megabytes it cannot use.
 *
 * Targets are derived from the width attribute on each <image> in
 * story/4/index.html, so this stays correct if the artwork is re-laid-out.
 * Files already at or below the target are left alone, as are palette PNGs,
 * which the shared codec does not decode.
 *
 * Rewrites in place: the markup references fixed filenames.
 */

import { readFile, writeFile } from "node:fs/promises";
import { readdirSync } from "node:fs";
import path from "node:path";
import { decodePng, resizeByArea, encodePng } from "./png-codec.mjs";

const projectRoot = process.cwd();
const imageDirectory = path.join(projectRoot, "story", "4", "images");
const markupPath = path.join(projectRoot, "story", "4", "index.html");
const densityFactor = 2;

const markup = await readFile(markupPath, "utf8");
const renderedWidths = collectRenderedWidths(markup);
let savedBytes = 0;
let rewritten = 0;

for (const file of readdirSync(imageDirectory).filter((name) => name.endsWith(".png")).sort()) {
    const rendered = renderedWidths.get(file);

    if (!rendered) {
        console.log(`skip ${file} — not referenced by the markup`);
        continue;
    }

    const inputPath = path.join(imageDirectory, file);
    const original = await readFile(inputPath);
    let source;

    try {
        source = decodePng(original);
    } catch (error) {
        console.log(`skip ${file} — ${error.message}`);
        continue;
    }

    const target = Math.round(rendered * densityFactor);

    if (source.width <= target) {
        console.log(`keep ${file} — ${source.width}px already within ${target}px`);
        continue;
    }

    const height = Math.round(source.height * target / source.width);
    const encoded = encodePng(resizeByArea(source, target, height));

    /*
     * Resampling can cost more than it saves. Photographic sources compress
     * better at their original scale than as resampled pixels, and re-encoding
     * throws away whatever the exporter achieved - scene8-panel-2.png grew from
     * 1319KB to 1405KB. Keep the original whenever that happens.
     */
    if (encoded.length >= original.length) {
        console.log(
            `keep ${file} — resampling to ${target}px would grow it ` +
            `${(original.length / 1024).toFixed(0)}KB -> ${(encoded.length / 1024).toFixed(0)}KB`,
        );
        continue;
    }

    await writeFile(inputPath, encoded);
    savedBytes += original.length - encoded.length;
    rewritten += 1;
    console.log(
        `${file} ${source.width}x${source.height} -> ${target}x${height}` +
        `  ${(original.length / 1024).toFixed(0)}KB -> ${(encoded.length / 1024).toFixed(0)}KB`,
    );
}

console.log(`\n${rewritten} rewritten, ${(savedBytes / 1024 / 1024).toFixed(2)} MB saved`);

/**
 * Reads the width each raster is drawn at from the inline SVG markup.
 *
 * @param {string} html Story 4 markup
 * @returns {Map<string, number>} Image file name to its largest rendered width
 */
function collectRenderedWidths(html) {
    const widths = new Map();

    for (const element of html.match(/<image\b[^>]*>/g) ?? []) {
        const href = element.match(/xlink:href="images\/([^"]+)"/);
        const width = element.match(/\swidth="([\d.]+)"/);

        if (!href || !width) {
            continue;
        }

        const rendered = Number.parseFloat(width[1]);

        widths.set(href[1], Math.max(widths.get(href[1]) ?? 0, rendered));
    }

    return widths;
}
