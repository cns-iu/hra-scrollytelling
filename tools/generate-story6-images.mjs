#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { deflateSync, inflateSync } from "node:zlib";

const projectRoot = process.cwd();
const imageDirectory = path.join(projectRoot, "story", "6", "img");
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
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const preservedChunkTypes = new Set(["cHRM", "gAMA", "iCCP", "sRGB"]);
const crcTable = createCrcTable();

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

/**
 * Decodes the 8-bit RGB and RGBA PNG formats used by Story 6.
 *
 * @param {Buffer} file Complete PNG file
 * @returns {{width: number, height: number, channels: number, colorType: number, pixels: Buffer, metadata: Array<{type: string, data: Buffer}>}} Decoded pixels and retained color metadata
 */
function decodePng(file) {
    if (!file.subarray(0, pngSignature.length).equals(pngSignature)) {
        throw new Error("Unsupported image: missing PNG signature");
    }

    let offset = pngSignature.length;
    let width;
    let height;
    let channels;
    let colorType;
    const idatChunks = [];
    const metadata = [];

    while (offset < file.length) {
        const length = file.readUInt32BE(offset);
        const type = file.toString("ascii", offset + 4, offset + 8);
        const data = file.subarray(offset + 8, offset + 8 + length);
        offset += 12 + length;

        if (type === "IHDR") {
            width = data.readUInt32BE(0);
            height = data.readUInt32BE(4);
            const bitDepth = data[8];
            colorType = data[9];
            const interlace = data[12];

            if (bitDepth !== 8 || ![2, 6].includes(colorType) || interlace !== 0) {
                throw new Error(`Unsupported PNG format: bit depth ${bitDepth}, color type ${colorType}, interlace ${interlace}`);
            }

            channels = colorType === 6 ? 4 : 3;
        } else if (type === "IDAT") {
            idatChunks.push(data);
        } else if (preservedChunkTypes.has(type)) {
            metadata.push({ type, data: Buffer.from(data) });
        } else if (type === "IEND") {
            break;
        }
    }

    if (!width || !height || !channels || idatChunks.length === 0) {
        throw new Error("Unsupported image: incomplete PNG data");
    }

    const scanlines = inflateSync(Buffer.concat(idatChunks));
    const stride = width * channels;
    const pixels = Buffer.alloc(stride * height);

    for (let row = 0; row < height; row += 1) {
        const scanlineOffset = row * (stride + 1);
        const outputOffset = row * stride;
        const filter = scanlines[scanlineOffset];

        for (let column = 0; column < stride; column += 1) {
            const encoded = scanlines[scanlineOffset + 1 + column];
            const left = column >= channels ? pixels[outputOffset + column - channels] : 0;
            const above = row > 0 ? pixels[outputOffset + column - stride] : 0;
            const upperLeft = row > 0 && column >= channels ? pixels[outputOffset + column - stride - channels] : 0;
            let value;

            switch (filter) {
                case 0:
                    value = encoded;
                    break;
                case 1:
                    value = encoded + left;
                    break;
                case 2:
                    value = encoded + above;
                    break;
                case 3:
                    value = encoded + Math.floor((left + above) / 2);
                    break;
                case 4:
                    value = encoded + paeth(left, above, upperLeft);
                    break;
                default:
                    throw new Error(`Unsupported PNG row filter: ${filter}`);
            }

            pixels[outputOffset + column] = value & 255;
        }
    }

    return { width, height, channels, colorType, pixels, metadata };
}

/**
 * Downscales an image with area averaging and premultiplied-alpha sampling.
 *
 * @param {{width: number, height: number, channels: number, colorType: number, pixels: Buffer, metadata: Array<{type: string, data: Buffer}>}} source Source pixels
 * @param {number} targetWidth Desired pixel width
 * @param {number} targetHeight Desired pixel height
 * @returns {{width: number, height: number, channels: number, colorType: number, pixels: Buffer, metadata: Array<{type: string, data: Buffer}>}} Resized pixels
 */
function resizeByArea(source, targetWidth, targetHeight) {
    if (targetWidth > source.width || targetHeight > source.height) {
        throw new Error("Story 6 image generation only supports downscaling");
    }

    const output = Buffer.alloc(targetWidth * targetHeight * source.channels);
    const xScale = source.width / targetWidth;
    const yScale = source.height / targetHeight;

    for (let targetY = 0; targetY < targetHeight; targetY += 1) {
        const sourceTop = targetY * yScale;
        const sourceBottom = (targetY + 1) * yScale;
        const firstY = Math.floor(sourceTop);
        const lastY = Math.ceil(sourceBottom);

        for (let targetX = 0; targetX < targetWidth; targetX += 1) {
            const sourceLeft = targetX * xScale;
            const sourceRight = (targetX + 1) * xScale;
            const firstX = Math.floor(sourceLeft);
            const lastX = Math.ceil(sourceRight);
            const totals = [0, 0, 0, 0];
            let totalWeight = 0;
            let alphaWeight = 0;

            for (let sourceY = firstY; sourceY < lastY; sourceY += 1) {
                const yWeight = Math.min(sourceBottom, sourceY + 1) - Math.max(sourceTop, sourceY);

                for (let sourceX = firstX; sourceX < lastX; sourceX += 1) {
                    const xWeight = Math.min(sourceRight, sourceX + 1) - Math.max(sourceLeft, sourceX);
                    const weight = xWeight * yWeight;
                    const sourceOffset = (sourceY * source.width + sourceX) * source.channels;
                    const alpha = source.channels === 4 ? source.pixels[sourceOffset + 3] / 255 : 1;

                    totals[0] += source.pixels[sourceOffset] * alpha * weight;
                    totals[1] += source.pixels[sourceOffset + 1] * alpha * weight;
                    totals[2] += source.pixels[sourceOffset + 2] * alpha * weight;
                    alphaWeight += alpha * weight;
                    totalWeight += weight;
                }
            }

            const outputOffset = (targetY * targetWidth + targetX) * source.channels;
            const colorDivisor = alphaWeight || totalWeight;
            output[outputOffset] = Math.round(totals[0] / colorDivisor);
            output[outputOffset + 1] = Math.round(totals[1] / colorDivisor);
            output[outputOffset + 2] = Math.round(totals[2] / colorDivisor);

            if (source.channels === 4) {
                output[outputOffset + 3] = Math.round(alphaWeight / totalWeight * 255);
            }
        }
    }

    return { ...source, width: targetWidth, height: targetHeight, pixels: output };
}

