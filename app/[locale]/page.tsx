import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { HomeHero } from "@/components/hero/HomeHero";
import { CctSection } from "@/components/home/CctSection";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { ProductBento } from "@/components/home/ProductBento";
import { QualitySection } from "@/components/home/QualitySection";
import { SectorsSection } from "@/components/home/SectorsSection";
import { StartProject } from "@/components/home/StartProject";
import { Stats } from "@/components/home/Stats";
import { TraceabilitySection } from "@/components/home/TraceabilitySection";
import { type LocaleParams, resolveLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.home" });
  return pageMetadata({ locale, path: "/", title: t("title"), description: t("description") });
}

export default async function HomePage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);

  return (
    <>
      <HomeHero scrollTarget="#what-we-make" />
      {/* Everything after the hero sits above it, so it slides over the pinned frame. */}
      <div className="relative z-10 bg-canvas">
        <ProductBento locale={locale} id="what-we-make" />
        <CctSection id="colour-temperature" />
        <TraceabilitySection locale={locale} id="traceability" />
        <QualitySection locale={locale} id="manufacturing-quality" />
        <SectorsSection locale={locale} id="sectors" />
        <FeaturedProjects locale={locale} id="projects" />
        <Stats locale={locale} id="in-numbers" />
        <StartProject id="start-a-project" />
      </div>
    </>
  );
}
