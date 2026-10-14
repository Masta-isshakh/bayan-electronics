import { IBM_Plex_Sans_Arabic } from "next/font/google";
import localFont from "next/font/local";

/**
 * Latin for both locales: Archivo, self-hosted and reduced to weight 400–700 ×
 * width 100–125 %, Latin-1 (see fonts/README.md) — 46 KB instead of 88 KB.
 */
export const archivo = localFont({
  src: "../fonts/archivo-variable.woff2",
  weight: "400 700",
  style: "normal",
  display: "swap",
  variable: "--font-archivo",
  declarations: [{ prop: "font-stretch", value: "100% 125%" }],
  adjustFontFallback: "Arial",
});

/**
 * Arabic, applied only on /ar. Not preloaded: the [locale] layout is shared by both
 * locales, so a preload would make every English page download Arabic files too.
 * Without the class on <html>, English pages never request these fonts.
 * No fallback metrics: an unranged fallback face would capture Latin glyphs
 * before Archivo gets them.
 */
export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-plex-arabic",
  preload: false,
  adjustFontFallback: false,
});
