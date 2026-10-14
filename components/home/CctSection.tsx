import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { assets } from "@/content/assets";
import { CctExplorer, type CctBand } from "./CctExplorer";

// Upper bound (K) of each colour-temperature band.
const bandLimits = [
  ["warm", 3200],
  ["neutral", 4500],
  ["cool", 5700],
  ["daylight", 6500],
] as const;

export async function CctSection({ id }: { id: string }) {
  const t = await getTranslations("home.cct");
  const bands: CctBand[] = bandLimits.map(([key, upTo]) => ({
    key,
    upTo,
    name: t(`bands.${key}.name`),
    uses: t(`bands.${key}.uses`),
  }));

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="section-y cv-auto border-t border-line">
      <div className="shell">
        <SectionHeading id={`${id}-title`} title={t("title")} intro={t("intro")} />
        <div className="mt-12 lg:mt-16">
          <CctExplorer
            image={assets.home.cctScene}
            alt=""
            label={t("label")}
            valueTemplate={t.raw("valueText") as string}
            typicalLabel={t("typical")}
            minLabel={t("min")}
            maxLabel={t("max")}
            bands={bands}
          />
        </div>
      </div>
    </section>
  );
}
