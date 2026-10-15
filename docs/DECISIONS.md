# Decisions

Decisions taken without stopping to ask, with the reason. Newest at the bottom of each section.

## Stack

- **Next.js 15.5 (not 16).** The starter shipped 14.2; the brief says upgrade if < 15. Next 16 is current,
  but AWS's "Amplify support for Next.js" page still lists support "up through Next.js 15", so 15.5 is the
  newest version Amplify Hosting officially supports.
- **React 19.3, TypeScript 5.9.** TypeScript 7 (native) is the npm `latest`, but Next 15's build-time type
  check relies on the classic compiler API; 5.9 is the newest 5.x.
- **ESLint 9 flat config via `FlatCompat`** with `next/core-web-vitals` + `next/typescript`. `next lint` is
  deprecated in 15.5, so `npm run lint` runs `eslint .`.
- **motion 14** (the current major of the package the brief calls "Framer Motion v12"); same
  `motion/react` API: `LazyMotion`, `m`, `domAnimation`.
- **`@aws-amplify/ui-react` removed.** Only the Todo demo used it.
- **Starter `LICENSE` (MIT-0), `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md` removed.** They belong to the
  aws-samples template repository; a client's corporate site should not ship an open licence for its content.
- **Fresh lockfile.** `node_modules` and `package-lock.json` were rebuilt from scratch so the lockfile records
  the Linux binaries (`@img/sharp-linux-x64`, `lightningcss-linux-x64-gnu`, Tailwind oxide, SWC) Amplify CI needs.

## Content and media

- **Locales are defined in `i18n/locales.ts`** (no next-intl import) so content files and Node scripts can use them.
- **Unconfirmed values use `pending("…")`**, which produces the `[[CONFIRM: …]]` string. Records the client must
  sign off carry `confirm: true`; copy that is shown but needs checking (e.g. the Arabic brand name) carries
  `confirm: "<what>"` on its `{ en, ar }` object. `scripts/content-todo.mjs` imports the typed content with
  `tsx` and walks it, so generated placeholders (11 families × 6 specs) are listed individually.
- **Media URLs are content-versioned.** `/media/*` is served `immutable` for a year, as required, but the client
  will replace placeholder files under the same names. `scripts/media-manifest.mjs` (run before `dev` and `build`)
  hashes every file into `content/media-manifest.json`; `content/assets.ts` appends `?v=<hash>` to each URL, so a
  replaced file gets a new URL in the browser, the CDN and the `next/image` cache.
- **Placeholders are machine-detectable.** Generated images carry an EXIF marker and SVGs a comment; the manifest
  records `placeholder: true`. The hero uses this to show the CSS light field instead of a placeholder poster, and
  the header shows the typographic wordmark until a real logo exists.
- **Placeholder images** follow the brief (surface→void gradient, faint lumen radial, filename) plus a faint LED-dot
  texture so they read as intentional.

## Fonts

- **Archivo is self-hosted through `next/font/local`**, reduced to weight 400–700 × width 100–125 % and Latin-1
  (88 → 46 kB). Details in `fonts/README.md`.
- **Arabic is not loaded through `next/font`** (deviation from the brief). The `[locale]` layout is shared by both
  locales, so next/font can either preload the Arabic font on every English page or not at all; it also emits every
  Google subset, so Arabic pages downloaded Plex's Latin faces (six files, ≈ 150 kB) and Latin text briefly rendered
  in them. Instead, `public/fonts/arabic-sans-{400,700}.v1.woff2` — subsets of IBM Plex Sans Arabic limited to the
  Arabic block, presentation forms and joiners (≈ 33 kB each) — are declared with `@font-face` (Arabic
  `unicode-range` only) and preloaded by the layout **only when the locale is `ar`**. English pages never request
  them. Result on `/ar`: FCP 2.1 → 1.2 s, three fewer font files.
- **The Arabic subset is renamed "Al Bayan Arabic Sans".** IBM's OFL reserves the name "Plex", and a subset is a
  modified version. Licence files ship next to both fonts.
- **Weight 500 resolves to 400 in Arabic** (only 400 and 700 ship) — Arabic typography here relies on regular vs bold.
- **Local Windows builds show no `next/font` preload at all.** Next 15.5's font-manifest plugin matches
  `'/next-font-loader/index.js?'` with forward slashes, which never matches Windows module paths. Linux builds
  (Amplify CI) are unaffected. Verified by patching that line locally (then reverting): with the preload, every
  measured page had CLS 0 and FCP 0.8–1.0 s. Lighthouse runs on a local Windows build are slightly pessimistic.

## Backend

