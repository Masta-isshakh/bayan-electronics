#!/usr/bin/env node
// Writes CONTENT-TODO.md: every "[[CONFIRM: …]]" value and every `confirm` flag in
// content/ and messages/, the media still shown as placeholders, and the open items
// that live outside the content files. Run with `npm run content:todo`.
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { tsImport } from "tsx/esm/api";

const root = fileURLToPath(new URL("..", import.meta.url));
const MARKER = "[[CONFIRM";

const contentModules = ["site", "products", "solutions", "projects", "manufacturing"];
const messageFiles = ["en", "ar"];

/** Manual items that are not placeholder strings in the content files. */
const manualItems = [
  [
    "Production domain",
    "Set `NEXT_PUBLIC_SITE_URL` in Amplify → Environment variables (canonical URLs, sitemap and OG images use it). Currently `https://albayan.example`.",
  ],
  [
    "Email notification on new inquiry (SES/Lambda) — not set up",
    "Inquiries are stored in the Amplify `Inquiry` table only. Add an SES-backed function or a DynamoDB stream trigger to email the sales inbox.",
  ],
  [
    "Form reply promise",
    'The success message says "we reply within one business day" (`form.success` in messages/*.json). Confirm or change the commitment.',
  ],
  [
    "Logo artwork",
    "The B-LED logo in `public/media/brand/` is a vector rebuild of the 209×63 px PNG on the previous website. Supply the original artwork (AI, EPS, PDF or SVG) to replace `logo.svg`, `logo-white.svg` and `logo-mark.svg`.",
  ],
  [
    "Product catalogue review",
    "218 models / 1008 variants were imported from the previous website. `docs/catalogue-review.md` lists every inconsistency the import resolved (wattage/IP conflicts, truncated specs, a test item) and the photo situation: most product photos are about 220 px — new photography (≥ 1200 px, white background) is needed for a sharp catalogue.",
  ],
  [
    "Project references review",
    "44 projects were imported from the previous website. `docs/projects-review.md` lists the items to confirm: clients that look wrong (e.g. Ashghal for Oman projects), confidential clients, a missing year, possible duplicate bus-station entries, renders instead of photos, and usage rights for hotel and stadium photos.",
  ],
  [
    "Previous website (b-ledtec.com) is compromised",
    "The WordPress site carries ~900 injected casino/steroid/forex posts, hidden spam links inside its pages, and `/en/` redirects to a casino post. Clean or retire it (malware scan, delete spam posts, update WordPress and plugins, change all passwords) and request removal of the spam URLs in Google Search Console. When this site goes live on the domain, `/archives/*` returns 410 Gone (see middleware).",
  ],
  [
    "Legal pages",
    "Privacy and terms text (`legal` in messages/*.json) is a draft. Have it reviewed by the client's legal adviser.",
  ],
  [
    "Arabic copy",
    "All Arabic copy (every `ar` field in content/ and all of messages/ar.json) was written for client review. See the section at the end.",
  ],
];

function labelFor(value, index) {
  if (value && typeof value === "object") return value.slug ?? value.id ?? String(index);
  return String(index);
}

function recordName(node) {
  return node.name?.en ?? node.title?.en ?? node.slug ?? node.id ?? "";
}

function clean(text) {
  const match = text.match(/\[\[CONFIRM:?\s*([^\]]*)\]\]/);
  return match?.[1]?.trim() || "value";
}

function walk(node, path, rows, flags) {
  if (typeof node === "string") {
    if (node.includes(MARKER)) rows.push({ path, what: clean(node) });
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((child, index) => walk(child, `${path}[${labelFor(child, index)}]`, rows, flags));
    return;
  }
  if (!node || typeof node !== "object") return;
  // Image/media descriptors are reported from the media manifest instead.
  if ("src" in node && "path" in node) return;

  if (node.confirm === true) {
    flags.push({ path, what: `Confirm this record exists and its naming: "${recordName(node)}"` });
  } else if (typeof node.confirm === "string") {
    flags.push({ path, what: `${node.confirm} — currently "${node.ar ?? recordName(node)}"` });
  }
  for (const [key, child] of Object.entries(node)) {
    if (key === "confirm") continue;
    walk(child, path ? `${path}.${key}` : key, rows, flags);
  }
}

/** Merges `x.en` + `x.ar` placeholder pairs into one row. */
function mergeLocales(rows) {
  const merged = new Map();
  for (const row of rows) {
    const match = row.path.match(/^(.*)\.(en|ar)$/);
    const key = match ? match[1] : row.path;
    const existing = merged.get(key);
    if (existing) existing.locales.add(match?.[2]);
    else
      merged.set(key, {
        path: key,
        what: row.what.replace(/\s*\((English|Arabic)\)/, ""),
        locales: new Set(match ? [match[2]] : []),
      });
  }
  return [...merged.values()].map(({ path, what, locales }) => ({
    path,
    what: locales.size ? `${what} (${[...locales].map((l) => l.toUpperCase()).join(" + ")})` : what,
  }));
}

