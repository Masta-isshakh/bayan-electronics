import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectorCard } from "@/components/ui/SectorCard";
import { sectors } from "@/content/solutions";
import { type LocaleParams, resolveLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

const processSteps = ["share", "propose", "build", "deliver"] as const;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.solutions" });
  return pageMetadata({ locale, path: "/solutions", title: t("title"), description: t("description") });
}

export default async function SolutionsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("solutions");

  return (
    <>
      <PageHeader
        locale={locale}
        title={t("title")}
        intro={t("intro")}
        crumbs={[{ label: t("title"), href: "/solutions" }]}
      />

      <section aria-label={t("title")} className="shell pb-24 lg:pb-32">
        <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {sectors.map((sector, index) => (
            <li key={sector.slug}>
              <SectorCard
                sector={sector}
                priority={index === 0}
                locale={locale}
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
              />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="process-title" className="daylight section-y cv-auto">
        <div className="shell">
          <h2 id="process-title" className="display text-4xl">
            {t("processTitle")}
          </h2>
          <p className="measure mt-5 text-lg text-fg-muted">{t("processIntro")}</p>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-media border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((key, index) => (
              <li key={key} className="bg-panel p-6 lg:p-8">
                <span className="display text-3xl text-lumen-deep tabular-nums" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 text-lg font-medium">{t(`steps.${key}.title`)}</h3>
                <p className="mt-2 text-base text-fg-muted">{t(`steps.${key}.text`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand title={t("ctaTitle")} text={t("ctaText")} />
    </>
  );
}
