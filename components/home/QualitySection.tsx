import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";
import { processSteps } from "@/content/manufacturing";
import type { Locale } from "@/i18n/locales";
import { ManufacturingSteps } from "./ManufacturingSteps";

/** The home page's daylight section: six manufacturing and quality steps. */
export async function QualitySection({ locale, id }: { locale: Locale; id: string }) {
  const t = await getTranslations("home.quality");
  const steps = processSteps.map((step) => ({
    id: step.id,
    title: step.title[locale],
    text: step.text[locale],
    image: step.image,
    alt: step.alt[locale],
  }));

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="daylight section-y cv-auto">
      <div className="shell">
        <ManufacturingSteps
          steps={steps}
          intro={
            <>
              <h2 id={`${id}-title`} className="display text-4xl">
                {t("title")}
              </h2>
              <p className="measure mt-5 text-lg text-fg-muted">{t("intro")}</p>
              <ButtonLink href="/manufacturing" variant="outline" className="mt-8">
                {t("cta")}
              </ButtonLink>
            </>
          }
        />
      </div>
    </section>
  );
}
