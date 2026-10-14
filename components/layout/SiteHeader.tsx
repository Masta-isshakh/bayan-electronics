import { products } from "@/content/products";
import type { Locale } from "@/i18n/locales";
import { Header } from "./Header";
import { Wordmark } from "./Wordmark";
import type { NavFamily, NavFeature } from "./nav";

const FEATURED_FAMILY = "custom-oem";

/** Server wrapper: resolves content for the locale so the client header ships no content modules. */
export function SiteHeader({ locale }: { locale: Locale }) {
  const families: NavFamily[] = products.map((family) => ({
    slug: family.slug,
    name: family.name[locale],
    descriptor: family.descriptor[locale],
  }));

  const featured = products.find((family) => family.slug === FEATURED_FAMILY) ?? products[0];
  const feature: NavFeature = {
    href: `/products/${featured.slug}`,
    title: featured.name[locale],
    text: featured.descriptor[locale],
    image: featured.image,
    alt: featured.alt[locale],
  };

  return <Header logo={<Wordmark />} families={families} feature={feature} />;
}
