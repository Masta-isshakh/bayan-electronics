import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { TraceabilitySection } from "@/components/home/TraceabilitySection";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { assets } from "@/content/assets";
import {
  correctiveAction,
  documentControl,
  facility,
  labCapabilities,
  processSteps,
  qcStages,
} from "@/content/manufacturing";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { type LocaleParams, resolveLocale } from "@/lib/i18n";
import { isPlaceholder } from "@/lib/placeholder";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.manufacturing" });
  return pageMetadata({ locale, path: "/manufacturing", title: t("title"), description: t("description") });
}

export default async function ManufacturingPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("manufacturing");
  const certifications = site.certifications.filter((item) => !isPlaceholder(item.name));
  const facilityDetails = isPlaceholder(facility.details[locale]) ? null : facility.details[locale];

  return (
    <>
      <PageHeader
        locale={locale}
        title={t("title")}
        intro={t("intro")}
        crumbs={[{ label: t("title"), href: "/manufacturing" }]}
      />

      <section aria-labelledby="facility-title" className="pb-20 lg:pb-28">
        <div className="shell">
          <div className="relative aspect-[16/9] overflow-hidden rounded-media border border-line bg-surface">
            <Image
              src={assets.about.factoryExterior.src}
              alt={t("facilityAlt")}
              fill
              priority
              sizes="(min-width: 1440px) 1344px, calc(100vw - 3rem)"
              className="object-cover"
            />
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-12">
            <h2 id="facility-title" className="display text-3xl lg:col-span-5">
              {t("facilityTitle")}
            </h2>
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="text-xl leading-relaxed text-fg/90">{facility.text[locale]}</p>
              {facilityDetails && <p className="mt-4 text-base text-fg-muted">{facilityDetails}</p>}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="process-title" className="section-y cv-auto border-t border-line">
        <div className="shell">
          <h2 id="process-title" className="display text-4xl">
            {t("processTitle")}
          </h2>
          <p className="measure mt-5 text-lg text-fg-muted">{t("processIntro")}</p>
          <ol className="mt-16 space-y-20 lg:space-y-28">
            {processSteps.map((step, index) => (
              <li key={step.id} className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-16">
                <div
                  data-reveal="clip"
                  className={cn(
                    "relative aspect-[3/2] overflow-hidden rounded-media border border-line bg-surface lg:col-span-7",
                    index % 2 === 1 && "lg:order-2",
                  )}
                >
                  <Image
                    src={step.image.src}
                    alt={step.alt[locale]}
                    fill
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="lg:col-span-5">
                  <span className="display text-5xl text-lumen tabular-nums" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-2xl font-medium">{step.title[locale]}</h3>
                  <p className="mt-4 text-lg text-fg-muted">{step.detail[locale]}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="qc-title" className="daylight section-y cv-auto">
        <div className="shell">
          <h2 id="qc-title" className="display text-4xl">
            {t("qcTitle")}
          </h2>
          <p className="measure mt-5 text-lg text-fg-muted">{t("qcIntro")}</p>
          <ol className="mt-12 grid gap-4 lg:grid-cols-3 lg:gap-0">
            {qcStages.map((stage, index) => (
              <li key={stage.id} className="relative flex items-stretch">
                <div className="flex-1 rounded-media border border-rule bg-panel p-6 lg:p-8">
                  <span className="text-sm text-fg-muted tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 text-xl font-medium">{stage.title[locale]}</h3>
                  <p className="mt-3 text-base text-fg-muted">{stage.text[locale]}</p>
                </div>
                {index < qcStages.length - 1 && (
                  <ArrowRight
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="mx-3 hidden size-5 shrink-0 self-center text-lumen-deep lg:block rtl:-scale-x-100"
                  />
                )}
              </li>
            ))}
          </ol>

          <div className="mt-20 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h3 className="text-2xl font-medium">{t("ncrTitle")}</h3>
              <p className="mt-4 text-base text-fg-muted">{t("ncrIntro")}</p>
            </div>
            <ol className="divide-y divide-rule border-y border-rule lg:col-span-7 lg:col-start-6">
              {correctiveAction.map((step, index) => (
                <li key={step.id} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-4 py-5">
                  <span className="text-sm text-fg-muted tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                  <p>
                    <span className="font-medium">{step.title[locale]}. </span>
                    <span className="text-fg-muted">{step.text[locale]}</span>
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section aria-labelledby="lab-title" className="section-y cv-auto">
        <div className="shell">
          <h2 id="lab-title" className="display text-4xl">
            {t("labTitle")}
          </h2>
          <p className="measure mt-5 text-lg text-fg-muted">{t("labIntro")}</p>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {labCapabilities.map((capability) => (
              <li key={capability.id} className="overflow-hidden rounded-media border border-line bg-surface">
                {capability.image && (
                  <div className="relative aspect-[3/2]">
                    <Image
                      src={capability.image.src}
                      alt={capability.alt?.[locale] ?? ""}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-medium">{capability.title[locale]}</h3>
                  <p className="mt-2 text-base text-fg-muted">{capability.text[locale]}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <TraceabilitySection locale={locale} id="traceability" />

      {certifications.length > 0 && (
        <section aria-labelledby="cert-title" className="section-y cv-auto border-t border-line">
          <div className="shell">
            <h2 id="cert-title" className="display text-4xl">
              {t("certTitle")}
            </h2>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {certifications.map((certification) => (
                <li key={certification.id} className="rounded-media border border-line p-6">
                  <p className="text-lg font-medium">{certification.name}</p>
                  <p className="mt-1 text-sm text-fg-muted">{certification.issuer[locale]}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section aria-labelledby="docs-title" className="section-y cv-auto border-t border-line">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="docs-title" className="display text-3xl">
              {t("docsTitle")}
            </h2>
            <p className="mt-5 text-base text-fg-muted">{t("docsIntro")}</p>
          </div>
          <ul className="grid gap-px overflow-hidden rounded-media border border-line bg-line sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {documentControl.map((item) => (
              <li key={item.id} className="bg-void p-6">
                <h3 className="text-base font-medium">{item.title[locale]}</h3>
                <p className="mt-2 text-sm text-fg-muted">{item.text[locale]}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title={t("ctaTitle")} text={t("ctaText")} />
    </>
  );
}
