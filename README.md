# Al Bayan Electronics & LED Technologies — website

Bilingual (English / Arabic, RTL) corporate website for **Al Bayan Electronics & LED Technologies Factory, Qatar**.
Next.js 15 (App Router) on AWS Amplify Gen 2, Tailwind CSS v4, next-intl, GSAP, motion and Lenis.

- Plan: `docs/PLAN.md` · Decisions and deviations: `docs/DECISIONS.md` · QA record: `docs/QA.md`
- Everything the client still has to supply or confirm: **`CONTENT-TODO.md`** (generated)

## Run locally

Requirements: Node.js 20.9+ (22 recommended), npm 10.

```bash
npm ci
npm run dev          # http://localhost:3000 → redirects to /en
```

| Script                                                  | What it does                                                                      |
| ------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `npm run dev`                                           | Dev server (Turbopack). Runs `ensure-amplify-outputs` and `media-manifest` first. |
| `npm run build` / `npm start`                           | Production build (all pages static) and server.                                   |
| `npm run lint` · `npm run typecheck` · `npm run format` | ESLint, TypeScript, Prettier.                                                     |
| `npm run analyze`                                       | Build with the bundle analyzer (`.next/analyze/*.html`).                          |
| `npm run media:placeholders`                            | Generates any missing media file as a placeholder (never overwrites).             |
| `npm run media:video`                                   | Encodes the background videos and their posters with ffmpeg (see below).          |
| `npm run media:manifest`                                | Re-hashes `public/media`, builds the image variants (runs before dev/build).      |
| `npm run content:todo`                                  | Regenerates `CONTENT-TODO.md`.                                                    |

### Backend (Amplify sandbox)

The inquiry forms write to the Amplify Data model `Inquiry` (`amplify/data/resource.ts`; public API key, create
only). To run against your own cloud sandbox:

```bash
npx ampx sandbox --profile <your-aws-profile>   # deploys a personal sandbox and writes amplify_outputs.json
npx ampx sandbox delete --profile <your-aws-profile>   # removes it
```

`amplify_outputs.json` is git-ignored. If it is missing, `npm run dev` / `npm run build` write a stub and the form
falls back to WhatsApp / email links. If it exists but predates the `Inquiry` model, the same fallback appears until
the backend is redeployed.

## Deploy on Amplify Hosting

1. Push this repository; in the Amplify console connect the branch (the app already uses `amplify.yml`).
2. The build runs `ampx pipeline-deploy` (backend, creates the `Inquiry` table and API key) and then `npm run build`.
   Node 22 is selected in `amplify.yml` (Tailwind v4 and sharp need Node ≥ 20).
3. **Environment variables** (Amplify → Hosting → Environment variables):
   - `NEXT_PUBLIC_SITE_URL` = the production origin, e.g. `https://www.albayan.qa` — used for canonical URLs,
     hreflang, the sitemap and Open Graph. Until set, the site uses `https://albayan.example`.
4. Add the custom domain in Amplify → Domain management.
5. Read submissions in the Amplify console (Data → `Inquiry`) — email notifications are not set up yet
   (see `CONTENT-TODO.md`).

## Adding real media

All media lives under `public/media/` at the exact paths in `content/assets.ts` — the client's image prompts use
the same filenames, so **do not rename**. Replace a file in place; missing ones are generated placeholders. The sizes
below are targets: a smaller file at the same aspect ratio works (it is never upscaled), a different ratio is
cropped by the layout. The client's original uploads are kept in `media-src/uploads/` (git-ignored).

| Path                                                                                                                  | Size                                     | Used for                                               |
| --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------ |
| `hero/poster-desktop.jpg` · `hero/poster-mobile.jpg`                                                                  | 1920×1080 · 1080×1920                    | Hero poster (LCP)                                      |
| `hero/hero-desktop.{webm,mp4}` · `hero/hero-mobile.{webm,mp4}`                                                        | encoded by `npm run media:video` (below) | Hero video                                             |
| `home/factory-overview.jpg`, `home/qc-lab.jpg`, `home/traceability-label.jpg`                                         | 2400×1600                                | Home sections                                          |
| `home/doha-night.jpg`                                                                                                 | 2880×1200                                | "Starting a project" band                              |
| `home/cct-scene.jpg`                                                                                                  | 2400×1500                                | CCT explorer (neutral-white interior)                  |
| `products/<family>.jpg` × 11                                                                                          | 1600×2000                                | Product tiles and family pages                         |
| `solutions/<sector>.jpg` × 9                                                                                          | 2400×1600                                | Sector cards and pages                                 |
| `manufacturing/{smt-line,assembly-line,aging-racks,ip-test,thermal-imaging,calibration-bench,warehouse,engineer}.jpg` | 2400×1600                                | Process steps, laboratory                              |
| `about/factory-exterior.jpg`                                                                                          | 2880×1620                                | About, manufacturing                                   |
| `about/team.jpg`                                                                                                      | 2400×1600                                | About (hidden until team details exist)                |
| `brand/logo.svg`, `brand/logo-mark.svg`, `brand/logo-white.svg`                                                       | vector                                   | Real logo (the header switches automatically)          |
| `og/og-default.jpg`                                                                                                   | 1200×630                                 | Static share image (generated cards are used per page) |

