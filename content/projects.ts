// Project references: 44 projects published on the company's previous website
// (b-ledtec.com, English and Arabic posts), imported with their photos. Client names,
// years and locations are the company's own; items to verify are in CONTENT-TODO.md.
import data from "./projects.json";
import { mediaImage } from "./assets";
import type { SectorSlug } from "./taxonomy";
import type { ImageAsset, Localized } from "./types";

export type ProjectCategory = { slug: string; name: Localized };

type RawProject = {
  slug: string;
  category: string;
  sector: SectorSlug;
  featured: boolean;
  title: Localized;
  projectName: Localized;
  client: Localized;
  consultant: Localized | null;
  contractor: Localized | null;
  year: number | null;
  location: Localized;
  country: string;
  summary: Localized;
  body: { en: string[]; ar: string[] };
  scope: { en: string[]; ar: string[] } | null;
  image: string | null;
  gallery: string[];
  hasRealPhoto: boolean;
};

export type Project = Omit<RawProject, "image" | "gallery"> & {
  /** Kept for the sample-project features (badge, noindex); every imported project is real. */
  isPlaceholder: false;
  image: ImageAsset;
  alt: Localized;
  gallery: { image: ImageAsset; alt: Localized }[];
};

export const projectCategories: ProjectCategory[] = data.categories;

const altFor = (project: RawProject, index?: number): Localized => ({
  en: `${project.title.en}, ${project.location.en}${index ? ` — photo ${index + 1}` : ""}`,
  ar: `${project.title.ar}، ${project.location.ar}${index ? ` — صورة ${index + 1}` : ""}`,
});

export const projects: Project[] = (data.projects as RawProject[])
  .map((project) => {
    const gallery = project.gallery
      .map((path, index) => ({ image: mediaImage(path), alt: altFor(project, index + 1) }))
      .filter((item): item is { image: ImageAsset; alt: Localized } => Boolean(item.image));
    const image = (project.image && mediaImage(project.image)) ?? gallery[0]?.image ?? null;
    return image ? { ...project, isPlaceholder: false as const, image, alt: altFor(project), gallery } : null;
  })
  .filter((project): project is Project => Boolean(project));

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getProjectCategory(slug: string): ProjectCategory | undefined {
  return projectCategories.find((category) => category.slug === slug);
}

export const projectsInSector = (sector: SectorSlug) => projects.filter((project) => project.sector === sector);