/**
 * Encodes raw Story 6 pixels as a color-profile-preserving PNG.
 *
 * @param {{width: number, height: number, channels: number, colorType: number, pixels: Buffer, metadata: Array<{type: string, data: Buffer}>}} image Image to encode
 * @returns {Buffer} Encoded PNG file
 */
function encodePng(image) {
    const header = Buffer.alloc(13);
    header.writeUInt32BE(image.width, 0);
    header.writeUInt32BE(image.height, 4);
    header[8] = 8;
    header[9] = image.colorType;
    const filtered = filterRows(image);
    const chunks = [createChunk("IHDR", header)];

    for (const metadata of image.metadata) {
        chunks.push(createChunk(metadata.type, metadata.data));
    }

    chunks.push(createChunk("IDAT", deflateSync(filtered, { level: 9 })));
    chunks.push(createChunk("IEND", Buffer.alloc(0)));
    return Buffer.concat([pngSignature, ...chunks]);
}

/**
 * Selects the lowest-cost standard PNG filter for every scanline.
 *
 * @param {{width: number, height: number, channels: number, pixels: Buffer}} image Image pixels
 * @returns {Buffer} Filtered scanlines ready for compression
 */
function filterRows(image) {
    const stride = image.width * image.channels;
    const filtered = Buffer.alloc((stride + 1) * image.height);

    for (let row = 0; row < image.height; row += 1) {
        const rowOffset = row * stride;
        let bestFilter = 0;
        let bestScore = Number.POSITIVE_INFINITY;
        let bestBytes;

        for (let filter = 0; filter <= 4; filter += 1) {
            const candidate = Buffer.allocUnsafe(stride);
            let score = 0;

            for (let column = 0; column < stride; column += 1) {
                const value = image.pixels[rowOffset + column];
                const left = column >= image.channels ? image.pixels[rowOffset + column - image.channels] : 0;
                const above = row > 0 ? image.pixels[rowOffset + column - stride] : 0;
                const upperLeft = row > 0 && column >= image.channels ? image.pixels[rowOffset + column - stride - image.channels] : 0;
                const predictor = [0, left, above, Math.floor((left + above) / 2), paeth(left, above, upperLeft)][filter];
                const encoded = (value - predictor) & 255;
                candidate[column] = encoded;
                score += Math.min(encoded, 256 - encoded);
            }

            if (score < bestScore) {
                bestFilter = filter;
                bestScore = score;
                bestBytes = candidate;
            }
        }

        const outputOffset = row * (stride + 1);
        filtered[outputOffset] = bestFilter;
        bestBytes.copy(filtered, outputOffset + 1);
    }

    return filtered;
}

/**
 * Calculates the PNG Paeth predictor.
 *
 * @param {number} left Pixel byte to the left
 * @param {number} above Pixel byte above
 * @param {number} upperLeft Pixel byte diagonally above-left
 * @returns {number} Predicted byte value
 */
function paeth(left, above, upperLeft) {
    const estimate = left + above - upperLeft;
    const leftDistance = Math.abs(estimate - left);
    const aboveDistance = Math.abs(estimate - above);
    const upperLeftDistance = Math.abs(estimate - upperLeft);

    if (leftDistance <= aboveDistance && leftDistance <= upperLeftDistance) {
        return left;
    }

    return aboveDistance <= upperLeftDistance ? above : upperLeft;
}

/**
 * Wraps PNG chunk data with its length, type, and checksum.
 *
 * @param {string} type Four-character PNG chunk type
 * @param {Buffer} data Chunk payload
 * @returns {Buffer} Encoded chunk
 */
function createChunk(type, data) {
    const typeBuffer = Buffer.from(type, "ascii");
    const chunk = Buffer.alloc(data.length + 12);
    chunk.writeUInt32BE(data.length, 0);
    typeBuffer.copy(chunk, 4);
    data.copy(chunk, 8);
    chunk.writeUInt32BE(calculateCrc(Buffer.concat([typeBuffer, data])), data.length + 8);
    return chunk;
}

/**
 * Creates the lookup table used for PNG CRC-32 checksums.
 *
 * @returns {Uint32Array} CRC lookup table
 */
function createCrcTable() {
    const table = new Uint32Array(256);

    for (let index = 0; index < 256; index += 1) {
        let value = index;

        for (let bit = 0; bit < 8; bit += 1) {
            value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
        }

        table[index] = value >>> 0;
    }

    return table;
}

/**
 * Calculates a PNG-compatible CRC-32 checksum.
 *
 * @param {Buffer} data Bytes to checksum
 * @returns {number} Unsigned checksum
 */
function calculateCrc(data) {
    let crc = 0xffffffff;

    for (const byte of data) {
        crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8);
    }

    return (crc ^ 0xffffffff) >>> 0;
}