Then run `npm run media:manifest` (or just `npm run dev` / `build`). The manifest records a content hash per file
(URLs get `?v=<hash>`, so the year-long immutable cache is busted), each photo's pixel size and whether it is still
a placeholder. The site reacts automatically: a real hero poster becomes the LCP image instead of the light field, a
real logo replaces the typographic wordmark.

### Image variants (why images load instantly)

Photos are never resized on request. `npm run media:manifest` writes every photo as WebP at each width in
`lib/image-sizes.json` up to its own width, to `public/_img/<name>.<hash>.<width>.webp` (git-ignored, rebuilt on
`dev`/`build`, cached between Amplify builds). `lib/image-loader.ts` points `next/image` at those files (render photos with `@/components/ui/Image`, which passes
the loader), so every
image is a static, immutable CDN hit with the right size for the screen — no optimizer cold starts. Only new or
changed photos are encoded (≈ 14 s for all of them from scratch, < 1 s otherwise); stale variants are removed.

### Background videos

| Source (git-ignored)               | Output (`public/media/…`)                                                              | Loop                                 |
| ---------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------ |
| `media-src/hero/desktop.mp4`       | `hero/hero-desktop.{webm,mp4}` 1920×1080, `hero/poster-desktop.jpg`                    | 2.5–8 s, forward then back (≈ 11 s)  |
| `media-src/hero/mobile.mp4`        | `hero/hero-mobile.{webm,mp4}` 720×1280, `hero/poster-mobile.jpg`                       | 4.5–10 s, forward then back (≈ 11 s) |
| `media-src/manufacturing/line.mp4` | `manufacturing/line-{desktop,mobile}.{webm,mp4}` 1600×900 / 960×540, `line-poster.jpg` | 0–10 s with a 1 s crossfade (9 s)    |

1. Install ffmpeg if needed (`winget install Gyan.FFmpeg`, `brew install ffmpeg`, `apt install ffmpeg`).
2. `npm run media:video` — encodes all of the above without audio and prints sizes against the budget.
   Trim points live in `scripts/encode-video.sh`: the hero clips open in darkness, so their loops use only the lit
   part; the moving camera would ghost in a crossfade, so they play forward and back instead.

Each poster is the first frame of its loop, so the poster → video fade is invisible. Videos attach after the page has
loaded (the poster is the LCP image), start at the first playable frame, pause off-screen, in hidden tabs and via the
pause button, and never load for reduced motion, Save-Data or slow connections. Each device downloads one file only.
To force the CSS light field in the hero, set `site.hero.video` to `null` in `content/site.ts`.

### Placeholders

`npm run media:placeholders` creates any missing file at its exact size (dark gradient, lumen glow, filename). It
never overwrites, so it is safe to re-run after dropping in real files.

## Editing content

| What                                                                                                          | Where                                       |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| Brand names, contact details, offices, social links, hero video switch, stats, certifications, team, timeline | `content/site.ts`                           |
| About, mission, vision, values, CEO message, organization, distributor benefits                               | `content/company.ts`                        |
| Product families (names, descriptors, specs, applications, downloads)                                         | `content/products.ts`                       |
| Sectors                                                                                                       | `content/solutions.ts`                      |
| Product catalogue: 218 models, variants, categories (read by `content/catalogue.ts`)                          | `content/catalogue.json`                    |
| Projects: 44 references, categories, photos (read by `content/projects.ts`)                                   | `content/projects.json`                     |
| Old website URLs → new pages (product and project ids)                                                        | `content/legacy-urls.json`, `lib/legacy.ts` |
| Manufacturing steps, QC, laboratory, traceability, documents                                                  | `content/manufacturing.ts`                  |
| Interface text (navigation, headings, forms, legal)                                                           | `messages/en.json`, `messages/ar.json`      |

Every text value has `en` and `ar`. Unconfirmed values are written as `"[[CONFIRM: what is needed]]"` (helper
`pending()` in `lib/placeholder.ts`); the site hides them or shows "To be confirmed", and they are listed in
`CONTENT-TODO.md`. Records with `confirm: true` are shown but need the client's sign-off. After editing, run
`npm run content:todo`.

- Contact channels, the WhatsApp button, the map, social links, certifications, team and timeline appear
  automatically once their values are no longer placeholders.
- "In numbers" (home) appears only when every figure in `site.stats` is confirmed.
- The catalogue and the projects were imported from the previous website (b-ledtec.com). What the import
  decided, and what to check, is in `docs/catalogue-review.md` and `docs/projects-review.md`.
- Family spec ranges (power, efficacy, CCT, IP) are computed from the family's catalogue models
  (`familySpecs` in `content/catalogue.ts`); CRI and warranty stay in `content/products.ts`.
- Catalogue photos live in `public/media/catalogue/<model>.png|jpg`, project photos in
  `public/media/projects/<slug>[-n].jpg`. Replace a file in place with a better one and keep its name.

## Project structure

```
app/                 routes (app/[locale]/…), sitemap, robots, icons, globals.css (design tokens)
components/          hero/, home/, layout/, products/, forms/, ui/, motion/, providers/, seo/
content/             typed bilingual content + media manifest
i18n/                next-intl routing, navigation, request config
lib/                 gsap (registration), motion tokens, seo/json-ld, contact helpers, fonts, Amplify client
messages/            UI strings (en, ar)
scripts/             media + content tooling
amplify/             Amplify Gen 2 backend (auth, data)
fonts/, public/fonts self-hosted, subset fonts (see fonts/README.md)
```
