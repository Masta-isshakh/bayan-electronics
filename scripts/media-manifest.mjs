#!/usr/bin/env node
// Scans public/media and writes content/media-manifest.json:
//   { files: { "<path under /media>": { v: <8-char content hash>, placeholder: <bool> } } }
// `v` is appended to media URLs (?v=…) so replacing a file busts browser, CDN and
// next/image caches even though /media is served as immutable. `placeholder` is true
// for files produced by make-placeholders.mjs, which embed PLACEHOLDER_MARKER.
// Runs automatically before `dev` and `build`.
import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { PLACEHOLDER_MARKER } from "./media-marker.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const mediaDir = join(root, "public", "media");
const outFile = join(root, "content", "media-manifest.json");

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

const files = (await walk(mediaDir)).sort();
const manifest = { files: {} };

for (const file of files) {
  const buffer = await readFile(file);
  const key = relative(mediaDir, file).split(sep).join("/");
  manifest.files[key] = {
    v: createHash("sha1").update(buffer).digest("hex").slice(0, 8),
    placeholder: buffer.includes(PLACEHOLDER_MARKER),
  };
}

await writeFile(outFile, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`media-manifest: ${files.length} files → content/media-manifest.json`);
