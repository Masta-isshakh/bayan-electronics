import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Download } from "lucide-react";
import { FamilyTile } from "@/components/products/FamilyTile";
import { FlashlightGrid } from "@/components/products/FlashlightGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { familiesBySlugs, getFamily, products } from "@/content/products";
import { site } from "@/content/site";
import { sectorsBySlugs } from "@/content/solutions";
import { specKeys } from "@/content/taxonomy";
import { Link } from "@/i18n/navigation";
import { resolveLocale } from "@/lib/i18n";
import { isPlaceholder } from "@/lib/placeholder";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

type Params = { params: Promise<{ locale: string; family: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((family) => ({ family: family.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const family = getFamily((await params).family);
  if (!family) return {};
  return pageMetadata({
    locale,
    path: `/products/${family.slug}`,
    title: family.name[locale],
    description: `${family.descriptor[locale]} ${family.intro[locale]}`,
  });
}

export default async function FamilyPage({ params }: Params) {
  const locale = await resolveLocale(params);
  const family = getFamily((await params).family);
  if (!family) notFound();

  const t = await getTranslations("family");
  const tp = await getTranslations("products");
  const ts = await getTranslations("specs");
  const tc = await getTranslations("common");
  const applications = sectorsBySlugs(family.applications);
  const related = familiesBySlugs(family.related);
  const downloads = family.downloads.filter((download) => !isPlaceholder(download.href));

  return (
    <>
      <PageHeader
        locale={locale}
        title={family.name[locale]}
        intro={family.descriptor[locale]}
        crumbs={[
          { label: tp("title"), href: "/products" },
          { label: family.name[locale], href: `/products/${family.slug}` },
        ]}
        aside={
          <div className="relative aspect-[4/5] overflow-hidden rounded-media border border-line bg-surface">
            <Image
              src={family.image.src}
              alt={family.alt[locale]}
              fill
              priority
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover"
            />
          </div>
        }
      >
        <p className="measure mt-6 text-base text-fg/85">{family.intro[locale]}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {family.categories.map((category) => (
            <li key={category} className="rounded-control border border-line-strong px-2.5 py-1 text-sm text-fg-muted">
              {tp(`filters.${category}`)}
            </li>
          ))}
        </ul>
        <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
          <ButtonLink href={{ pathname: "/quote", query: { family: family.slug } }}>{tc("requestQuote")}</ButtonLink>
          <ButtonLink href="/contact" variant="outline">
            {t("contact")}
          </ButtonLink>
        </div>
      </PageHeader>

      <section aria-labelledby="specs-title" className="daylight section-y">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="specs-title" className="display text-4xl">
              {t("specsTitle")}
            </h2>
            <p className="mt-5 text-base text-fg-muted">{t("specsNote")}</p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <table className="w-full border-collapse text-start text-base">
              <thead className="sr-only">
                <tr>
                  <th scope="col">{t("specColumn")}</th>
                  <th scope="col">{t("valueColumn")}</th>
                </tr>
              </thead>
              <tbody>
                {specKeys.map((key) => {
                  const value = family.specs[key];
                  const pending = isPlaceholder(value);
                  return (
                    <tr key={key} className="border-b border-rule first:border-t">
                      <th scope="row" className="py-4 pe-6 text-start align-top font-medium">
                        {ts(key)}
                      </th>
                      <td className={pending ? "py-4 text-fg-muted italic" : "py-4 tabular-nums"}>
                        {pending ? tc("toBeConfirmed") : value}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section aria-labelledby="applications-title" className="section-y cv-auto">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 id="applications-title" className="text-2xl font-medium">
              {t("applicationsTitle")}
            </h2>
            <ul className="mt-6 flex flex-wrap gap-2">
              {applications.map((sector) => (
                <li key={sector.slug}>
                  <Link
                    href={`/solutions/${sector.slug}`}
                    className="inline-flex min-h-11 items-center rounded-control border border-line-strong px-4 text-sm text-fg transition-colors hover:border-lumen"
                  >
                    {sector.name[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {downloads.length > 0 && (
            <div className="lg:col-span-5 lg:col-start-8">
              <h2 className="text-2xl font-medium">{t("downloadsTitle")}</h2>
              <ul className="mt-6 divide-y divide-line border-y border-line">
                {downloads.map((download) => (
                  <li key={download.id}>
                    <a
                      href={download.href}
                      className="flex min-h-14 items-center justify-between gap-4 text-fg hover:text-lumen"
                    >
                      {download.label[locale]}
                      <Download aria-hidden="true" strokeWidth={1.5} className="size-5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="shell mt-20">
          <h2 className="text-2xl font-medium">{t("relatedTitle")}</h2>
          <FlashlightGrid data-defer="" className="mt-6 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3">
            {related.map((item) => (
              <FamilyTile
                key={item.slug}
                family={item}
                locale={locale}
                sizes="(min-width: 1024px) 30vw, 50vw"
                className="aspect-[4/5] max-lg:last:col-span-2 max-lg:last:aspect-[2/1]"
              />
            ))}
          </FlashlightGrid>
        </div>
      </section>

      <CtaBand title={t("ctaTitle")} text={t("ctaText")} family={family.slug} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: family.name[locale],
          description: family.intro[locale],
          category: family.name.en,
          url: absoluteUrl(locale, `/products/${family.slug}`),
          ...(family.image.placeholder ? {} : { image: `${site.url}${family.image.src}` }),
          brand: { "@type": "Brand", name: site.brand.name[locale] },
          manufacturer: { "@type": "Organization", name: site.brand.legalName[locale], url: site.url },
        }}
      />
    </>
  );
}
