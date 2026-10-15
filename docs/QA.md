# QA record

Date: 2026-10-15 · Build: Next.js 15.5.28 production (`next build` + `next start`), Windows 11, Node 24.
Browser automation: Playwright driving Chrome (stable) from a scratch directory (not a project dependency).
Lighthouse 12, mobile preset (Moto G Power emulation, simulated slow 4G, 4× CPU).

## 1. Build, types, lint, console

| Check                                                 | Result                                                                                                                                                                                                         |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run build`                                       | Pass — 81 static pages/routes (every page SSG; only `[...rest]` is dynamic, it just 404s)                                                                                                                      |
| `npx tsc --noEmit`                                    | Pass                                                                                                                                                                                                           |
| `npm run lint`                                        | Pass (0 errors, 0 warnings)                                                                                                                                                                                    |
| `npm run format:check`                                | Pass                                                                                                                                                                                                           |
| Dev server (`npm run dev`), all 36 routes × 2 locales | No hydration warnings, no console errors or warnings (72/72). One fix made: the first image of the products, solutions and projects grids is now `priority` (Next reported it as an un-prioritised LCP image). |
| Production server, all 72 routes                      | 72/72 clean; HTTP 200, one `h1`, correct `lang` and `dir` on every page                                                                                                                                        |

## 2. Locales and RTL

- Every route renders in `en` and `ar`; `<html lang dir>` follows the locale.
- RTL checked visually on home, products, family, project, contact, quote, about (390 and 1440 px): mirrored grid
  order, start-aligned text, breadcrumb chevrons and arrows flipped (verified by pixel test: right-pointing in
  English, left-pointing in Arabic), the traceability line drawing right-to-left, the CCT track reversed, the sector
  rail scrolling RTL.
- Language switch keeps path, query and hash: `/en/products?category=outdoor` → `/ar/products?category=outdoor`, with
  the filter restored. ✔
- Fonts: English pages load only Archivo; Arabic pages load the two preloaded Arabic files plus Archivo (Latin
  glyphs such as "LED" stay in Archivo). ✔

## 3. Hero

| Check                                     | Result                                                                                                                                                                                                                                                                                                |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mock mode (no video, placeholder posters) | CSS light field renders; pause button present                                                                                                                                                                                                                                                         |
| Real mode                                 | Verified with synthetic clips through `npm run media:hero`: no `<source>` at `load`; sources appended after load + idle; desktop WebM on landscape, mobile WebM on portrait; `playing` → crossfade; pause works; one poster request per viewport; CLS 0. Test media then removed.                     |
| Poster as LCP                             | `<picture>` with `fetchpriority=high` and per-media preloads. With the synthetic gradient poster Chrome chose the H1 (it ignores low-entropy images); a photographic poster becomes the LCP element.                                                                                                  |
| Intro                                     | All intro animations run once and are not restarted (word clocks rise monotonically to 1220 ms). Two bugs found and fixed: a CSS-Modules-renamed keyframe that stopped the word reveal, and GSAP re-parenting the pinned section (which restarted the intro) — fixed by supplying our own pin spacer. |
| Reduced motion                            | Static, complete hero; pause control hidden; no Lenis, no pins                                                                                                                                                                                                                                        |
| Pause control                             | Toggles `data-paused`; light-field animations report `paused`; label switches to "Play background motion"                                                                                                                                                                                             |

## 4. Scroll choreography

| Context                 | Lenis | Pins                   | Notes               |
| ----------------------- | ----- | ---------------------- | ------------------- |
| Desktop, fine pointer   | on    | 2 (hero, traceability) | scrubbed            |
| Desktop, reduced motion | off   | 0                      | static end states   |
| Tablet 1024 px, touch   | off   | 0                      | light parallax only |
| Phone 390 px, touch     | off   | 0                      | light parallax only |

Route change: after scrolling the home page and navigating to `/solutions` there are 0 pin spacers and 0 fixed
elements in `<main>`, and the page starts at the top; going back recreates exactly 2 pins. A race (Lenis still easing
a wheel scroll while navigating) was found and fixed by settling Lenis on click / popstate.

## 5. Forms

Contact and quotation forms, tested with Playwright:

- Empty submit → inline errors, `aria-invalid`, `aria-describedby`, focus on the first invalid field ✔
- Invalid email on blur ✔ · `?family=street-roadway` preselects the family ✔ · role and family required on quotes ✔
- Honeypot filled → success shown, no request sent ✔
- **Backend path** (local `Inquiry` model introspection, `.invalid` endpoint, GraphQL intercepted): `createInquiry`
  sent with every field (`type`, `locale`, `page`, `role`, `productFamily`…) ✔, success state ✔, second submission
  within 30 s refused ✔, HTTP 500 → error state with retry (Arabic) ✔, no console errors ✔
- **Fallback path** (current `amplify_outputs.json`, which predates `Inquiry`): "online form not connected" notice,
  no request sent ✔. No sandbox write was attempted (see DECISIONS → Backend).

## 6. Viewports

No horizontal overflow on 12 pages × 2 locales × 5 widths (390, 768, 1024, 1440, 1920 — 120 combinations, all
`content-visibility` sections rendered before measuring). Screenshots reviewed at each width; one fix: the hero proof
row now stays a 2 × 2 grid until 1024 px (at 768 px its fourth item wrapped behind a divider).

Interaction checks (18/18 pass): mega panel (13 links, Escape closes, focus returns — a hover-timer race fixed),
mobile menu (dialog, focus trap, scroll lock, Escape, focus return), products filter, bento first-tap-reveals /
second-tap-navigates on touch, hero pause, 404s for unknown family, path and project (all 404 with the designed page).

### Accessibility sweep

- **axe-core 4** on all 36 routes × 2 locales (WCAG 2.0–2.2 A/AA and best-practice rules, page scrolled first so
  every section is rendered): **72/72 pages with no violations**.
- **Keyboard:** first Tab lands on the skip link, Enter moves focus to `<main>` (both locales); the header order is
  wordmark → Products → Solutions → Manufacturing → Projects → About → language → Request a quotation, then the page.
  Every stop is visible and settles on the 2 px lumen ring (links with `transition-colors` fade the ring in over 150 ms).

### Other engines

Playwright WebKit 27.2 (iPhone 14 profile and 1440 px) and Firefox 157 (1440 px and 390 px), on `/en`, `/ar`,
`/en/products`, `/ar/products/street-roadway`, `/en/manufacturing`, `/ar/contact`: HTTP 200, no console errors, no
horizontal overflow, intro animations complete, correct font per locale, and `color-mix()`, `:has()` and
`overflow: clip` all supported. Firefox renders identically to Chrome.

One WebKit finding, **to verify on a real iPhone / Mac**: in Playwright's _Windows_ WebKit build, Archivo's width axis
widens the letter advances but not the outlines, so expanded headings look letter-spaced. A test page shows the same
with the original, unmodified Google Fonts file, so it is that build's font backend, not the subset; real Safari renders
variable fonts through CoreText. If a real device shows it, the fallback is to drop `font-stretch` on headings.

Not tested: physical devices, real Safari, a manual screen-reader pass.

## 7. Performance

### Lighthouse, mobile (median of 3 runs, production build, `NEXT_PUBLIC_SITE_URL` = test origin)

| Page                | Perf | A11y | Best pr. | SEO | FCP   | LCP (simulated) | LCP (observed) | TBT   | CLS   |
| ------------------- | ---- | ---- | -------- | --- | ----- | --------------- | -------------- | ----- | ----- |
| `/en`               | 97   | 100  | 100      | 100 | 1.2 s | 2.5 s           | 0.38 s         | 50 ms | 0     |
| `/en/products`      | 97   | 100  | 100      | 100 | 1.1 s | 2.5 s           | 0.24 s         | 40 ms | 0     |
| `/en/manufacturing` | 97   | 100  | 100      | 100 | 1.2 s | 2.5 s           | 0.24 s         | 50 ms | 0.006 |
| `/ar`               | 94   | 100  | 100      | 100 | 1.2 s | 2.9 s           | 0.39 s         | 60 ms | 0     |
| `/ar/products`      | 94   | 100  | 100      | 100 | 1.2 s | 3.1 s           | 0.25 s         | 60 ms | 0.003 |

The small CLS on two pages is Archivo swapping in: local Windows builds never preload `next/font` files (Next 15.5
bug, see DECISIONS → Fonts). With that one line patched locally to behave like the Linux build Amplify runs (patch
reverted afterwards), every page above measured **CLS 0** and FCP 0.8–1.0 s.

**Floor:** the near-empty `/en/privacy` page simulates LCP 2.4 s (observed 0.23 s), so the 2.5 s home page is at the
stack's floor rather than held back by its own content.

**Prefetching:** after switching links to intent-based prefetching, scrolling the whole home page on a phone triggers
0 route prefetches (previously 32, ≈ 3.1 MB uncompressed). Hover still prefetches; navigation then takes ≈ 50 ms.

SEO is 100 with the real site URL; with the default `https://albayan.example` the `canonical` audit flags the cross-origin
canonical when testing on localhost (92).

