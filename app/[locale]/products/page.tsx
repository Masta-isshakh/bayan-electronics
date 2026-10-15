import { Image } from "@/components/ui/Image";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { FamilyTile } from "@/components/products/FamilyTile";
import { FlashlightGrid } from "@/components/products/FlashlightGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { FilterBar, type FilterOption } from "@/components/ui/FilterBar";
import { PageHeader } from "@/components/ui/PageHeader";
import { assets } from "@/content/assets";
import { getFamily, products } from "@/content/products";
import { productCategories } from "@/content/taxonomy";
import { type LocaleParams, resolveLocale } from "@/lib/i18n";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.products" });
  return pageMetadata({ locale, path: "/products", title: t("title"), description: t("description") });
}

export default async function ProductsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("products");
  const custom = getFamily("custom-oem");

  const options: FilterOption[] = [
    { value: "all", label: t("filters.all"), summary: t("results", { count: products.length }) },
    ...productCategories.map((category) => ({
      value: category,
      label: t(`filters.${category}`),
      summary: t("results", { count: products.filter((family) => family.categories.includes(category)).length }),
    })),
  ];

  return (
    <>
      <PageHeader
        locale={locale}
        title={t("title")}
        intro={t("intro")}
        crumbs={[{ label: t("title"), href: "/products" }]}
      />

      <section aria-label={t("title")} className="shell pb-24 lg:pb-32">
        <FilterBar param="category" options={options} label={t("filterLabel")} targetId="family-grid" />
        <FlashlightGrid id="family-grid" className="mt-8 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {products.map((family, index) => (
            <FamilyTile
              key={family.slug}
              priority={index < 2}
              family={family}
              locale={locale}
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="aspect-[4/5]"
            />
          ))}
        </FlashlightGrid>
      </section>

      {custom && (
        <section aria-labelledby="custom-title" className="daylight section-y cv-auto">
          <div className="shell grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-media border border-rule bg-day-text lg:col-span-6">
              <Image
                src={assets.home.factoryOverview.src}
                alt={t("custom.imageAlt")}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="lg:col-span-6">
              <h2 id="custom-title" className="display text-4xl">
                {t("custom.title")}
              </h2>
              <p className="measure mt-5 text-lg text-fg-muted">{t("custom.text")}</p>
              <ButtonLink href={`/products/${custom.slug}`} variant="outline" className="mt-8">
                {t("custom.cta")}
              </ButtonLink>
            </div>
          </div>
        </section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: t("title"),
          itemListElement: products.map((family, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: family.name[locale],
            url: absoluteUrl(locale, `/products/${family.slug}`),
          })),
        }}
      />
    </>
  );
}
