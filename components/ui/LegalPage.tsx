import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/locales";
import { PageHeader } from "./PageHeader";

type LegalSection = { heading: string; body: string };

/** Privacy / terms layout: page header + daylight body with a visible draft notice. */
export async function LegalPage({ locale, kind }: { locale: Locale; kind: "privacy" | "terms" }) {
  const t = await getTranslations("legal");
  const sections = t.raw(`${kind}.sections`) as LegalSection[];

  return (
    <>
      <PageHeader
        locale={locale}
        title={t(`${kind}.title`)}
        intro={t(`${kind}.intro`)}
        crumbs={[{ label: t(`${kind}.title`), href: `/${kind}` }]}
      />
      <section className="daylight section-y">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <p className="rounded-media border border-dashed border-lumen-deep/60 p-4 text-sm text-fg-muted">
              {t("draftNote")}
            </p>
          </aside>
          <div className="measure space-y-10 lg:col-span-7 lg:col-start-6">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-medium">{section.heading}</h2>
                <p className="mt-3 text-base text-fg-muted">{section.body}</p>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
