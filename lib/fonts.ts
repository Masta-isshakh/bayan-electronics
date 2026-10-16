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

/** Display stack: Archivo, then fallbacks sized for its 118 % width (see app/globals.css). */
export const displayFontStack = `${archivo.style.fontFamily.split(",")[0]}, "Archivo Display Fallback", "Archivo Display Fallback Android", ui-sans-serif, sans-serif`;

/**
 * Arabic font files (declared with @font-face in app/globals.css). Preloaded by the
 * [locale] layout on /ar only — English pages never request them. Self-hosted rather
 * than next/font so the preload can be per locale inside the shared layout.
 */
export const arabicFontFiles = ["/fonts/arabic-sans-400.v1.woff2", "/fonts/arabic-sans-700.v1.woff2"] as const;
