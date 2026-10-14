import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { FamilyTile } from "@/components/products/FamilyTile";
import { FlashlightGrid } from "@/components/products/FlashlightGrid";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { familiesBySlugs } from "@/content/products";
import { projects } from "@/content/projects";
import { getSector, sectors } from "@/content/solutions";
import { resolveLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

type Params = { params: Promise<{ locale: string; sector: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return sectors.map((sector) => ({ sector: sector.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const sector = getSector((await params).sector);
  if (!sector) return {};
  return pageMetadata({
    locale,
    path: `/solutions/${sector.slug}`,
    title: sector.name[locale],
    description: `${sector.line[locale]} ${sector.challenge[locale]}`,
  });
}

export default async function SectorPage({ params }: Params) {
  const locale = await resolveLocale(params);
  const sector = getSector((await params).sector);
  if (!sector) notFound();

  const t = await getTranslations("sector");
  const ts = await getTranslations("solutions");
  const tc = await getTranslations("common");
  const families = familiesBySlugs(sector.products);
  const project = projects.find((candidate) => candidate.sector === sector.slug);

  return (
    <>
      <PageHeader
        locale={locale}
        title={sector.name[locale]}
        intro={sector.line[locale]}
        crumbs={[
          { label: ts("title"), href: "/solutions" },
          { label: sector.name[locale], href: `/solutions/${sector.slug}` },
        ]}
      />

      <div className="shell">
        <div className="relative aspect-[16/9] overflow-hidden rounded-media border border-line bg-surface">
          <Image
            src={sector.image.src}
            alt={sector.alt[locale]}
            fill
            priority
            sizes="(min-width: 1440px) 1344px, calc(100vw - 3rem)"
            className="object-cover"
          />
        </div>
      </div>

      <section aria-labelledby="challenge-title" className="section-y">
        <div className="shell grid gap-6 lg:grid-cols-12">
          <h2 id="challenge-title" className="display text-3xl lg:col-span-4">
            {t("challenge")}
          </h2>
          <p className="measure text-xl leading-relaxed text-fg/90 lg:col-span-7 lg:col-start-6">
            {sector.challenge[locale]}
          </p>
        </div>
      </section>

      <section aria-labelledby="approach-title" className="daylight section-y cv-auto">
        <div className="shell grid gap-6 lg:grid-cols-12">
          <h2 id="approach-title" className="display text-3xl lg:col-span-4">
            {t("approach")}
          </h2>
          <p className="measure text-xl leading-relaxed lg:col-span-7 lg:col-start-6">{sector.approach[locale]}</p>
        </div>
      </section>

      <section aria-labelledby="products-title" className="section-y cv-auto">
        <div className="shell">
          <h2 id="products-title" className="text-2xl font-medium">
            {t("products")}
          </h2>
          <FlashlightGrid data-defer="" className="mt-6 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {families.map((family) => (
              <FamilyTile
                key={family.slug}
                family={family}
                locale={locale}
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="aspect-[4/5]"
              />
            ))}
          </FlashlightGrid>

          {project && (
            <div className="mt-20 grid gap-6 lg:grid-cols-12">
              <h2 className="text-2xl font-medium lg:col-span-4">{t("project")}</h2>
              <div className="lg:col-span-8">
                <ProjectCard
                  project={project}
                  locale={locale}
                  sampleLabel={tc("sample")}
                  sizes="(min-width: 1024px) 60vw, 100vw"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      <CtaBand title={t("ctaTitle")} text={t("ctaText")} />
    </>
  );
}
