// URLs of the previous WordPress site (b-ledtec.com). Once this site serves the domain,
// links and search results pointing at old pages land on their new equivalents (301),
// and the spam the old site was injected with — plus WordPress internals — answers
// 410 Gone so search engines drop it. Used by middleware.ts before locale routing.
import legacyData from "@/content/legacy-urls.json";
import { defaultLocale } from "@/i18n/locales";

type LegacyData = {
  /** Old project posts: WordPress post id → new project slug. */
  projects: Record<string, string>;
  /** Old product URLs: lowercase product slug (e.g. "hb82-in1-860-05-150") → model code. */
  products: Record<string, string>;
};
const data = legacyData as LegacyData;

/** Old English pages (served without a locale prefix) → new paths. */
const pages: Record<string, string> = {
  "/about-us": "/about",
  "/ceo-message": "/about/ceo-message",
  "/organization-structure": "/about/organization",
  "/become-a-distributor": "/distributors",
  "/project-list": "/projects",
  "/shop": "/catalogue",
  "/category-tree": "/catalogue",
  "/compare": "/catalogue",
  "/store-listing": "/catalogue",
  "/news": "/",
  "/blog": "/",
  "/dashboard": "/",
  "/privacy-policy": "/privacy",
  "/privacy-policy-2": "/privacy",
  "/terms-and-conditions": "/terms",
  "/refund-and-returns-policy": "/terms",
  "/wishlist": "/quote",
  "/cart": "/quote",
  "/cart-2": "/quote",
  "/checkout": "/quote",
  "/checkout-2": "/quote",
  "/my-account": "/contact",
  "/my-account-2": "/contact",
  "/my-orders": "/contact",
  "/order-tracking": "/contact",
};

/** Old Arabic pages (/ar/<arabic slug>) → new paths. */
const arabicPages: Record<string, string> = {
  "نبذة-عنا": "/about",
  "رسالة-الرئيس-التنفيذي": "/about/ceo-message",
  "الهيكل-التنظيمي": "/about/organization",
  "كن-موزعاً": "/distributors",
  "اتصل-بنا": "/contact",
  المشاريع: "/projects",
  "قائمة-المشاريع": "/projects",
  الأخبار: "/",
  مدونة: "/",
  المتجر: "/catalogue",
  "قائمة-المتجر": "/catalogue",
  "سياسة-الخصوصية": "/privacy",
  shop: "/catalogue",
  cart: "/quote",
  checkout: "/quote",
  "my-account": "/contact",
};

/** WordPress internals and the spam namespaces. */
const gonePrefixes = ["/feed", "/comments/feed", "/wp-json", "/wp-admin", "/category/", "/tag/", "/author/", "/page/"];

export type LegacyResult = { redirect: string } | { gone: true } | null;

const trim = (path: string) => (path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path);

/** Resolves a request path of the old site; null when the path is not an old URL. */
export function resolveLegacy(rawPath: string): LegacyResult {
  let path: string;
  try {
    path = trim(decodeURIComponent(rawPath));
  } catch {
    return null;
  }
  const lower = path.toLowerCase();

  // Old project posts (English and Arabic) keep working; every other /archives/<id> was spam.
  const post = /^\/(?:(ar)\/)?archives\/(\d+)$/.exec(lower);
  if (post) {
    const slug = data.projects[post[2]];
    return slug ? { redirect: `/${post[1] ?? defaultLocale}/projects/${slug}` } : { gone: true };
  }
  if (lower.startsWith("/archives") || lower.startsWith("/ar/archives")) return { gone: true };

  // Old products: /shop/<sku> (and /ar/shop/<sku>, /product/<sku>).
  const product = /^\/(?:(ar)\/)?(?:shop|product)\/([^/]+)$/.exec(lower);
  if (product) {
    const locale = product[1] ?? defaultLocale;
    const code = data.products[product[2]];
    return {
      redirect: code
        ? `/${locale}/catalogue/${code.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
        : `/${locale}/catalogue`,
    };
  }
  const category = /^\/(?:(ar)\/)?product-category\/(?:[^/]+\/)*([^/]+)$/.exec(lower);
  if (category) {
    const locale = category[1] ?? defaultLocale;
    // Per-model categories (e.g. /product-category/…/hb82) go to the model page.
    const code = data.products[`category:${category[2]}`];
    return {
      redirect: code
        ? `/${locale}/catalogue/${code.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
        : `/${locale}/catalogue?category=${encodeURIComponent(category[2])}`,
    };
  }

  if (gonePrefixes.some((prefix) => lower.startsWith(prefix))) return { gone: true };

  if (pages[lower]) return { redirect: `/${defaultLocale}${pages[lower] === "/" ? "" : pages[lower]}` };

  const arabic = /^\/ar\/(.+)$/.exec(path);
  if (arabic && arabicPages[arabic[1]]) {
    const target = arabicPages[arabic[1]];
    return { redirect: `/ar${target === "/" ? "" : target}` };
  }
  return null;
}