### Against the budget

| Budget                         | Status                                                                                                                                                                                                                                                                                                                 |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Performance ≥ 95               | Met on all English pages (97); Arabic 93–95 (the two Arabic fonts sit in the critical window)                                                                                                                                                                                                                          |
| LCP ≤ 2.0 s                    | **Not met in Lighthouse's simulation** (2.5 s en, 2.9–3.1 s ar). Observed LCP is 0.24–0.41 s. The simulation counts every request started before the paint; what remains is the ~100 kB React/Next runtime, the HTML + RSC payload and the fonts. See DECISIONS → Performance for everything moved out of that window. |
| CLS = 0                        | Met (0 everywhere on the Linux-equivalent build; ≤ 0.006 on the local Windows build)                                                                                                                                                                                                                                   |
| INP ≤ 200 ms                   | Not measurable in a navigation run; TBT 40–90 ms is the lab proxy                                                                                                                                                                                                                                                      |
| TBT ≤ 150 ms                   | Met (40–90 ms)                                                                                                                                                                                                                                                                                                         |
| First-load JS for `/` ≤ 200 kB | Met — **124 kB**                                                                                                                                                                                                                                                                                                       |

### First-load JS (from `next build`)

| Route                                                      | First load |
| ---------------------------------------------------------- | ---------- |
| Shared by all                                              | 104 kB     |
| `/[locale]` (home)                                         | 124 kB     |
| `/products`, `/contact`, `/quote`, family, sector, project | 115–117 kB |
| `/privacy`, `/terms`                                       | 110 kB     |

