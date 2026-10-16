import { Image } from "@/components/ui/Image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Check } from "lucide-react";
import { FamilyTile } from "@/components/products/FamilyTile";
import { FlashlightGrid } from "@/components/products/FlashlightGrid";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Tag } from "@/components/ui/Tag";
import { familiesBySlugs } from "@/content/products";
import { getProject, getProjectCategory, projects } from "@/content/projects";
import { getSector } from "@/content/solutions";
import { resolveLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

type Params = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const project = getProject((await params).slug);
  if (!project) return {};
  return pageMetadata({
    locale,
    path: `/projects/${project.slug}`,
    title: project.title[locale],
    description: project.summary[locale],
  });
}

export default async function ProjectPage({ params }: Params) {
  const locale = await resolveLocale(params);
  const project = getProject((await params).slug);
  if (!project) notFound();

  const t = await getTranslations("project");
  const tp = await getTranslations("projects");
  const sector = getSector(project.sector);
  const category = getProjectCategory(project.category);
  const families = familiesBySlugs(sector?.products ?? []).slice(0, 4);
  const more = projects.filter((other) => other.category === project.category && other !== project).slice(0, 3);
  const [first, ...rest] = project.gallery;
  // Beside the main photo: one or two gallery images; the rest go in a strip below.
  const side = [first, rest[0]].filter(Boolean);

  const facts: [string, string][] = [
    [t("facts.project"), project.projectName[locale]],
    [t("facts.client"), project.client[locale]],
    ...(project.consultant ? ([[t("facts.consultant"), project.consultant[locale]]] as [string, string][]) : []),
    ...(project.contractor ? ([[t("facts.contractor"), project.contractor[locale]]] as [string, string][]) : []),
    [t("facts.location"), project.location[locale]],
    ...(project.year ? ([[t("facts.year"), String(project.year)]] as [string, string][]) : []),
  ];

  return (
    <>
      <PageHeader
        locale={locale}
        title={project.title[locale]}
        intro={project.summary[locale]}
        crumbs={[
          { label: tp("title"), href: "/projects" },
          { label: project.title[locale], href: `/projects/${project.slug}` },
        ]}
      >
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {category && <Tag>{category.name[locale]}</Tag>}
          {project.year && <span className="text-sm text-fg-muted tabular-nums">{project.year}</span>}
          <span className="text-sm text-fg-muted">· {project.location[locale]}</span>
        </div>
      </PageHeader>

      <section aria-label={t("galleryLabel")} className="shell">
        <div className="grid gap-4 lg:grid-cols-12">
          <div
            className={`relative aspect-[16/10] overflow-hidden rounded-media border border-line bg-surface lg:aspect-auto lg:min-h-[32rem] ${first ? "lg:col-span-8 lg:row-span-2" : "lg:col-span-12"}`}
          >
            <Image
              src={project.image.src}
              alt={project.alt[locale]}
              fill
              priority
              sizes={first ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1440px) 1344px, 100vw"}
              className="object-cover"
            />
          </div>
          {side.map((item) => (
            <div
              key={item.image.path}
              data-reveal="clip"
              className={`relative aspect-[3/2] overflow-hidden rounded-media border border-line bg-surface lg:col-span-4 lg:aspect-auto ${side.length === 1 ? "lg:row-span-2" : ""}`}
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
        {rest.length > 1 && (
          <ul data-defer="" className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {rest.slice(1).map((item) => (
              <li
                key={item.image.path}
                className="relative aspect-square overflow-hidden rounded-media border border-line bg-surface"
              >
                <Image
                  src={item.image.src}
                  alt={item.alt[locale]}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="facts-title" className="daylight section-y mt-20 cv-auto lg:mt-28">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="facts-title" className="display text-3xl">
              {t("factsTitle")}
            </h2>
            <dl className="mt-8 divide-y divide-rule border-y border-rule">
              {facts.map(([label, value]) => (
                <div key={label} className="grid gap-1 py-4 sm:grid-cols-3 sm:gap-6">
                  <dt className="text-sm text-fg-muted">{label}</dt>
                  <dd className="sm:col-span-2">{value}</dd>
                </div>
              ))}
            </dl>
            {project.scope && project.scope[locale].length > 0 && (
              <>
                <h3 className="mt-10 text-lg font-medium">{t("facts.scope")}</h3>
                <ul className="mt-4 space-y-3">
                  {project.scope[locale].map((item) => (
                    <li key={item} className="flex gap-3">
                      <Check aria-hidden="true" strokeWidth={1.75} className="mt-1 size-4 shrink-0 text-brand" />
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div className="space-y-5 text-lg leading-relaxed lg:col-span-6 lg:col-start-7">
            <h2 className="display text-3xl">{t("aboutTitle")}</h2>
            {project.body[locale].map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {families.length > 0 && (
        <section aria-labelledby="related-products-title" className="section-y cv-auto">
          <div className="shell">
            <h2 id="related-products-title" className="text-2xl font-medium">
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
      )}

      {more.length > 0 && (
        <section aria-labelledby="more-title" className="section-y cv-auto border-t border-line">
          <div className="shell">
            <h2 id="more-title" className="text-2xl font-medium">
              {t("moreTitle", { category: category?.name[locale] ?? "" })}
            </h2>
            <ul className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((other) => (
                <li key={other.slug}>
                  <ProjectCard
                    project={other}
                    locale={locale}
                    sampleLabel=""
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBand title={t("ctaTitle")} text={t("ctaText")} />
    </>
  );
}
