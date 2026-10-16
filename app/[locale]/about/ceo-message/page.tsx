import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CompanyNav } from "@/components/company/CompanyNav";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { ceoMessage } from "@/content/company";
import { type LocaleParams, resolveLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.ceo" });
  return pageMetadata({ locale, path: "/about/ceo-message", title: t("title"), description: t("description") });
}

export default async function CeoMessagePage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("ceo");
  const ta = await getTranslations("about");
  const tn = await getTranslations("company.nav");
  const [lead, ...rest] = ceoMessage.paragraphs;

  return (
    <>
      <PageHeader
        locale={locale}
        title={t("title")}
        intro={t("intro")}
        crumbs={[
          { label: tn("about"), href: "/about" },
          { label: t("title"), href: "/about/ceo-message" },
        ]}
      />

      <CompanyNav current="ceo" />

      <section aria-label={t("quoteLabel")} className="section-y">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <figure className="lg:col-span-8 lg:col-start-3">
            <blockquote>
              <p className="display text-3xl text-fg lg:text-4xl">
                <span aria-hidden="true" className="me-1 text-lumen">
                  “
                </span>
                {lead[locale]}
              </p>
              <div className="mt-12 space-y-6 text-lg leading-relaxed text-fg/85">
                {rest.map((paragraph) => (
                  <p key={paragraph.en}>{paragraph[locale]}</p>
                ))}
              </div>
            </blockquote>
            <figcaption className="mt-12 flex items-center gap-4 border-t border-line pt-8">
              <span aria-hidden="true" className="h-10 w-1 rounded-full bg-lumen" />
              <span className="text-base text-fg-muted">{ceoMessage.signature[locale]}</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <CtaBand title={ta("ctaTitle")} text={ta("ctaText")} />
    </>
  );
}
