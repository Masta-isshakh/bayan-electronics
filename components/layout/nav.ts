import type { ImageAsset } from "@/content/types";

/** Primary navigation, shared by the desktop header, mobile menu and footer. */
export const primaryNav = [
  { key: "solutions", href: "/solutions" },
  { key: "manufacturing", href: "/manufacturing" },
  { key: "projects", href: "/projects" },
  { key: "about", href: "/about" },
] as const;

export type NavKey = (typeof primaryNav)[number]["key"];

/** Serializable data the client header needs (no content modules on the client). */
export type NavFamily = { slug: string; name: string; descriptor: string };
export type NavFeature = { href: string; title: string; text: string; image: ImageAsset; alt: string };
