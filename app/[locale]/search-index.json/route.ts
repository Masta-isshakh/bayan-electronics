import { getTranslations } from "next-intl/server";
import type { SearchEntry } from "@/components/search/search-types";
import { categoryTrail, models, powerLabel } from "@/content/catalogue";
import { products } from "@/content/products";
import { projects } from "@/content/projects";
import { sectors } from "@/content/solutions";
import { locales, type Locale } from "@/i18n/locales";

// The site-search index (components/search), one static JSON file per locale built at
// build time and fetched only when a visitor opens search.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const thumb = (src: string, width: number) => {
  const match = /^\/media\/(.+)\.(?:jpe?g|png)\?v=([0-9a-f]+)&w=(\d+)$/.exec(src);
  return match ? `/_img/${match[1]}.${match[2]}.${Math.min(128, Number(match[3]), width)}.webp` : undefined;
};

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const other: Locale = locale === "en" ? "ar" : "en";
  const t = await getTranslations({ locale, namespace: "nav" });
  const tm = await getTranslations({ locale, namespace: "meta" });
  const tcn = await getTranslations({ locale, namespace: "company.nav" });

  const entries: SearchEntry[] = [
    ...models.map((model) => ({
      kind: "model" as const,
      title: model.code,
      subtitle: `${model.type[locale]} · ${powerLabel(model)}`,
      href: `/catalogue/${model.slug}`,
      keywords: [
        model.type[other],
        ...model.variants.map((variant) => variant.sku),
        ...categoryTrail(model).flatMap((category) => [category.name.en, category.name.ar]),
      ].join(" "),
      image: model.image ? thumb(model.image.src, model.image.width) : undefined,
    })),
    ...products.map((family) => ({
      kind: "family" as const,
      title: family.name[locale],
      subtitle: family.descriptor[locale],
      href: `/products/${family.slug}`,
      keywords: family.name[other],
    })),
    ...sectors.map((sector) => ({
      kind: "sector" as const,
      title: sector.name[locale],
      subtitle: sector.line[locale],
      href: `/solutions/${sector.slug}`,
      keywords: sector.name[other],
    })),
    ...projects.map((project) => ({
      kind: "project" as const,
      title: project.title[locale],
      subtitle: project.title[other],
      href: `/projects/${project.slug}`,
      keywords: "",
    })),
    ...(
      [
        ["/catalogue", t("catalogue"), t("catalogueIntro")],
        ["/products", t("products"), tm("products.description")],
        ["/manufacturing", t("manufacturing"), tm("manufacturing.description")],
        ["/projects", t("projects"), tm("projects.description")],
        ["/about", tcn("about"), tm("about.description")],
        ["/about/ceo-message", tcn("ceo"), tm("ceo.description")],
        ["/about/organization", tcn("organization"), tm("organization.description")],
        ["/distributors", tcn("distributor"), tm("distributor.description")],
        ["/contact", t("contact"), tm("contact.description")],
        ["/quote", tm("quote.title"), tm("quote.description")],
      ] as const
    ).map(([href, title, subtitle]) => ({ kind: "page" as const, title, subtitle, href, keywords: "" })),
  ];

  return Response.json(entries, { headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" } });
}
