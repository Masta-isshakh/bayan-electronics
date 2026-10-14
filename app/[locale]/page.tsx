import { getTranslations } from "next-intl/server";
import { type LocaleParams, resolveLocale } from "@/lib/i18n";

export default async function HomePage({ params }: LocaleParams) {
  await resolveLocale(params);
  const t = await getTranslations("hero");

  return (
    <section className="shell grid min-h-svh content-center gap-6">
      <h1 className="display text-6xl">{t("headline")}</h1>
      <p className="measure text-lg text-fg-muted">{t("subline")}</p>
    </section>
  );
}
