import { Archivo, IBM_Plex_Sans_Arabic } from "next/font/google";

/** Latin for both locales. Variable weight + width axis for the expanded display cut. */
export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
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