- **`Inquiry` model added in M1**, because removing the Todo demo leaves the schema empty.
- **No `ampx sandbox` deployment.** The machine has ~20 AWS profiles for different projects and none is
  identifiable as Al Bayan's, so deploying would risk creating resources in the wrong account. An
  `amplify_outputs.json` from the existing Amplify app (still describing the old Todo model) is present locally;
  the form checks for the `Inquiry` model at runtime and falls back to WhatsApp / email until the backend redeploys.

## Motion and hero

- **The switch-on intro is pure CSS**, keyed on `[data-hero-intro]`. It starts with the first paint instead of
  waiting for hydration, never blocks input, and collapses to its end state under reduced motion. A module flag in
  `Hero.tsx` drops the attribute on later client-side visits, so it plays once per page load. The header slide-in
  uses `html:has([data-hero-intro]) [data-site-header]`, so the layout does not need to know the route.
- **Words are split on the server** (`components/motion/SplitWords.tsx`) instead of with GSAP SplitText: no extra
  plugin bytes, no layout shift at hydration, correct for Arabic (words only, never characters). SplitText is
  therefore not registered.
- **Intro reveals use clip-path + slide, not a fade from `opacity: 0`.** Chrome ignores opacity-0 paints for LCP,
  so a faded-in subline became a late LCP candidate (~1.7 s on mobile) in testing; clip-path paints count immediately.
- **Hero media mode is chosen from the media manifest:** a real poster (not a generated placeholder) becomes the LCP
  `<picture>` with per-media-query preloads; otherwise the CSS light field shows. Video layers on top only when all
  four encoded files exist. Verified with synthetic clips run through `npm run media:hero` (sources appended only
  after `load` + idle, correct portrait/landscape set, crossfade, pause, CLS 0), then reverted.
- **Intro and scroll transforms live on different elements** (`.mediaInner` vs `.media`, words vs content layer) so
  CSS animation fill never overrides GSAP's inline transforms.
- **Pause control is 44 × 44 px** (brief: 40 px) to meet the 44 px touch-target rule; it also pauses the light field
  and scroll cue, and is hidden under reduced motion, when nothing moves.
- **Hero content fades over the first 30% of the pin** so the headline is gone before the next section covers it.
- **Lenis is loaded after hydration** and only when the desktop motion query matches, so it never counts toward
  first-load JS; it shares GSAP's ticker.
- **WhatsApp prefill is localized** (English on /en, Arabic on /ar) rather than one message containing both languages.
- **`lib/gsap.ts` refreshes ScrollTrigger** after fonts load, after page transitions, and when the document height
  changes (ResizeObserver, guarded against refresh loops), which covers `content-visibility` sections rendering late.

## Performance (measured with Lighthouse mobile, simulated slow 4G)

Baseline after M4 sections: Performance 94, simulated LCP 3.0 s, observed LCP 0.46 s, first-load JS 180 kB.
Lighthouse's simulation counts every request started before the LCP paint, so the work went into getting
bytes out of that window:

- **GSAP loads after idle.** Each scroll choreography is a small behaviour component (`HeroScroll`,
  `TraceScroll`, `KenBurnsScroll`) that still uses `useGSAP` scoped to its owner's ref, loaded with
  `next/dynamic` once the browser is idle. The markup is complete without it (fully drawn / static states).
- **motion loads after idle.** `LazyMotion` + `domAnimation` now live in `MotionScope`, inside the lazily loaded
  menus (`MegaPanel`, `MobileMenu`, mounted on idle or first open) and `AnimatedPage`. Page transitions keep the
  motion wrapper in a module cache once loaded, so later navigations render it synchronously (no Suspense flash);
  the very first load is never animated anyway.
- **No message runtime on the client.** Client components get their strings as props from server wrappers
  (`components/layout/labels.ts`); `NextIntlClientProvider` only provides the locale (`messages={null}`).
- **Archivo self-hosted and reduced** (88 → 46 kB, see `fonts/README.md`).
- **Inline CSS** (`experimental.inlineCss`): removes the render-blocking stylesheet round trip (FCP 1.4 → 1.2 s).
- **Deferred media:** bento and CCT images stay `display:none` until within 400 px of the viewport, because Chrome's
  lazy-load distance (≈1250 px) would otherwise fetch every product photo during the first paint.
- **One image per bento tile:** the flashlight is a masked dimming layer instead of a second, brighter copy.
- **Grain tile after idle**, 16-level palette PNG (139 → 32 kB).
- **Modern `browserslist`** (Chrome/Edge 111, Firefox 113, Safari 16.4 — the CSS already needs these for
  `color-mix`, `:has()`, logical properties).

Result (home, warm server): Performance 97, FCP 1.2 s, simulated LCP 2.5 s (observed 0.43 s), TBT 70 ms, CLS 0,
first-load JS 123 kB. An experiment without the web font gave the same simulated LCP: the remainder is the
~100 kB React/Next runtime and the HTML + RSC payload that every App Router page carries.

