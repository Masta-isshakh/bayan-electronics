#!/usr/bin/env node
// Generates every media file listed in content/assets.ts that does not exist yet:
//   • images  → dark --surface→--void gradient, faint lumen radial, LED-dot texture and
//               the filename in small muted text, at the exact delivery size;
//   • logos   → a typographic "AL BAYAN" wordmark SVG;
//   • textures/noise.png → the static grain tile used by the hero (a real asset).
// Existing files are never touched, so the client can drop real media in and re-run.
// Placeholders embed PLACEHOLDER_MARKER so the site can tell them apart from real media.
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { tsImport } from "tsx/esm/api";
import { PLACEHOLDER_MARKER } from "./media-marker.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const mediaDir = join(root, "public", "media");
const { listImages, listMediaFiles } = await tsImport("../content/assets.ts", import.meta.url);

const palette = { void: "#070A12", surface: "#0F1424", lumen: "#FFC247", muted: "#9AA5BC" };

/** Deterministic 0..1 value per path, so each placeholder has its own light position. */
function seed(path, salt) {
  let hash = 2166136261;
  for (const char of `${path}:${salt}`) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return ((hash >>> 0) % 1000) / 1000;
}

function placeholderSvg({ path, width, height }) {
  const short = Math.min(width, height);
  const pad = Math.round(short * 0.05);
  const fontSize = Math.max(14, Math.round(short * 0.022));
  const dot = Math.round(short * 0.035);
  const cx = (0.3 + seed(path, "x") * 0.4).toFixed(3);
  const cy = (0.25 + seed(path, "y") * 0.35).toFixed(3);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <!-- ${PLACEHOLDER_MARKER} -->
  <defs>
    <linearGradient id="base" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${palette.surface}"/>
      <stop offset="1" stop-color="${palette.void}"/>
    </linearGradient>
    <radialGradient id="glow" cx="${cx}" cy="${cy}" r="0.6">
      <stop offset="0" stop-color="${palette.lumen}" stop-opacity="0.16"/>
      <stop offset="0.45" stop-color="${palette.lumen}" stop-opacity="0.05"/>
      <stop offset="1" stop-color="${palette.lumen}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="dots" width="${dot}" height="${dot}" patternUnits="userSpaceOnUse">
      <circle cx="${dot / 2}" cy="${dot / 2}" r="${Math.max(1, dot * 0.06)}" fill="#FFFFFF" fill-opacity="0.05"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#base)"/>
  <rect width="100%" height="100%" fill="url(#dots)"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <text x="${pad}" y="${height - pad}" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" fill="${palette.muted}" fill-opacity="0.6">${path}  ${width}×${height}</text>
</svg>`;
}

function noiseSvg(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <filter id="n" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
  <rect width="100%" height="100%" filter="url(#n)"/>
</svg>`;
}

function wordmarkSvg(path) {
  const fill = path.includes("white") ? "#F2F4F8" : "#0B0F1C";
  const mark = `<g fill="${palette.lumen}"><circle cx="8" cy="8" r="4"/><circle cx="20" cy="8" r="4"/><circle cx="8" cy="20" r="4"/><circle cx="20" cy="20" r="4"/></g>`;
  if (path.includes("mark")) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><!-- ${PLACEHOLDER_MARKER} -->${mark}</svg>\n`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 28" width="200" height="28"><!-- ${PLACEHOLDER_MARKER} -->${mark}<text x="38" y="22" font-family="Archivo, Arial, sans-serif" font-weight="700" font-size="22" letter-spacing="1" fill="${fill}">AL BAYAN</text></svg>\n`;
}

async function ensureDir(file) {
  await mkdir(dirname(file), { recursive: true });
}

let created = 0;

for (const image of listImages()) {
  const file = join(mediaDir, image.path);
  if (existsSync(file)) continue;
  await ensureDir(file);

  if (image.path === "textures/noise.png") {
    // Grain is drawn at a few percent opacity: 16 grey levels are indistinguishable from 256.
    await sharp(Buffer.from(noiseSvg(image.width)))
      .toColourspace("b-w")
      .png({ compressionLevel: 9, palette: true, colours: 16 })
      .toFile(file);
  } else {
    await sharp(Buffer.from(placeholderSvg(image)))
      .jpeg({ quality: 80, mozjpeg: true })
      .withExif({ IFD0: { ImageDescription: PLACEHOLDER_MARKER } })
      .toFile(file);
  }
  created += 1;
  console.log(`  + ${image.path}`);
}

for (const media of listMediaFiles()) {
  if (!media.path.endsWith(".svg")) continue;
  const file = join(mediaDir, media.path);
  if (existsSync(file)) continue;
  await ensureDir(file);
  await writeFile(file, wordmarkSvg(media.path));
  created += 1;
  console.log(`  + ${media.path}`);
}

console.log(created ? `make-placeholders: created ${created} file(s).` : "make-placeholders: nothing to do — all media present.");
