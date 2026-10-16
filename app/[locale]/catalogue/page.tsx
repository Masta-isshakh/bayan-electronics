import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CatalogueBrowser } from "@/components/catalogue/CatalogueBrowser";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { catalogueStats } from "@/content/catalogue";
import { browserEntries, categoryTree, cctOptions, ipOptions } from "@/lib/catalogue-view";
import { type LocaleParams, resolveLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.catalogue" });
  return pageMetadata({ locale, path: "/catalogue", title: t("title"), description: t("description", catalogueStats) });
}

export default async function CataloguePage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("catalogue");
  const tp = await getTranslations("products");

  return (
    <>
      <PageHeader
        locale={locale}
        title={t("title")}
        intro={t("intro", catalogueStats)}
        crumbs={[
          { label: tp("title"), href: "/products" },
          { label: t("title"), href: "/catalogue" },
        ]}
      >
        <p className="measure mt-4 text-sm text-fg-muted">{t("quoteHint")}</p>
      </PageHeader>

      <section aria-label={t("title")} className="daylight section-y">
        <div className="shell">
          <CatalogueBrowser
            entries={browserEntries(locale)}
            tree={categoryTree(locale)}
            ipOptions={ipOptions}
            cctOptions={cctOptions}
            labels={{
              search: t("search"),
              all: t("all"),
              categories: t("categories"),
              ip: t("ip"),
              cct: t("cct"),
              results: t("results", { count: "{count}" }),
              clear: t("clear"),
              empty: t("empty"),
              variants: t("variants"),
            }}
          />
        </div>
      </section>

      <CtaBand title={t("ctaTitle")} text={t("ctaText")} />
    </>
  );
}
