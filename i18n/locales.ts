// Plain module (no next-intl import) so content files and Node scripts can share it.
export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeMeta: Record<Locale, { dir: "ltr" | "rtl"; hreflang: string; label: string; ogLocale: string }> = {
  en: { dir: "ltr", hreflang: "en-QA", label: "English", ogLocale: "en_QA" },
  ar: { dir: "rtl", hreflang: "ar-QA", label: "العربية", ogLocale: "ar_QA" },
};
