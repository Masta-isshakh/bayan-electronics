import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sectors } from "@/content/solutions";
import type { Locale } from "@/i18n/locales";
import { SectorRail } from "./SectorRail";

export async function SectorsSection({ locale, id }: { locale: Locale; id: string }) {
  const t = await getTranslations("home.sectors");
  const tc = await getTranslations("common");
  const cards = sectors.map((sector) => ({
    slug: sector.slug,
    name: sector.name[locale],
    line: sector.line[locale],
    image: sector.image,
    alt: sector.alt[locale],
  }));

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="section-y cv-auto overflow-hidden">
      <div className="shell">
        <SectionHeading
          id={`${id}-title`}
          title={t("title")}
          intro={t("intro")}
          action={{ href: "/solutions", label: t("viewAll") }}
        />
        <div className="mt-12 lg:mt-16">
          <SectorRail cards={cards} labels={{ previous: tc("previous"), next: tc("next"), progress: t("progress") }} />
        </div>
      </div>
    </section>
  );
}
