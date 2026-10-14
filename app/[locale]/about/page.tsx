import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { QatarMark } from "@/components/layout/QatarMark";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { assets } from "@/content/assets";
import { site } from "@/content/site";
import { type LocaleParams, resolveLocale } from "@/lib/i18n";
import { isPlaceholder } from "@/lib/placeholder";
import { pageMetadata } from "@/lib/seo";

const whatKeys = ["production", "lab", "trace", "quality", "digital", "language"] as const;
const valueKeys = ["precision", "reliability", "responsibility"] as const;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.about" });
  return pageMetadata({ locale, path: "/about", title: t("title"), description: t("description") });
}

export default async function AboutPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("about");
  const tc = await getTranslations("common");

  // Story, team and timeline appear only once the client has confirmed them.
  const story = site.story.map((paragraph) => paragraph[locale]).filter((paragraph) => !isPlaceholder(paragraph));
  const team = site.team.filter((member) => !isPlaceholder(member.name[locale]) && !member.photo.placeholder);
  const timeline = site.timeline.filter((item) => !isPlaceholder(item.year) && !isPlaceholder(item.text[locale]));

  return (
    <>
      <PageHeader
        locale={locale}
        title={t("title")}
        intro={t("intro")}
        crumbs={[{ label: t("title"), href: "/about" }]}
      >
        {story.map((paragraph) => (
          <p key={paragraph} className="measure mt-5 text-base text-fg/85">
            {paragraph}
          </p>
        ))}
      </PageHeader>

      <section aria-labelledby="what-title" className="section-y border-t border-line">
        <div className="shell">
          <h2 id="what-title" className="display text-4xl">
            {t("whatTitle")}
          </h2>
          <ul className="mt-12 grid gap-px overflow-hidden rounded-media border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {whatKeys.map((key) => (
              <li key={key} className="bg-void p-6 lg:p-8">
                <h3 className="text-lg font-medium">{t(`what.${key}.title`)}</h3>
                <p className="mt-2 text-base text-fg-muted">{t(`what.${key}.text`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="made-title" className="section-y cv-auto border-t border-line">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-5">
            <QatarMark label={tc("madeInQatar")} />
            <h2 id="made-title" className="display mt-6 text-5xl">
              {t("madeTitle")}
            </h2>
            <p className="mt-6 text-xl leading-relaxed text-fg/90">{t("madeText")}</p>
            <p className="mt-4 text-base text-fg-muted">{t("facilityText")}</p>
            <ButtonLink href="/manufacturing" variant="outline" className="mt-8">
              {t("facilityCta")}
            </ButtonLink>
          </div>
          <div
            data-reveal="clip"
            className="relative aspect-[16/9] overflow-hidden rounded-media border border-line bg-surface lg:col-span-7"
          >
            <Image
              src={assets.about.factoryExterior.src}
              alt={t("facilityAlt")}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="values-title" className="daylight section-y cv-auto">
        <div className="shell">
          <h2 id="values-title" className="display text-4xl">
            {t("valuesTitle")}
          </h2>
          <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {valueKeys.map((key, index) => (
              <li key={key} className="border-t-2 border-day-text pt-6">
                <span className="text-sm text-fg-muted tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="display mt-3 text-3xl">{t(`values.${key}.title`)}</h3>
                <p className="mt-4 text-lg text-fg-muted">{t(`values.${key}.text`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {team.length > 0 && (
        <section aria-labelledby="team-title" className="section-y cv-auto">
          <div className="shell">
            <h2 id="team-title" className="display text-4xl">
              {t("teamTitle")}
            </h2>
            <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member) => (
                <li key={member.id}>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-media border border-line">
                    <Image
                      src={member.photo.src}
                      alt={member.name[locale]}
                      fill
                      sizes="25vw"
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-4 text-lg font-medium">{member.name[locale]}</p>
                  <p className="text-sm text-fg-muted">{member.role[locale]}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {timeline.length > 0 && (
        <section aria-labelledby="timeline-title" className="section-y cv-auto border-t border-line">
          <div className="shell">
            <h2 id="timeline-title" className="display text-4xl">
              {t("timelineTitle")}
            </h2>
            <ol className="mt-12 divide-y divide-line border-y border-line">
              {timeline.map((item) => (
                <li key={item.id} className="grid gap-2 py-6 sm:grid-cols-[8rem_minmax(0,1fr)]">
                  <span className="display text-2xl text-lumen tabular-nums">{item.year}</span>
                  <p className="text-lg">{item.text[locale]}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <CtaBand title={t("ctaTitle")} text={t("ctaText")} />
    </>
  );
}