## Inquiry form

- **`lib/amplify-client.tsx` configures Amplify once (`ssr: true`) and is imported on demand** by the form (preloaded
  when a field first gets focus), so `aws-amplify` never ships in first-load JS.
- **Backend readiness is detected from `amplify_outputs.json`:** if the file is the stub or has no `Inquiry` model in
  its model introspection, the form shows the WhatsApp / email fallback instead of calling the API.
  `scripts/ensure-amplify-outputs.mjs` (runs before `dev` and `build`) writes the stub when the file is missing.
- **Required fields:** contact — name, email, message (≥ 10 characters); quotation — name, email, "I am a", product
  family ("Not sure yet" allowed). Everything else is optional and labelled as such.
- **Submissions time out after 12 s.** Amplify retries 5xx responses with backoff, which left the form on "Sending…"
  for well over 15 s in testing; the visitor now gets the error state with retry and direct channels.
- **Honeypot submissions show the success state** without sending, so bots get no signal.
- **Tested end to end without deploying:** model introspection for `Inquiry` was generated locally from the schema
  (`@aws-amplify/graphql-generator`), `amplify_outputs.json` pointed temporarily at an `.invalid` AppSync URL, and
  Playwright intercepted the GraphQL call — the `createInquiry` mutation carried every field; success, server error
  (Arabic), rate limit, honeypot, validation and the fallback path all behaved as designed. The real outputs file was
  restored afterwards.
- **Favicon:** `app/icon.svg` (the LED-matrix mark) and a generated `app/apple-icon.png` replace the starter favicon.

## SEO, accessibility and late fixes (M7)

- **Open Graph cards are generated per locale and per product family** (`lib/og.tsx`, Archivo static instances in
  `fonts/og/`) and prerendered at build. They use Latin text only — Satori has no Arabic shaping — so Arabic pages
  share the English card while `og:title` / `og:description` stay Arabic.
- **Sample projects are `noindex` and left out of the sitemap** until `isPlaceholder` is false. The sitemap lists
  every other route in both locales with hreflang alternates (`en-QA`, `ar-QA`, `x-default`).
- **Organization JSON-LD omits every unconfirmed field** (address is country-only, no phone/email/logo/sameAs yet).
  Product JSON-LD has no offers or invented specifications.
- **Hero layers use `overflow: clip`, not `hidden`.** In RTL the light-field layers overflow leftwards; an
  `overflow: hidden` box is a scroll container whose RTL scroll origin is re-anchored as they move, which Chrome
  recorded as 0.13–0.21 CLS on `/ar`. `clip` creates no scroll container: CLS 0.
- **Pinned elements get their own pin spacer.** GSAP normally wraps a pinned element in a new div, moving it in the
  DOM — which restarts every CSS animation inside it, so the hero intro replayed when the scroll choreography loaded.
  Both pins now pass a React-owned parent as `pinSpacer`; GSAP only sets and restores its styles.
- **Hero words reference the global keyframes through `var(--animate-word-in)`.** CSS Modules rename a literal
  `word-in` inside `hero.module.css` to a module-local name with no keyframes, which silently disabled the reveal.
- **Lenis is settled on every click and `popstate`** so an in-flight smooth scroll cannot pull the next page away
  from the top after navigation.
- **Accessibility fixes from Lighthouse/axe:** the home links' accessible names now start with the visible wordmark
  ("AL BAYAN" + a screen-reader suffix), the inactive step numbers meet 3:1, and the first image of each index grid
  is `priority`.
- **LCP ≤ 2.0 s is not met in Lighthouse's simulation** (2.5 s English, 2.9–3.1 s Arabic; observed 0.24–0.41 s). The
  remaining pre-paint bytes are the React/Next runtime, the HTML + RSC payload and the fonts; removing more would
  mean dropping the self-hosted fonts or the App Router. Recorded in `docs/QA.md`.

## Follow-up after delivery

- **Links prefetch on intent, not on viewport entry.** Next's default prefetched every visible link's full RSC
  payload: scrolling the home page on a phone fetched 32 routes, ≈ 3.1 MB uncompressed, mostly from the bento tiles
  and ~30 footer links. `i18n/IntentLink.tsx` (exported as `Link` from `@/i18n/navigation`) disables that and calls
  `router.prefetch` on hover, keyboard focus or touch start instead. Scroll-time prefetching is now zero; a hovered
  link still navigates in ≈ 50 ms. `prefetch={false}` opts a link out completely.
- **LCP floor measured.** The near-empty privacy page simulates LCP 2.4 s (observed 0.23 s) — the home page at 2.5 s
  is at the stack's floor (React/Next runtime, HTML + RSC payload, one web font). Meeting 2.0 s in Lighthouse's
  simulation would require removing the web font from the first paint or leaving the App Router.
