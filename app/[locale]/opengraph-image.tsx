import { site } from "@/content/site";
import { localeStaticParams } from "@/lib/i18n";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = site.brand.name.en;
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return localeStaticParams();
}

/** Default share card for every page under /[locale] that has no card of its own. */
export default async function OpengraphImage() {
  return renderOgImage({
    kicker: `${site.brand.trade} · ${site.brand.name.en}`,
    title: "Light, engineered and built in Qatar.",
  });
}
