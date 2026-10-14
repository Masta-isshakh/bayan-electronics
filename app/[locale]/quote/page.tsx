import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { InquirySection } from "@/components/forms/InquirySection";
import { PageHeader } from "@/components/ui/PageHeader";
import { type LocaleParams, resolveLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.quote" });
  return pageMetadata({ locale, path: "/quote", title: t("title"), description: t("description") });
}

export default async function QuotePage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("quote");

  return (
    <>
      <PageHeader
        locale={locale}
        title={t("title")}
        intro={t("intro")}
        crumbs={[{ label: t("title"), href: "/quote" }]}
      />

      <section aria-labelledby="quote-form-title" className="daylight section-y">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="quote-form-title" className="display text-4xl">
              {t("formTitle")}
            </h2>
            <p className="mt-5 text-base text-fg-muted">{t("formIntro")}</p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <InquirySection locale={locale} variant="quote" />
          </div>
        </div>
      </section>
    </>
  );
}
