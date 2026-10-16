import { getTranslations } from "next-intl/server";
import { catalogueStats } from "@/content/catalogue";
import { localeMeta, locales, type Locale } from "@/i18n/locales";
import type { LanguageLabels, NavLabels } from "./nav";

export async function getLanguageLabels(): Promise<LanguageLabels> {
  const t = await getTranslations("nav");
  return {
    group: t("language"),
    switchTo: Object.fromEntries(
      locales.map((locale) => [locale, t("switchLanguage", { language: localeMeta[locale].label })]),
    ) as Record<Locale, string>,
  };
}

export async function getNavLabels(): Promise<NavLabels> {
  const t = await getTranslations("nav");
  const tc = await getTranslations("common");
  const ts = await getTranslations("search");
  return {
    primary: t("primary"),
    products: t("products"),
    solutions: t("solutions"),
    manufacturing: t("manufacturing"),
    projects: t("projects"),
    about: t("about"),
    contact: t("contact"),
    catalogue: t("catalogue"),
    catalogueLink: t("catalogueLink", { count: catalogueStats.models }),
    allProducts: t("allProducts"),
    productsIntro: t("productsIntro"),
    openMenu: t("openMenu"),
    closeMenu: t("closeMenu"),
    menu: t("menu"),
    homeLink: t("homeLink"),
    requestQuote: tc("requestQuote"),
    quoteList: t("quoteList"),
    search: {
      open: ts("open"),
      title: ts("title"),
      placeholder: ts("placeholder"),
      close: ts("close"),
      empty: ts("empty"),
      hint: ts("hint"),
      kinds: {
        model: ts("kinds.model"),
        family: ts("kinds.family"),
        sector: ts("kinds.sector"),
        project: ts("kinds.project"),
        page: ts("kinds.page"),
      },
    },
    language: await getLanguageLabels(),
  };
}
