import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CtaBand } from "@/components/ui/CtaBand";
import { FilterBar, type FilterOption } from "@/components/ui/FilterBar";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { projects } from "@/content/projects";
import { sectors } from "@/content/solutions";
import { type LocaleParams, resolveLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

const promiseKeys = ["records", "trace", "language"] as const;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.projects" });
  return pageMetadata({ locale, path: "/projects", title: t("title"), description: t("description") });
}

export default async function ProjectsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("projects");
  const tc = await getTranslations("common");

  const options: FilterOption[] = [
    { value: "all", label: t("all"), summary: t("results", { count: projects.length }) },
    ...sectors
      .filter((sector) => projects.some((project) => project.sector === sector.slug))
      .map((sector) => ({
        value: sector.slug,
        label: sector.name[locale],
        summary: t("results", { count: projects.filter((project) => project.sector === sector.slug).length }),
      })),
  ];

  return (
    <>
      <PageHeader
        locale={locale}
        title={t("title")}
        intro={t("intro")}
        crumbs={[{ label: t("title"), href: "/projects" }]}
      />

      <section aria-label={t("title")} className="shell pb-24 lg:pb-32">
        <FilterBar param="sector" options={options} label={t("filterLabel")} targetId="project-grid" />
        <ul id="project-grid" className="mt-8 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.slug} data-categories={project.sector}>
              <ProjectCard
                project={project}
                locale={locale}
                sampleLabel={tc("sample")}
                headingLevel="h2"
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
              />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="promise-title" className="daylight section-y cv-auto">
        <div className="shell">
          <h2 id="promise-title" className="display text-4xl">
            {t("promiseTitle")}
          </h2>
          <ul className="mt-12 grid gap-px overflow-hidden rounded-media border border-rule bg-rule md:grid-cols-3">
            {promiseKeys.map((key) => (
              <li key={key} className="bg-panel p-6 lg:p-8">
                <h3 className="text-xl font-medium">{t(`promise.${key}.title`)}</h3>
                <p className="mt-3 text-base text-fg-muted">{t(`promise.${key}.text`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title={t("ctaTitle")} text={t("ctaText")} />
    </>
  );
}
