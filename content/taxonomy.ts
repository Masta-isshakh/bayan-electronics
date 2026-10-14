export const familySlugs = [
  "led-panels",
  "downlights-spotlights",
  "linear-batten",
  "high-bay-industrial",
  "floodlights-area",
  "street-roadway",
  "facade-architectural",
  "led-strips-profiles",
  "drivers-electronics",
  "smart-connected",
  "custom-oem",
] as const;
export type FamilySlug = (typeof familySlugs)[number];

export const sectorSlugs = [
  "commercial-offices",
  "industrial-warehouses",
  "infrastructure-roads",
  "hospitality",
  "retail-malls",
  "education-healthcare",
  "sports-outdoor",
  "residential-villas",
  "mosques-public",
] as const;
export type SectorSlug = (typeof sectorSlugs)[number];

export const productCategories = ["indoor", "outdoor", "electronics", "smart"] as const;
export type ProductCategory = (typeof productCategories)[number];

export const specKeys = ["efficacy", "cct", "cri", "ipik", "power", "warranty"] as const;
export type SpecKey = (typeof specKeys)[number];

export const projectSlugs = [
  "project-01",
  "project-02",
  "project-03",
  "project-04",
  "project-05",
  "project-06",
] as const;
export type ProjectSlug = (typeof projectSlugs)[number];
