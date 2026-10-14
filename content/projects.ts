import { pending } from "@/lib/placeholder";
import { assets } from "./assets";
import type { FamilySlug, ProjectSlug, SectorSlug } from "./taxonomy";
import type { ImageAsset, Localized } from "./types";

export type ProjectFactKey = "client" | "location" | "year" | "scope";

export type Project = {
  slug: ProjectSlug;
  /** Sample record — shown with a visible "Sample" badge until replaced by a real project. */
  isPlaceholder: boolean;
  featured: boolean;
  sector: SectorSlug;
  title: Localized;
  summary: Localized;
  image: ImageAsset;
  alt: Localized;
  gallery: { image: ImageAsset; alt: Localized }[];
  facts: Record<ProjectFactKey, Localized>;
  products: FamilySlug[];
};

function sampleFacts(project: string): Record<ProjectFactKey, Localized> {
  return {
    client: { en: pending(`client name — ${project}`), ar: pending(`client name (Arabic) — ${project}`) },
    location: { en: pending(`location — ${project}`), ar: pending(`location (Arabic) — ${project}`) },
    year: { en: pending(`completion year — ${project}`), ar: pending(`completion year — ${project}`) },
    scope: { en: pending(`scope of supply — ${project}`), ar: pending(`scope of supply (Arabic) — ${project}`) },
  };
}

function sampleSummary(project: string): Localized {
  return { en: pending(`project summary — ${project}`), ar: pending(`project summary (Arabic) — ${project}`) };
}

export const projects: Project[] = [
  {
    slug: "project-01",
    isPlaceholder: true,
    featured: true,
    sector: "commercial-offices",
    title: { en: "Office tower, Doha — sample", ar: "برج مكاتب، الدوحة — نموذج" },
    summary: sampleSummary("project-01"),
    image: assets.projects["project-01"],
    alt: { en: "Office floor lit by LED panels", ar: "طابق مكاتب مضاء بألواح LED" },
    gallery: [
      { image: assets.solutions["commercial-offices"], alt: { en: "Open-plan office", ar: "مكتب مفتوح" } },
      { image: assets.products["linear-batten"], alt: { en: "Linear luminaires", ar: "وحدات إنارة خطية" } },
    ],
    facts: sampleFacts("project-01"),
    products: ["led-panels", "linear-batten", "smart-connected"],
  },
  {
    slug: "project-02",
    isPlaceholder: true,
    featured: false,
    sector: "industrial-warehouses",
    title: { en: "Logistics warehouse, Qatar — sample", ar: "مستودع لوجستي، قطر — نموذج" },
    summary: sampleSummary("project-02"),
    image: assets.projects["project-02"],
    alt: { en: "Warehouse under high-bay lighting", ar: "مستودع تحت إنارة الأسقف العالية" },
    gallery: [
      { image: assets.solutions["industrial-warehouses"], alt: { en: "Warehouse aisles", ar: "ممرات المستودع" } },
      {
        image: assets.products["high-bay-industrial"],
        alt: { en: "High-bay luminaire", ar: "وحدة إنارة للأسقف العالية" },
      },
    ],
    facts: sampleFacts("project-02"),
    products: ["high-bay-industrial", "linear-batten", "floodlights-area"],
  },
  {
    slug: "project-03",
    isPlaceholder: true,
    featured: true,
    sector: "infrastructure-roads",
    title: { en: "Roadway lighting upgrade, Qatar — sample", ar: "تحديث إنارة طريق، قطر — نموذج" },
    summary: sampleSummary("project-03"),
    image: assets.projects["project-03"],
    alt: { en: "Road lit by LED street lights", ar: "طريق مضاء بوحدات إنارة شوارع LED" },
    gallery: [
      {
        image: assets.solutions["infrastructure-roads"],
        alt: { en: "Road interchange at night", ar: "تقاطع طرق ليلاً" },
      },
      { image: assets.products["street-roadway"], alt: { en: "Street light", ar: "وحدة إنارة شوارع" } },
    ],
    facts: sampleFacts("project-03"),
    products: ["street-roadway", "smart-connected"],
  },
  {
    slug: "project-04",
    isPlaceholder: true,
    featured: true,
    sector: "hospitality",
    title: { en: "Hotel lobby and façade, Doha — sample", ar: "ردهة فندق وواجهته، الدوحة — نموذج" },
    summary: sampleSummary("project-04"),
    image: assets.projects["project-04"],
    alt: { en: "Hotel lobby with warm lighting", ar: "ردهة فندق بإضاءة دافئة" },
    gallery: [
      { image: assets.solutions.hospitality, alt: { en: "Hotel interior", ar: "التصميم الداخلي للفندق" } },
      { image: assets.products["facade-architectural"], alt: { en: "Lit façade", ar: "واجهة مضاءة" } },
    ],
    facts: sampleFacts("project-04"),
    products: ["downlights-spotlights", "led-strips-profiles", "facade-architectural"],
  },
  {
    slug: "project-05",
    isPlaceholder: true,
    featured: false,
    sector: "mosques-public",
    title: { en: "Mosque interior and exterior, Qatar — sample", ar: "إنارة داخلية وخارجية لمسجد، قطر — نموذج" },
    summary: sampleSummary("project-05"),
    image: assets.projects["project-05"],
    alt: { en: "Mosque prayer hall lighting", ar: "إنارة قاعة الصلاة في مسجد" },
    gallery: [
      { image: assets.solutions["mosques-public"], alt: { en: "Mosque at night", ar: "مسجد ليلاً" } },
      { image: assets.products["custom-oem"], alt: { en: "Custom luminaire", ar: "وحدة إنارة مخصّصة" } },
    ],
    facts: sampleFacts("project-05"),
    products: ["facade-architectural", "downlights-spotlights", "custom-oem"],
  },
  {
    slug: "project-06",
    isPlaceholder: true,
    featured: false,
    sector: "education-healthcare",
    title: { en: "School campus, Qatar — sample", ar: "حرم مدرسي، قطر — نموذج" },
    summary: sampleSummary("project-06"),
    image: assets.projects["project-06"],
    alt: { en: "Classroom lit by LED panels", ar: "فصل دراسي مضاء بألواح LED" },
    gallery: [
      { image: assets.solutions["education-healthcare"], alt: { en: "Classroom", ar: "فصل دراسي" } },
      { image: assets.products["led-panels"], alt: { en: "LED panel", ar: "لوح LED" } },
    ],
    facts: sampleFacts("project-06"),
    products: ["led-panels", "linear-batten"],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
