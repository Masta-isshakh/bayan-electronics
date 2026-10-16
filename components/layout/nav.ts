import type { ImageAsset } from "@/content/types";
import type { Locale } from "@/i18n/locales";

/** Primary navigation, shared by the desktop header, mobile menu and footer. */
export const primaryNav = [
  { key: "solutions", href: "/solutions" },
  { key: "manufacturing", href: "/manufacturing" },
  { key: "projects", href: "/projects" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
] as const;

export type NavKey = (typeof primaryNav)[number]["key"] | "products";

/** Serializable data the client header needs (no content modules on the client). */
export type NavFamily = { slug: string; name: string; descriptor: string };
export type NavFeature = { href: string; title: string; text: string; image: ImageAsset; alt: string };

/**
 * Strings for client navigation components, resolved on the server so the client
 * bundle needs no message-formatting runtime.
 */
export type LanguageLabels = { group: string; switchTo: Record<Locale, string> };

export type NavLabels = Record<NavKey, string> & {
  primary: string;
  allProducts: string;
  productsIntro: string;
  openMenu: string;
  closeMenu: string;
  menu: string;
  homeLink: string;
  requestQuote: string;
  language: LanguageLabels;
};
