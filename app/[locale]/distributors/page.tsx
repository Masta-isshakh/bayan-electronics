import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Check, MapPin } from "lucide-react";
import { CompanyNav } from "@/components/company/CompanyNav";
import { InquirySection } from "@/components/forms/InquirySection";
import { PageHeader } from "@/components/ui/PageHeader";
import { TextLink } from "@/components/ui/SectionHeading";
import { distributor } from "@/content/company";
import { site } from "@/content/site";
import { type LocaleParams, resolveLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.distributor" });
  return pageMetadata({ locale, path: "/distributors", title: t("title"), description: t("description") });
}

export default async function DistributorsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("distributor");

  return (
    <>
      <PageHeader
        locale={locale}
        title={t("title")}
        intro={t("intro")}
        crumbs={[{ label: t("title"), href: "/distributors" }]}
      >
        <p className="measure mt-5 text-base text-fg/85">{distributor.intro[locale]}</p>
      </PageHeader>

      <CompanyNav current="distributor" />

      <section aria-labelledby="benefits-title" className="section-y">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <h2 id="benefits-title" className="display text-4xl">
              {t("benefitsTitle")}
            </h2>
            <p className="mt-6 text-lg text-fg-muted">{distributor.benefitsLead[locale]}</p>
            <ul className="mt-8 space-y-5">
              {distributor.benefits.map((benefit) => (
                <li key={benefit.en} className="flex gap-4 text-lg">
                  <Check aria-hidden="true" strokeWidth={1.75} className="mt-1 size-5 shrink-0 text-lumen" />
                  {benefit[locale]}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-base text-fg-muted">{distributor.closing[locale]}</p>
          </div>
          <div className="rounded-media border border-line bg-surface p-6 lg:col-span-5 lg:col-start-8 lg:p-8">
            <h2 className="text-xl font-medium">{t("networkTitle")}</h2>
            <ul className="mt-6 divide-y divide-line">
              {site.offices.map((office) => (
                <li key={office.id} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                  <MapPin aria-hidden="true" strokeWidth={1.5} className="mt-1 size-5 shrink-0 text-lumen" />
                  <div>
                    <p className="text-lg">{office.country[locale]}</p>
                    <p className="text-sm text-fg-muted">
                      {office.role[locale]} · {office.company[locale]}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-fg-muted">{t("contactHint")}</p>
            <TextLink href="/contact">{t("contactLink")}</TextLink>
          </div>
        </div>
      </section>

      <section aria-labelledby="distributor-form-title" className="daylight section-y">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="distributor-form-title" className="display text-4xl">
              {t("formTitle")}
            </h2>
            <p className="mt-5 text-base text-fg-muted">{t("formIntro")}</p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <InquirySection locale={locale} variant="distributor" />
          </div>
        </div>
      </section>
    </>
  );
}
