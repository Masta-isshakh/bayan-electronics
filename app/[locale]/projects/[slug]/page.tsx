import { Image } from "@/components/ui/Image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { FamilyTile } from "@/components/products/FamilyTile";
import { FlashlightGrid } from "@/components/products/FlashlightGrid";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { SampleBadge, Tag } from "@/components/ui/Tag";
import { familiesBySlugs } from "@/content/products";
import { getProject, projects, type ProjectFactKey } from "@/content/projects";
import { getSector } from "@/content/solutions";
import { resolveLocale } from "@/lib/i18n";
import { isPlaceholder } from "@/lib/placeholder";
import { pageMetadata } from "@/lib/seo";

type Params = { params: Promise<{ locale: string; slug: string }> };

const factKeys: ProjectFactKey[] = ["client", "location", "year", "scope"];

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const project = getProject((await params).slug);
  if (!project) return {};
  const t = await getTranslations({ locale, namespace: "project" });
  const summary = project.summary[locale];
  return {
    ...(await pageMetadata({
      locale,
      path: `/projects/${project.slug}`,
      title: project.title[locale],
      description: isPlaceholder(summary) ? t("sampleNote") : summary,
    })),
    // Sample records stay out of search results until replaced by real projects.
    ...(project.isPlaceholder ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function ProjectPage({ params }: Params) {
  const locale = await resolveLocale(params);
  const project = getProject((await params).slug);
  if (!project) notFound();

  const t = await getTranslations("project");
  const tp = await getTranslations("projects");
  const tc = await getTranslations("common");
  const sector = getSector(project.sector);
  const families = familiesBySlugs(project.products);
  const summary = isPlaceholder(project.summary[locale]) ? null : project.summary[locale];

  return (
    <>
      <PageHeader
        locale={locale}
        title={project.title[locale]}
        intro={summary ?? undefined}
        crumbs={[
          { label: tp("title"), href: "/projects" },
          { label: project.title[locale], href: `/projects/${project.slug}` },
        ]}
      >
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {sector && <Tag>{sector.name[locale]}</Tag>}
          {project.isPlaceholder && <SampleBadge label={tc("sample")} />}
        </div>
      </PageHeader>

      <section aria-label={t("galleryLabel")} className="shell">
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="relative aspect-[16/10] overflow-hidden rounded-media border border-line bg-surface lg:col-span-8 lg:row-span-2 lg:aspect-auto lg:min-h-[32rem]">
            <Image
              src={project.image.src}
              alt={project.alt[locale]}
              fill
              priority
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
          </div>
          {project.gallery.map((item) => (
            <div
              key={item.image.path}
              data-reveal="clip"
              className="relative aspect-[3/2] overflow-hidden rounded-media border border-line bg-surface lg:col-span-4"
            >
              <Image
                src={item.image.src}
                alt={item.alt[locale]}
                fill
                sizes="(min-width: 1024px) 30vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="facts-title" className="daylight section-y mt-20 cv-auto lg:mt-28">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="facts-title" className="display text-3xl">
              {t("factsTitle")}
            </h2>
            {project.isPlaceholder && <p className="mt-5 text-base text-fg-muted">{t("sampleNote")}</p>}
          </div>
          <dl className="divide-y divide-rule border-y border-rule lg:col-span-7 lg:col-start-6">
            {factKeys.map((key) => {
              const value = project.facts[key][locale];
              const pending = isPlaceholder(value);
              return (
                <div key={key} className="grid gap-1 py-5 sm:grid-cols-3 sm:gap-6">
                  <dt className="text-sm text-fg-muted">{t(`facts.${key}`)}</dt>
                  <dd className={pending ? "text-fg-muted italic sm:col-span-2" : "sm:col-span-2"}>
                    {pending ? tc("toBeConfirmed") : value}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </section>

      <section aria-labelledby="used-title" className="section-y cv-auto">
        <div className="shell">
          <h2 id="used-title" className="text-2xl font-medium">
            {t("productsTitle")}
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
        </div>
      </section>

      <CtaBand title={t("ctaTitle")} text={t("ctaText")} />
    </>
  );
}
