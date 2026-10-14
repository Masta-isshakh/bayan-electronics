import { getTranslations } from "next-intl/server";
import { HomeHero } from "@/components/hero/HomeHero";
import { type LocaleParams, resolveLocale } from "@/lib/i18n";

export default async function HomePage({ params }: LocaleParams) {
  await resolveLocale(params);
  const t = await getTranslations("home.products");

  return (
    <>
      <HomeHero scrollTarget="#what-we-make" />
      {/* Sections after the hero sit above it, so they slide over the pinned frame. */}
      <div className="relative z-10 bg-canvas">
        <section id="what-we-make" className="shell section-y min-h-svh">
          <h2 className="display text-4xl">{t("title")}</h2>
        </section>
      </div>
    </>
  );
}
