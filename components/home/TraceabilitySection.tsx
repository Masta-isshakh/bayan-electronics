import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { assets } from "@/content/assets";
import { traceChain } from "@/content/manufacturing";
import type { Locale } from "@/i18n/locales";
import { TraceabilityChain } from "./TraceabilityChain";

export async function TraceabilitySection({
  locale,
  id,
  headingLevel = "h2",
}: {
  locale: Locale;
  id: string;
  headingLevel?: "h2";
}) {
  const t = await getTranslations("home.trace");
  const Heading = headingLevel;
  const nodes = traceChain.map((stage) => ({ id: stage.id, title: stage.title[locale], text: stage.text[locale] }));

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border-t border-line">
      <div className="shell section-y lg:py-0">
        <TraceabilityChain
          nodes={nodes}
          header={
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-6">
                <Heading id={`${id}-title`} className="display text-4xl">
                  {t("title")}
                </Heading>
                <p className="measure mt-5 text-lg text-fg-muted">{t("intro")}</p>
              </div>
              <div className="relative aspect-[16/9] overflow-hidden rounded-media border border-line bg-surface lg:col-span-5 lg:col-start-8 lg:aspect-auto lg:h-[30vh]">
                <Image
                  src={assets.home.traceabilityLabel.src}
                  alt={t("mediaAlt")}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          }
        />
      </div>
    </section>
  );
}
