import { getTranslations } from "next-intl/server";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/locales";
import { isPlaceholder } from "@/lib/placeholder";
import { CountUp } from "./CountUp";

/**
 * "In numbers". Rendered only when every figure in content/site.ts is confirmed —
 * the site never shows invented numbers. Today all values are placeholders, so
 * this returns nothing.
 */
export async function Stats({ locale, id }: { locale: Locale; id: string }) {
  if (site.stats.some((stat) => isPlaceholder(stat.value))) return null;
  const t = await getTranslations("home.stats");

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="section-y cv-auto border-t border-line">
      <div className="shell">
        <h2 id={`${id}-title`} className="display text-4xl">
          {t("title")}
        </h2>
        <dl className="mt-12 grid gap-px overflow-hidden rounded-media border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {site.stats.map((stat) => (
            <div key={stat.id} className="flex flex-col-reverse gap-3 bg-void p-8">
              <dt className="text-sm text-fg-muted">{stat.label[locale]}</dt>
              <dd className="display text-5xl tabular-nums">
                <CountUp value={stat.value} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
