import type { MetadataRoute } from "next";
import { products } from "@/content/products";
import { projects } from "@/content/projects";
import { sectors } from "@/content/solutions";
import { locales } from "@/i18n/locales";
import { absoluteUrl, languageAlternates } from "@/lib/seo";

const staticPaths = [
  "/",
  "/products",
  "/solutions",
  "/manufacturing",
  "/projects",
  "/about",
  "/about/ceo-message",
  "/about/organization",
  "/distributors",
  "/contact",
  "/quote",
  "/privacy",
  "/terms",
];

/** Every route in both locales, with hreflang alternates. Sample projects stay out until real. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...staticPaths,
    ...products.map((family) => `/products/${family.slug}`),
    ...sectors.map((sector) => `/solutions/${sector.slug}`),
    ...projects.filter((project) => !project.isPlaceholder).map((project) => `/projects/${project.slug}`),
  ];
  const lastModified = new Date();

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: absoluteUrl(locale, path),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : path.split("/").length > 2 ? 0.6 : 0.8,
      alternates: { languages: languageAlternates(path) },
    })),
  );
}
