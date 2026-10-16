# Al Bayan website — build plan

Bilingual (EN / AR-RTL) corporate site for Al Bayan Electronics & LED Technologies Factory, Qatar.
Next.js App Router on AWS Amplify Gen 2. Decisions and deviations are logged in `docs/DECISIONS.md`.

## Stack

| Concern       | Choice                                                                                                   |
| ------------- | -------------------------------------------------------------------------------------------------------- |
| Framework     | Next.js 15.5 (App Router), React 19, TypeScript 5.9 strict                                               |
| Styling       | Tailwind CSS v4, tokens in `@theme` (`app/globals.css`), logical utilities only                          |
| i18n          | next-intl 4, `app/[locale]/`, `localePrefix: 'always'`, middleware                                       |
| UI motion     | `motion` (`motion/react`), `LazyMotion` + `domAnimation` inside lazily loaded menus and page transitions |
| Scroll motion | GSAP 3 + ScrollTrigger via `@gsap/react` `useGSAP`, registered in `lib/gsap.ts`                          |
| Smooth scroll | Lenis, desktop fine-pointer only, lazy-loaded, driven by `gsap.ticker`                                   |
| Icons         | lucide-react (stroke 1.5)                                                                                |
| Backend       | Amplify Gen 2 Data: `Inquiry` model, public API key create-only                                          |
| Media tooling | sharp (placeholders, noise), ffmpeg (hero encode)                                                        |

## Routes (`app/[locale]/…`, locales `en`, `ar`)

`/` · `/products` · `/products/[family]` · `/solutions` · `/solutions/[sector]` · `/manufacturing` ·
`/projects` · `/projects/[slug]` · `/about` · `/contact` · `/quote` · `/privacy` · `/terms` · `not-found`.
All statically generated (`generateStaticParams`, `setRequestLocale`, `dynamicParams = false`).
Plus `app/sitemap.ts`, `app/robots.ts`, `opengraph-image.tsx` (locale + per family).

## Component tree

```
app/[locale]/layout.tsx        html lang/dir, fonts, providers, Header, Footer, WhatsAppFloat
  providers: SmoothScroll (lazy Lenis), RevealObserver, DeferredMediaObserver; motion via MotionScope in lazy chunks
  template.tsx → PageTransition (motion, skipped on first load)
components/
  layout/   Header, DesktopNav, MegaPanel, MobileMenu, LanguageSwitch, Wordmark, Footer,
            WhatsAppFloat, SkipLink, QatarMark
  hero/     Hero (client), HeroPoster, HeroLightField, HeroHeadline, hero.module.css
  media/    LoopVideo (shared background loop), AmbientVideo (in-page film + pause control)
  home/     ProductBento (+ FlashlightGrid), CctExplorer, TraceabilityChain, ManufacturingSteps,
            SectorRail, FeaturedProjects, Stats, StartProject
  catalogue/ CatalogueBrowser (filters, search), ModelCard, AddToQuoteButton
  company/  CompanyNav          search/ SearchButton, SearchDialog (lazy)
  ui/       Button/ButtonLink, MagneticButton, PageHeader, WordReveal, Breadcrumbs, Badge,
            SectionHeading, CtaBand, ProductCard, SectorCard, ProjectCard, JsonLd
  products/ ProductFilter          projects/ ProjectFilter
  forms/    InquiryForm (contact | quote)
content/    site, company, products, catalogue(.json), solutions, projects(.json), manufacturing, assets,
            taxonomy, types, legacy-urls.json,
            media-manifest.json (generated)
lib/        gsap, smooth-scroll, placeholder, i18n helpers, seo, jsonld, amplify-client, motion tokens,
            image-loader + image-sizes.json (static WebP variants)
scripts/    make-placeholders.mjs, media-manifest.mjs (+ image variants), encode-video.sh, content-todo.mjs
```

## Install list

next@15.5 react@19 react-dom@19 next-intl motion gsap @gsap/react lenis lucide-react aws-amplify ·
dev: typescript@5.9 tailwindcss @tailwindcss/postcss eslint@9 eslint-config-next@15.5 @eslint/eslintrc
@next/bundle-analyzer sharp @types/* + Amplify backend packages. Removed: @aws-amplify/ui-react.

## Milestones (one commit each; build + tsc + lint must pass)

1. **M1 foundation** — upgrade stack, Tailwind tokens, fonts, next-intl routing/middleware,
   content model + placeholder system, asset manifest + placeholder/noise generation, Todo demo removed.
2. **M2 layout** — header (scroll state, mega panel, mobile overlay), footer, language switch,
   skip link, Lenis, page transition, 404.
3. **M3 hero** — poster LCP via `<picture>`, deferred video manager, light-field mock mode,
   CSS switch-on intro, GSAP pin/scrub, pause control.
4. **M4 home sections** — bento + flashlight, CCT explorer, traceability chain, daylight
   manufacturing steps, sector rail, projects, stats (hidden), start-a-project band.
5. **M5 inner pages** — products, family, solutions, sector, manufacturing, projects, project,
   about, privacy, terms.
6. **M6 contact/quote + backend** — Inquiry model, form (validation, honeypot, rate limit,
   states, fallback), contact and quote pages.
7. **M7 SEO, performance, QA** — metadata, OG images, sitemap/robots, JSON-LD, budgets measured,
   CONTENT-TODO, README, QA record.

Status: all seven milestones delivered — see `docs/QA.md` for results and `docs/DECISIONS.md` for deviations.