function countArabic(node) {
  if (Array.isArray(node)) return node.reduce((sum, child) => sum + countArabic(child), 0);
  if (!node || typeof node !== "object") return 0;
  return Object.entries(node).reduce(
    (sum, [key, child]) =>
      sum + (key === "ar" && typeof child === "string" && !child.includes(MARKER) ? 1 : countArabic(child)),
    0,
  );
}

function countStrings(node) {
  if (typeof node === "string") return 1;
  if (!node || typeof node !== "object") return 0;
  return Object.values(node).reduce((sum, child) => sum + countStrings(child), 0);
}

const escape = (text) => String(text).replaceAll("|", "\\|");
const table = (head, rows) =>
  [
    `| ${head.join(" | ")} |`,
    `|${head.map(() => "---").join("|")}|`,
    ...rows.map((r) => `| ${r.map(escape).join(" | ")} |`),
  ].join("\n");

const sections = [];
let placeholderCount = 0;
let flagCount = 0;
const arabicCounts = [];

for (const name of contentModules) {
  const mod = await tsImport(`../content/${name}.ts`, import.meta.url);
  const rows = [];
  const flags = [];
  let arabic = 0;
  for (const [exportName, value] of Object.entries(mod)) {
    // tsx's CommonJS interop also exposes every export under these keys.
    if (typeof value === "function" || exportName === "default" || exportName === "module.exports") continue;
    walk(value, exportName, rows, flags);
    arabic += countArabic(value);
  }
  arabicCounts.push([`content/${name}.ts`, arabic]);
  const merged = mergeLocales(rows);
  placeholderCount += merged.length;
  flagCount += flags.length;
  if (!merged.length && !flags.length) continue;

  const parts = [`### content/${name}.ts`];
  if (flags.length)
    parts.push(
      "**Confirm**",
      table(
        ["Key", "What to check"],
        flags.map((f) => [`\`${f.path}\``, f.what]),
      ),
    );
  if (merged.length)
    parts.push(
      "**Supply**",
      table(
        ["Key", "What to supply"],
        merged.map((r) => [`\`${r.path}\``, r.what]),
      ),
    );
  sections.push(parts.join("\n\n"));
}

for (const locale of messageFiles) {
  const messages = JSON.parse(await readFile(join(root, "messages", `${locale}.json`), "utf8"));
  const rows = [];
  walk(messages, "", rows, []);
  if (locale === "ar") arabicCounts.push(["messages/ar.json", countStrings(messages)]);
  if (!rows.length) continue;
  placeholderCount += rows.length;
  sections.push(
    [
      `### messages/${locale}.json`,
      table(
        ["Key", "What to supply"],
        rows.map((r) => [`\`${r.path}\``, r.what]),
      ),
    ].join("\n\n"),
  );
}

const { listImages, listMediaFiles } = await tsImport("../content/assets.ts", import.meta.url);
const pendingMedia = [
  ...listImages()
    .filter((image) => image.placeholder)
    .map((image) => [`public/media/${image.path}`, `${image.width}×${image.height}`]),
  ...listMediaFiles()
    .filter((file) => !file.available)
    .map((file) => [`public/media/${file.path}`, file.path.endsWith(".svg") ? "vector" : "see README"]),
];

const output = `# Content to-do

Generated by \`npm run content:todo\` from \`content/\` and \`messages/\`. Do not edit by hand — fix the
source value (replace the \`[[CONFIRM: …]]\` string or remove the \`confirm\` flag) and re-run.

**Open:** ${placeholderCount} values to supply · ${flagCount} records or names to confirm · ${pendingMedia.length} media files still placeholders.

## Open items outside the content files

${table(["Item", "Details"], manualItems)}

## Values and records by file

Values written as \`[[CONFIRM: …]]\` are hidden on the site (or shown as "To be confirmed") until replaced.
Records flagged \`confirm: true\` are shown, but their existence and naming need the client's sign-off.

${sections.join("\n\n")}

## Media to supply

Drop real files at these exact paths and sizes (see README → "Adding real media"), then run
\`npm run media:manifest\` (also runs automatically before \`dev\` and \`build\`).

${table(["Path", "Size"], pendingMedia)}

## Arabic copy review

All Arabic copy was written in Modern Standard Arabic (Gulf business register) and needs review by a
native-speaking member of the client's team before launch. Technical terms (LED, DALI, IP65, SMT, CRI) stay in Latin.

${table(["File", "Arabic strings"], arabicCounts)}
`;

await writeFile(join(root, "CONTENT-TODO.md"), output);
console.log(
  `content-todo: ${placeholderCount} values, ${flagCount} confirmations, ${pendingMedia.length} media → CONTENT-TODO.md`,
);
