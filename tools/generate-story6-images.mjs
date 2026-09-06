#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { decodePng, resizeByArea, encodePng } from "./png-codec.mjs";

const projectRoot = process.cwd();
const imageDirectory = path.join(projectRoot, "story", "6", "images");
const tissueNames = [
    "liver-young",
    "liver-aged",
    "liver-aged-dq",
    "spleen-young",
    "spleen-aged",
    "spleen-aged-dq",
    "thymus-young",
    "thymus-aged",
    "thymus-aged-dq",
];
const mouseNames = ["mouse", "mouse_thymus", "mouse_liver", "mouse_spleen", "mouse_pancreas"];
const tutorialNames = ["tutorial1", "tutorial2", "tutorial3", "tutorial4", "tutorial5"];
const jobs = [
    { name: "cells", widths: [640, 1280] },
    ...tissueNames.map((name) => ({ name, widths: [320, 640] })),
    ...mouseNames.map((name) => ({ name, widths: [640, 1280] })),
    ...tutorialNames.map((name) => ({ name, widths: [660, 1320] })),
];

for (const job of jobs) {
    const inputPath = path.join(imageDirectory, `${job.name}.png`);
    const source = decodePng(await readFile(inputPath));

    for (const width of job.widths) {
        const height = Math.round(source.height * width / source.width);
        const resized = resizeByArea(source, width, height);
        const outputPath = path.join(imageDirectory, `${job.name}-${width}.png`);

        await writeFile(outputPath, encodePng(resized));
        console.log(`${path.relative(projectRoot, outputPath)} ${width}x${height}`);
    }
}