Loaded after idle or on demand (not in first load): GSAP + ScrollTrigger (≈ 44 kB), motion (≈ 43 kB, menus and page
transitions), Lenis (≈ 5 kB, desktop only), aws-amplify (forms, on focus/submit).

## 8. Documentation

`README.md` (run locally, deploy on Amplify Hosting, adding real media, editing content), `docs/PLAN.md`,
`docs/DECISIONS.md`, `docs/QA.md` (this file), `CONTENT-TODO.md` (generated), `fonts/README.md`.

## Real media (2026-10-15)

Production build, `next start`, Chrome 1440×900 / Pixel 7 / Lighthouse mobile. Scripts in the session scratchpad.

| Check                              | Result                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Every image, every route (EN + AR) | 66 page visits, scrolled to the end: 0 broken, 0 collapsed, 0 not loaded, 0 failed media requests, every photo served from `/_img/` variants, no photo file twice on one page. Placeholders left: retail-malls, education-healthcare, sports-outdoor, ip-test, project-06.                                                                                                                                       |
| Home media weight                  | 33 photos, 1.35 MB total after scrolling the whole page (reduced motion, so no video).                                                                                                                                                                                                                                                                                                                           |
| Hero loop                          | Desktop plays `hero-desktop.webm` (2.3 MB), phone `hero-mobile.webm` (0.8 MB); `playing` ≈ 0.3–0.4 s after navigation locally; each device requests only its own file; reduced motion requests no video.                                                                                                                                                                                                         |
| Manufacturing film                 | Desktop `line-desktop.webm` (0.5 MB), phone `line-mobile.webm` (0.27 MB); `playing` ≈ 0.3–0.4 s; pause control appears once it plays (end side in RTL); reduced motion: poster only, no request, no button.                                                                                                                                                                                                      |
| Poster = first frame               | Posters are taken from the loop start frame; no visible change when the video fades in (checked in screenshots).                                                                                                                                                                                                                                                                                                 |
| `npm run dev` (Turbopack)          | All routes 200 with variant URLs and zero optimizer URLs; 72/72 routes without console errors, warnings or hydration mismatches.                                                                                                                                                                                                                                                                                 |
| Lighthouse mobile (after warm-up)  | Home EN 95 / AR 91 performance (LCP element: H1 — the full-viewport poster is treated as background), manufacturing 92–94 (LCP element: the film poster, observed 0.23–0.25 s); accessibility and best practices 100. The first run after a server start was an outlier (84, video counted as LCP, a contrast miss on text mid-reveal); not reproduced in three reruns or with the same emulation in Playwright. |
| Manufacturing CLS                  | 0.006, from the web font swapping on the facility paragraph — not media.                                                                                                                                                                                                                                                                                                                                         |
| Variant build                      | 437 WebP files, 18 MB, ≈ 14 s cold; 0.4 s when nothing changed; stale variants removed when a photo changes.                                                                                                                                                                                                                                                                                                     |
