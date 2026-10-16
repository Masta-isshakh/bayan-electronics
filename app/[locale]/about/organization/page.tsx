import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CompanyNav } from "@/components/company/CompanyNav";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { organization } from "@/content/company";
import { type LocaleParams, resolveLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.organization" });
  return pageMetadata({ locale, path: "/about/organization", title: t("title"), description: t("description") });
}

export default async function OrganizationPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("organization");
  const ta = await getTranslations("about");
  const tn = await getTranslations("company.nav");

  return (
    <>
      <PageHeader
        locale={locale}
        title={t("title")}
        intro={t("intro")}
        crumbs={[
          { label: tn("about"), href: "/about" },
          { label: t("title"), href: "/about/organization" },
        ]}
      >
        <p className="measure mt-5 text-base text-fg/85">{organization.intro[locale]}</p>
      </PageHeader>

      <CompanyNav current="organization" />

      <section aria-labelledby="leadership-title" className="section-y">
        <div className="shell">
          <h2 id="leadership-title" className="display text-4xl">
            {t("leadershipTitle")}
          </h2>
          <p className="measure mt-5 text-lg text-fg-muted">{organization.leadership[locale]}</p>

          {/* Org chart: CEO → VP Manufacturing → departments, joined by hairlines. */}
          <div className="mt-14 flex flex-col items-center">
            <div className="rounded-media border border-brand bg-brand px-8 py-5 text-center text-lg font-medium text-text">
              {t("president")}
            </div>
            <span aria-hidden="true" className="h-10 w-px bg-line-strong" />
            <div className="rounded-media border border-line-strong bg-surface px-8 py-5 text-center text-lg font-medium">
              {t("vicePresident")}
            </div>
            <span aria-hidden="true" className="h-10 w-px bg-line-strong" />
          </div>
        </div>
      </section>

      <section aria-labelledby="departments-title" className="daylight section-y cv-auto">
        <div className="shell">
          <h2 id="departments-title" className="display text-4xl">
            {t("departmentsTitle")}
          </h2>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {organization.departments.map((department, index) => (
              <li key={department.id} className="rounded-media border border-rule bg-panel p-6">
                <span className="text-sm text-brand tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-lg font-medium">{department.title[locale]}</h3>
                <p className="mt-2 text-base text-fg-muted">{department.text[locale]}</p>
              </li>
            ))}
          </ul>
          <p className="measure mt-12 text-lg">{organization.closing[locale]}</p>
        </div>
      </section>

      <CtaBand title={ta("ctaTitle")} text={ta("ctaText")} />
    </>
  );
}
