/** One searchable destination, served by app/[locale]/search-index.json. */
export type SearchEntry = {
  kind: "model" | "family" | "sector" | "project" | "page";
  title: string;
  subtitle: string;
  /** Locale-less path, e.g. "/catalogue/hb82". */
  href: string;
  /** Extra text that should match (codes, categories, both languages’ names). */
  keywords: string;
  /** Small image path under /media for model results. */
  image?: string;
};

export type SearchLabels = {
  open: string;
  title: string;
  placeholder: string;
  close: string;
  empty: string;
  hint: string;
  kinds: Record<SearchEntry["kind"], string>;
};

/** Lowercase, strip Latin diacritics and Arabic tashkeel/tatweel, unify alef/yaa/taa marbuta. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[ً-ٰٟـ]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}
