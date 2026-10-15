#!/usr/bin/env node
// Scans public/media, writes content/media-manifest.json and builds the image variants:
//   { files: { "<path under /media>": { v, placeholder, w?, h? } } }
// `v` (8-char content hash) is appended to media URLs (?v=…) so replacing a file busts
// browser and CDN caches even though /media is served as immutable. `placeholder` is true
// for files produced by make-placeholders.mjs, which embed PLACEHOLDER_MARKER. `w`/`h` are
// the pixel size of photos.
//
// Every photo (except og/, textures/) is also written to public/_img as WebP at each width
// in lib/image-sizes.json up to its own width: /_img/<name>.<v>.<width>.webp, the URLs
// lib/image-loader.ts asks for. Existing variants are kept, stale ones removed.
// Runs automatically before `dev` and `build`.
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { availableParallelism } from "node:os";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { PLACEHOLDER_MARKER } from "./media-marker.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const mediaDir = join(root, "public", "media");
const variantDir = join(root, "public", "_img");
const outFile = join(root, "content", "media-manifest.json");
const sizes = JSON.parse(await readFile(join(root, "lib", "image-sizes.json"), "utf8"));
const widths = [...new Set([...sizes.deviceSizes, ...sizes.imageSizes])].sort((a, b) => a - b);

const PHOTO = /\.(?:jpe?g|png)$/i;
const NO_VARIANTS = ["og/", "textures/"];
const WEBP = { quality: 75, effort: 4 };

async function walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = await Promise.all(
    entries.map((entry) => {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) return walk(full);
      return entry.name.startsWith(".") ? [] : [full];
    }),
  );
  return files.flat();
}

/** Runs `task` over `items` with at most `limit` in flight. */
async function pool(items, limit, task) {
  let next = 0;
  const worker = async () => {
    while (next < items.length) await task(items[next++]);
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
}

const files = (await walk(mediaDir)).sort();
const manifest = { files: {} };
const jobs = [];

for (const file of files) {
  const buffer = await readFile(file);
  const key = relative(mediaDir, file).split(sep).join("/");
  const entry = {
    v: createHash("sha1").update(buffer).digest("hex").slice(0, 8),
    placeholder: buffer.includes(PLACEHOLDER_MARKER),
  };
  if (PHOTO.test(key)) {
    const { width, height } = await sharp(buffer).metadata();
    Object.assign(entry, { w: width, h: height });
    if (!NO_VARIANTS.some((prefix) => key.startsWith(prefix))) {
      const name = key.replace(PHOTO, "");
      for (const target of [...widths.filter((w) => w < width), width]) {
        jobs.push({ buffer, target, out: join(variantDir, `${name}.${entry.v}.${target}.webp`) });
      }
    }
  }
  manifest.files[key] = entry;
}

await writeFile(outFile, `${JSON.stringify(manifest, null, 2)}\n`);

const wanted = new Set(jobs.map((job) => job.out));
const missing = jobs.filter((job) => !existsSync(job.out));
await pool(missing, Math.max(2, availableParallelism() - 1), async ({ buffer, target, out }) => {
  await mkdir(dirname(out), { recursive: true });
  await sharp(buffer).resize({ width: target }).webp(WEBP).toFile(out);
});

let removed = 0;
for (const file of await walk(variantDir)) {
  if (wanted.has(file)) continue;
  await rm(file);
  removed += 1;
}

console.log(
  `media-manifest: ${files.length} files → content/media-manifest.json; ` +
    `variants: ${missing.length} built, ${jobs.length - missing.length} kept, ${removed} removed`,
);
