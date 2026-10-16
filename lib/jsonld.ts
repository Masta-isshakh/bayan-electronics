import { assets } from "@/content/assets";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/locales";
import { confirmedOr, isPlaceholder } from "./placeholder";
import { absoluteUrl } from "./seo";

/** schema.org Organization. Unconfirmed fields are omitted entirely, never sent as placeholders. */
export function organizationJsonLd(locale: Locale): Record<string, unknown> {
  const email = confirmedOr(site.contact.email);
  const phone = confirmedOr(site.contact.phone);
  const street = confirmedOr(site.contact.address[locale]);
  const foundingDate = confirmedOr(site.foundingYear);
  const sameAs = site.social.filter((link) => !isPlaceholder(link.href)).map((link) => link.href);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.brand.name[locale],
    legalName: site.brand.legalName[locale],
    alternateName: [site.brand.trade, site.brand.tradeFull[locale], site.brand.short[locale]],
    brand: { "@type": "Brand", name: site.brand.trade },
    url: absoluteUrl(locale, "/"),
    address: { "@type": "PostalAddress", addressCountry: "QA", ...(street ? { streetAddress: street } : {}) },
    ...(assets.brand.logo.available ? { logo: `${site.url}${assets.brand.logo.src}` } : {}),
    ...(email ? { email } : {}),
    ...(phone ? { telephone: phone } : {}),
    ...(foundingDate ? { foundingDate } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    knowsLanguage: ["ar", "en"],
  };
}
