import { getTranslations } from "next-intl/server";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects } from "@/content/projects";
import type { Locale } from "@/i18n/locales";

export async function FeaturedProjects({ locale, id }: { locale: Locale; id: string }) {
  const t = await getTranslations("home.projects");
  const tc = await getTranslations("common");
  const [lead, ...rest] = projects.filter((project) => project.featured).slice(0, 3);
  if (!lead) return null;

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="section-y cv-auto border-t border-line">
      <div className="shell">
        <SectionHeading
          id={`${id}-title`}
          title={t("title")}
          intro={t("intro")}
          action={{ href: "/projects", label: t("viewAll") }}
        />
        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <ProjectCard
              project={lead}
              locale={locale}
              sampleLabel={tc("sample")}
              aspect="aspect-[4/3] lg:aspect-[5/4]"
              sizes="(min-width: 1024px) 55vw, 100vw"
            />
          </div>
          <div className="grid gap-10 lg:col-span-5 lg:gap-8">
            {rest.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                locale={locale}
                sampleLabel={tc("sample")}
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
