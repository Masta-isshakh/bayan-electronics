import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AddToQuoteButton } from "@/components/catalogue/AddToQuoteButton";
import { ModelCard } from "@/components/catalogue/ModelCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { Image } from "@/components/ui/Image";
import { PageHeader } from "@/components/ui/PageHeader";
import { TextLink } from "@/components/ui/SectionHeading";
import {
  categoryTrail,
  cctLabel,
  efficacyLabel,
  familyOf,
  getModel,
  lumenLabel,
  models,
  powerLabel,
  relatedModels,
} from "@/content/catalogue";
import { getFamily } from "@/content/products";
import { site } from "@/content/site";
import { toCardData } from "@/lib/catalogue-view";
import { resolveLocale } from "@/lib/i18n";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

type Params = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return models.map((model) => ({ slug: model.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const model = getModel((await params).slug);
  if (!model) return {};
  const t = await getTranslations({ locale, namespace: "meta.model" });
  return pageMetadata({
    locale,
    path: `/catalogue/${model.slug}`,
    title: `${model.code} — ${model.type[locale]}`,
    description: t("description", {
      type: model.type[locale],
      code: model.code,
      power: powerLabel(model),
      lumens: lumenLabel(model),
      cct: cctLabel(model) || "—",
      ip: model.ip.join(", "),
    }),
  });
}

export default async function ModelPage({ params }: Params) {
  const locale = await resolveLocale(params);
  const model = getModel((await params).slug);
  if (!model) notFound();

  const t = await getTranslations("model");
  const tc = await getTranslations("catalogue");
  const tcommon = await getTranslations("common");
  const trail = categoryTrail(model);
  const leaf = trail[trail.length - 1];
  const familySlug = familyOf(model);
  const family = familySlug ? getFamily(familySlug) : undefined;
  const related = relatedModels(model);
  const quoteLabels = { add: t("addModel"), added: t("added") };
  const variantLabel = (sku: string) => `${model.type[locale]} — ${sku}`;
  const efficacy = efficacyLabel(model);
  const hasSize = model.variants.some((variant) => variant.size);
  const hasOptions = model.variants.some((variant) => variant.dimming || variant.colour);

  const specs: [string, string][] = [
    [t("power"), powerLabel(model)],
    [t("lumens"), lumenLabel(model)],
    ...(efficacy ? ([[t("efficacy"), efficacy]] as [string, string][]) : []),
    ...(model.cct.length ? ([[t("cct"), cctLabel(model)]] as [string, string][]) : []),
    [t("ip"), model.ip.join(" · ")],
    ...(model.material ? ([[t("material"), model.material[locale]]] as [string, string][]) : []),
    ...(model.driver ? ([[t("driver"), model.driver[locale]]] as [string, string][]) : []),
    ...(model.sizes.length ? ([[t("sizes"), model.sizes.join(" · ")]] as [string, string][]) : []),
  ];

  return (
    <>
      <PageHeader
        locale={locale}
        title={model.code}
        intro={model.type[locale]}
        crumbs={[
          { label: tc("title"), href: "/catalogue" },
          ...trail.map((category) => ({ label: category.name[locale], href: `/catalogue?category=${category.slug}` })),
          { label: model.code, href: `/catalogue/${model.slug}` },
        ]}
        aside={
          <div className="mx-auto flex aspect-square w-full max-w-md items-center justify-center rounded-frame border border-line bg-day-surface p-8">
            {model.image && (
              <Image
                src={model.image.src}
                alt={`${model.code} — ${model.type[locale]}`}
                width={model.image.width}
                height={model.image.height}
                priority
                fetchPriority="high"
                sizes={`${Math.round(model.image.width * 1.5)}px`}
                className="h-auto max-h-full max-w-full object-contain"
                // Small source photos: shown up to 1.5× their size, never stretched further.
                style={{ width: Math.round(model.image.width * 1.5) }}
              />
            )}
          </div>
        }
      >
        <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm tabular-nums">
          {specs.slice(0, 4).map(([label, value]) => (
            <div key={label}>
              <dt className="text-fg-muted">{label}</dt>
              <dd dir="ltr" className="text-start text-base text-fg">
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <AddToQuoteButton code={model.code} label={model.type[locale]} labels={quoteLabels} />
          <ButtonLink href="/quote" variant="outline">
            {tcommon("requestQuote")}
          </ButtonLink>
        </div>
        <p className="mt-4 text-sm text-fg-muted">{tc("quoteHint")}</p>
      </PageHeader>

      <section aria-labelledby="specs-title" className="daylight section-y">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="specs-title" className="display text-3xl">
              {t("specsTitle")}
            </h2>
            <dl className="mt-8 divide-y divide-rule border-y border-rule">
              {specs.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-6 py-3">
                  <dt className="text-fg-muted">{label}</dt>
                  <dd className="text-end font-medium">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 flex flex-col gap-2">
              {family && (
                <TextLink href={`/products/${family.slug}`}>
                  {t("familyLink", { family: family.name[locale] })}
                </TextLink>
              )}
              {leaf && (
                <TextLink href={`/catalogue?category=${leaf.slug}`}>
                  {t("categoryLink", { category: leaf.name[locale] })}
                </TextLink>
              )}
            </div>
          </div>

          <div className="lg:col-span-8">
            <h2 className="display text-3xl">{t("variantsTitle")}</h2>
            <p className="mt-3 text-base text-fg-muted">{t("variantsIntro")}</p>
            <div className="mt-8 overflow-x-auto rounded-media border border-rule bg-panel">
              <table className="w-full min-w-[40rem] text-start text-sm tabular-nums">
                <thead className="border-b border-rule text-fg-muted">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-start font-medium">
                      {t("sku")}
                    </th>
                    <th scope="col" className="px-4 py-3 text-start font-medium">
                      {t("power")}
                    </th>
                    <th scope="col" className="px-4 py-3 text-start font-medium">
                      {t("lumens")}
                    </th>
                    <th scope="col" className="px-4 py-3 text-start font-medium">
                      {t("cct")}
                    </th>
                    <th scope="col" className="px-4 py-3 text-start font-medium">
                      IP
                    </th>
                    {hasSize && (
                      <th scope="col" className="px-4 py-3 text-start font-medium">
                        {t("size")}
                      </th>
                    )}
                    {hasOptions && (
                      <th scope="col" className="px-4 py-3 text-start font-medium">
                        {t("options")}
                      </th>
                    )}
                    <th scope="col" className="px-4 py-3">
                      <span className="sr-only">{t("addVariant")}</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule">
                  {model.variants.map((variant) => (
                    <tr key={variant.sku}>
                      <th scope="row" className="px-4 py-3 text-start font-medium whitespace-nowrap" dir="ltr">
                        {variant.sku}
                      </th>
                      <td className="px-4 py-3 whitespace-nowrap" dir="ltr">
                        {variant.powerText ?? `${variant.powerW} W${variant.perMetre ? "/m" : ""}`}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap" dir="ltr">
                        {variant.lumens.toLocaleString("en")} lm{variant.perMetre ? "/m" : ""}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap" dir="ltr">
                        {variant.cctK ? `${variant.cctK} K` : "—"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{variant.ipRating}</td>
                      {hasSize && <td className="px-4 py-3 whitespace-nowrap">{variant.size ?? "—"}</td>}
                      {hasOptions && (
                        <td className="px-4 py-3 whitespace-nowrap">
                          {[variant.dimming, variant.colour].filter(Boolean).join(" · ") || "—"}
                        </td>
                      )}
                      <td className="px-4 py-2 text-end">
                        <AddToQuoteButton
                          code={model.code}
                          sku={variant.sku}
                          label={variantLabel(variant.sku)}
                          labels={{ add: t("addVariant"), added: t("added") }}
                          compact
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-fg-muted">{t("photoNote")}</p>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="daylight section-y cv-auto border-t border-rule">
          <div className="shell">
            <h2 id="related-title" className="display text-3xl">
              {t("relatedTitle")}
            </h2>
            <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {related.map((other) => (
                <li key={other.slug}>
                  <ModelCard model={toCardData(other, locale)} variantsLabel={tc("variants")} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBand title={tc("ctaTitle")} text={tc("ctaText")} family={familySlug ?? undefined} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: `${model.code} ${model.type.en}`,
          sku: model.code,
          category: trail.map((category) => category.name.en).join(" > "),
          url: absoluteUrl(locale, `/catalogue/${model.slug}`),
          ...(model.image ? { image: `${site.url}${model.image.src}` } : {}),
          brand: { "@type": "Brand", name: site.brand.trade },
          manufacturer: { "@type": "Organization", name: site.brand.legalName[locale], url: site.url },
          additionalProperty: [
            { "@type": "PropertyValue", name: "Power", value: powerLabel(model) },
            { "@type": "PropertyValue", name: "Luminous flux", value: lumenLabel(model) },
            ...(model.cct.length
              ? [{ "@type": "PropertyValue", name: "Colour temperature", value: cctLabel(model) }]
              : []),
            { "@type": "PropertyValue", name: "IP rating", value: model.ip.join(", ") },
          ],
        }}
      />
    </>
  );
}
