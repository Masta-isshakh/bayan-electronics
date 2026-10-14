import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { site } from "@/content/site";
import { localeMeta, locales, type Locale } from "@/i18n/locales";

/** Absolute URL for a locale + path ("/" → "/en"). */
export function absoluteUrl(locale: Locale, path: string): string {
  const suffix = path === "/" ? "" : path;
  return `${site.url}/${locale}${suffix}`;
}

/** hreflang alternates: en-QA, ar-QA and x-default (English). */
export function languageAlternates(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(locales.map((locale) => [localeMeta[locale].hreflang, absoluteUrl(locale, path)])),
    "x-default": absoluteUrl("en", path),
  };
}

type PageMetadataInput = {
  locale: Locale;
  /** Path without the locale prefix, e.g. "/products/led-panels". */
  path: string;
  title: string;
  description: string;
};

/** Metadata for one page in one locale: "{Page} — {Brand}", canonical, hreflang, Open Graph, Twitter. */
export async function pageMetadata({ locale, path, title, description }: PageMetadataInput): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  const fullTitle = `${title} — ${t("titleSuffix")}`;
  const url = absoluteUrl(locale, path);
  const other = locales.filter((candidate) => candidate !== locale);

  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type: "website",
      url,
      title: fullTitle,
      description,
      siteName: site.brand.name[locale],
      locale: localeMeta[locale].ogLocale,
      alternateLocale: other.map((candidate) => localeMeta[candidate].ogLocale),
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}
