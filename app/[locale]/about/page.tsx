import { Image } from "@/components/ui/Image";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Check } from "lucide-react";
import { CompanyNav } from "@/components/company/CompanyNav";
import { QatarMark } from "@/components/layout/QatarMark";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { TextLink } from "@/components/ui/SectionHeading";
import { assets } from "@/content/assets";
import { differentiators, mission, offer, overview, values, vision } from "@/content/company";
import { site } from "@/content/site";
import { type LocaleParams, resolveLocale } from "@/lib/i18n";
import { isPlaceholder } from "@/lib/placeholder";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.about" });
  return pageMetadata({ locale, path: "/about", title: t("title"), description: t("description") });
}

export default async function AboutPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("about");
  const tc = await getTranslations("common");

  // Team and timeline appear only once the client has confirmed them.
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
        {overview.map((paragraph) => (
          <p key={paragraph.en} className="measure mt-5 text-base text-fg/85">
            {paragraph[locale]}
          </p>
        ))}
      </PageHeader>

      <CompanyNav current="about" />

      <section aria-labelledby="offer-title" className="section-y">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <h2 id="offer-title" className="display text-4xl">
              {t("offerTitle")}
            </h2>
            <p className="mt-6 text-lg text-fg-muted">{offer.lead[locale]}</p>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {offer.items.map((item) => (
                <li key={item.en} className="flex items-center gap-4 py-4 text-lg">
                  <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-lumen" />
                  {item[locale]}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-base text-fg-muted">{offer.custom[locale]}</p>
          </div>
          <div className="rounded-media border border-line bg-surface p-6 lg:col-span-5 lg:col-start-8 lg:p-10">
            <h2 className="text-2xl font-medium">{t("apartTitle")}</h2>
            <ul className="mt-6 space-y-4">
              {differentiators.map((item) => (
                <li key={item.en} className="flex gap-3 text-base">
                  <Check aria-hidden="true" strokeWidth={1.75} className="mt-1 size-5 shrink-0 text-lumen" />
                  {item[locale]}
                </li>
              ))}
            </ul>
          </div>
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

      <section
        aria-label={`${t("missionTitle")} · ${t("visionTitle")}`}
        className="section-y cv-auto border-t border-line"
      >
        <div className="shell grid gap-6 md:grid-cols-2">
          {[
            { title: t("missionTitle"), text: mission[locale] },
            { title: t("visionTitle"), text: vision[locale] },
          ].map((item) => (
            <div key={item.title} className="rounded-media border border-line bg-surface p-8 lg:p-12">
              <h2 className="text-sm font-medium tracking-[0.12em] text-lumen uppercase">{item.title}</h2>
              <p className="display mt-6 text-3xl">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="shell mt-10 flex flex-wrap gap-x-8 gap-y-2">
          <TextLink href="/about/ceo-message">{t("ceoTeaser")}</TextLink>
          <TextLink href="/about/organization">{t("organizationTeaser")}</TextLink>
        </div>
      </section>

      <section aria-labelledby="values-title" className="daylight section-y cv-auto">
        <div className="shell">
          <h2 id="values-title" className="display text-4xl">
            {t("valuesTitle")}
          </h2>
          <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => (
              <li key={value.id} className="border-t-2 border-brand pt-6">
                <span className="text-sm text-fg-muted tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="display mt-3 text-3xl">{value.title[locale]}</h3>
                <p className="mt-4 text-lg text-fg-muted">{value.text[locale]}</p>
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
