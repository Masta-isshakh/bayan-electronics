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

| Script                                                  | What it does                                                                         |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `npm run dev`                                           | Dev server (Turbopack). Runs `ensure-amplify-outputs` and `media-manifest` first.    |
| `npm run build` / `npm start`                           | Production build (all pages static) and server.                                      |
| `npm run lint` · `npm run typecheck` · `npm run format` | ESLint, TypeScript, Prettier.                                                        |
| `npm run analyze`                                       | Build with the bundle analyzer (`.next/analyze/*.html`).                             |
| `npm run media:placeholders`                            | Generates any missing media file as a placeholder (never overwrites).                |
| `npm run media:hero`                                    | Encodes the hero video and posters with ffmpeg (see below).                          |
| `npm run media:manifest`                                | Re-hashes `public/media` into `content/media-manifest.json` (runs before dev/build). |
| `npm run content:todo`                                  | Regenerates `CONTENT-TODO.md`.                                                       |

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

All media lives under `public/media/` at the exact paths and sizes in `content/assets.ts` — the client's image
prompts use the same filenames, so **do not rename**. The repo ships generated placeholders; replace them in place.

| Path                                                                                                                  | Size                                            | Used for                                               |
| --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------ |
| `hero/poster-desktop.jpg` · `hero/poster-mobile.jpg`                                                                  | 1920×1080 · 1080×1920                           | Hero poster (LCP)                                      |
| `hero/hero-desktop.{webm,mp4}` · `hero/hero-mobile.{webm,mp4}`                                                        | 1920×1080 · 1080×1920, 24 fps, 8–12 s, no audio | Hero video                                             |
| `home/factory-overview.jpg`, `home/qc-lab.jpg`, `home/traceability-label.jpg`                                         | 2400×1600                                       | Home sections                                          |
| `home/doha-night.jpg`                                                                                                 | 2880×1200                                       | "Starting a project" band                              |
| `home/cct-scene.jpg`                                                                                                  | 2400×1500                                       | CCT explorer (neutral-white interior)                  |
| `products/<family>.jpg` × 11                                                                                          | 1600×2000                                       | Product tiles and family pages                         |
| `solutions/<sector>.jpg` × 9                                                                                          | 2400×1600                                       | Sector cards and pages                                 |
| `manufacturing/{smt-line,assembly-line,aging-racks,ip-test,thermal-imaging,calibration-bench,warehouse,engineer}.jpg` | 2400×1600                                       | Process steps, laboratory                              |
| `projects/project-01.jpg` … `project-06.jpg`                                                                          | 2400×1600                                       | Projects                                               |
| `about/factory-exterior.jpg`                                                                                          | 2880×1620                                       | About, manufacturing                                   |
| `about/team.jpg`                                                                                                      | 2400×1600                                       | About (hidden until team details exist)                |
| `brand/logo.svg`, `brand/logo-mark.svg`, `brand/logo-white.svg`                                                       | vector                                          | Real logo (the header switches automatically)          |
| `og/og-default.jpg`                                                                                                   | 1200×630                                        | Static share image (generated cards are used per page) |

Then run `npm run media:manifest` (or just `npm run dev` / `build`). The manifest records a content hash per file
(URLs get `?v=<hash>`, so the year-long immutable cache is busted) and whether each file is still a placeholder.
The site reacts automatically: a real hero poster becomes the LCP image instead of the light field, a real logo
replaces the typographic wordmark.

### Hero video

1. Put the source clips in `media-src/hero/desktop.mp4` (landscape) and `media-src/hero/mobile.mp4` (portrait).
   `media-src/` is git-ignored.
2. Install ffmpeg if needed (`winget install Gyan.FFmpeg`, `brew install ffmpeg`, `apt install ffmpeg`).
3. `npm run media:hero` — writes the four video files and both posters, then prints sizes against the budget
   (desktop WebM ≤ 3.5 MB, MP4 ≤ 5 MB; mobile ≤ 2.5 MB each).

The video only loads after the page has finished loading, never for reduced motion, Save-Data or slow connections.
To force the CSS light field, set `site.hero.video` to `null` in `content/site.ts`.

### Placeholders

`npm run media:placeholders` creates any missing file at its exact size (dark gradient, lumen glow, filename). It
never overwrites, so it is safe to re-run after dropping in real files.

## Editing content

| What                                                                                                        | Where                                  |
| ----------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| Brand names, contact details, social links, hero video switch, stats, certifications, team, story, timeline | `content/site.ts`                      |
| Product families (names, descriptors, specs, applications, downloads)                                       | `content/products.ts`                  |
| Sectors                                                                                                     | `content/solutions.ts`                 |
| Projects                                                                                                    | `content/projects.ts`                  |
| Manufacturing steps, QC, laboratory, traceability, documents                                                | `content/manufacturing.ts`             |
| Interface text (navigation, headings, forms, legal)                                                         | `messages/en.json`, `messages/ar.json` |

Every text value has `en` and `ar`. Unconfirmed values are written as `"[[CONFIRM: what is needed]]"` (helper
`pending()` in `lib/placeholder.ts`); the site hides them or shows "To be confirmed", and they are listed in
`CONTENT-TODO.md`. Records with `confirm: true` are shown but need the client's sign-off. After editing, run
`npm run content:todo`.

- Contact channels, the WhatsApp button, the map, social links, certifications, team and timeline appear
  automatically once their values are no longer placeholders.
- "In numbers" (home) appears only when every figure in `site.stats` is confirmed.
- Sample projects carry a visible "Sample" badge and are `noindex` until `isPlaceholder` is set to `false`.

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
