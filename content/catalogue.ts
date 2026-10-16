// The product catalogue: 218 models / 1008 variants imported from the previous website
// (see docs/catalogue-review.md for the choices made where its data was inconsistent).
// Server-only: pages and the search index import it; client components get plain props.
import data from "./catalogue.json";
import { mediaImage } from "./assets";
import type { FamilySlug } from "./taxonomy";
import type { ImageAsset, Localized } from "./types";

export type CatalogueCategory = { slug: string; parent: string | null; name: Localized };

export type Variant = {
  sku: string;
  powerW: number;
  /** Shown instead of the number when the rating is composite, e.g. "2×25W". */
  powerText?: string;
  lumens: number;
  cctK: number | null;
  ipRating: string;
  size?: string;
  /** Power and flux are per metre (profiles, strips). */
  perMetre?: true;
  type?: Localized;
  material?: Localized;
  driver?: Localized;
  dimming?: string;
  colour?: string;
};

type RawModel = {
  code: string;
  slug: string;
  type: Localized;
  path: string[];
  alsoIn?: string[];
  material: Localized | null;
  driver: Localized | null;
  ip: string[];
  cct: number[];
  power: [number, number];
  lumens: [number, number];
  sizes: string[];
  image: string | null;
  variants: Variant[];
};

export type Model = Omit<RawModel, "image"> & {
  image: ImageAsset | null;
  /** Leaf category slug. */
  category: string;
};

export const categories: CatalogueCategory[] = data.categories as CatalogueCategory[];

export const models: Model[] = (data.models as RawModel[]).map((model) => ({
  ...model,
  image: model.image ? mediaImage(model.image) : null,
  category: model.path[model.path.length - 1],
}));

const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));
const modelBySlug = new Map(models.map((model) => [model.slug, model]));

export const getModel = (slug: string): Model | undefined => modelBySlug.get(slug);
export const getCategory = (slug: string): CatalogueCategory | undefined => categoryBySlug.get(slug);
export const childCategories = (parent: string | null): CatalogueCategory[] =>
  categories.filter((category) => category.parent === parent);

/** Models in a category or any of its descendants (plus models also filed there). */
export function modelsInCategory(slug: string): Model[] {
  return models.filter((model) => model.path.includes(slug) || model.alsoIn?.includes(slug));
}

/** Category trail from the top level down to the model's leaf. */
export function categoryTrail(model: Model): CatalogueCategory[] {
  return model.path.map((slug) => categoryBySlug.get(slug)).filter((c): c is CatalogueCategory => Boolean(c));
}

// ── Product families (the range overview) → catalogue models ────────────────────
// Each model belongs to at most one family; retrofit lamps and indoor wall lights are
// catalogue-only. Order matters: the first matching rule wins.
const familyRules: [FamilySlug, (model: Model) => boolean][] = [
  ["led-strips-profiles", (m) => m.code.startsWith("PF")],
  ["led-panels", (m) => m.code.startsWith("PL")],
  ["high-bay-industrial", (m) => m.path.includes("industrial-lighting")],
  ["street-roadway", (m) => m.path.includes("road-tunnel-lighting") || m.category === "urban-lights"],
  ["facade-architectural", (m) => m.path.includes("facade-lighting") || m.path.includes("landscape-garden-lighting")],
  ["floodlights-area", (m) => m.path.includes("area-lighting")],
  [
    "downlights-spotlights",
    (m) => ["downlights", "down-lights", "track-lights"].includes(m.category) || m.code.startsWith("PD"),
  ],
  [
    "linear-batten",
    (m) => ["linear", "linear-lights", "linear-lights-surface"].includes(m.category) || m.code.startsWith("TN"),
  ],
];

export function familyOf(model: Model): FamilySlug | null {
  return familyRules.find(([, matches]) => matches(model))?.[0] ?? null;
}

export function modelsForFamily(family: FamilySlug): Model[] {
  return models.filter((model) => familyOf(model) === family);
}

// ── Display helpers ─────────────────────────────────────────────────────────────
const range = ([min, max]: [number, number], unit: string) =>
  min === max ? `${format(min)} ${unit}` : `${format(min)}–${format(max)} ${unit}`;
const format = (value: number) => (Number.isInteger(value) ? value.toLocaleString("en") : value.toFixed(1));

export function powerLabel(model: Model): string {
  const perMetre = model.variants.some((variant) => variant.perMetre);
  return range(model.power, perMetre ? "W/m" : "W");
}

export function lumenLabel(model: Model): string {
  const perMetre = model.variants.some((variant) => variant.perMetre);
  return range(model.lumens, perMetre ? "lm/m" : "lm");
}

export function cctLabel(model: Model): string {
  return model.cct.length ? `${model.cct.join(" / ")} K` : "";
}

/** Above this, a variant's power or flux is a data error (listed in docs/catalogue-review.md). */
const MAX_PLAUSIBLE_EFFICACY = 200;
const efficacies = (variants: Variant[]) =>
  variants
    .filter((v) => v.powerW > 0 && v.lumens > 0)
    .map((v) => v.lumens / v.powerW)
    .filter((value) => value <= MAX_PLAUSIBLE_EFFICACY);

/** Luminous efficacy range in lm/W across variants. */
export function efficacyLabel(model: Model): string | null {
  const values = efficacies(model.variants);
  if (!values.length) return null;
  return range([Math.round(Math.min(...values)), Math.round(Math.max(...values))], "lm/W");
}

/** Up to `count` other models from the same leaf category, then the same parent. */
export function relatedModels(model: Model, count = 8): Model[] {
  const parent = model.path[model.path.length - 2];
  const sameLeaf = models.filter((other) => other !== model && other.category === model.category);
  const sameParent = models.filter(
    (other) => other !== model && other.category !== model.category && other.path.includes(parent),
  );
  return [...sameLeaf, ...sameParent].slice(0, count);
}

export const catalogueStats = {
  models: models.length,
  variants: models.reduce((total, model) => total + model.variants.length, 0),
};

/**
 * Spec ranges for a product family, computed from its catalogue models (power, efficacy,
 * CCT, IP). CRI and warranty are not in the catalogue data and stay with the family.
 */
export function familySpecs(family: FamilySlug): Partial<Record<"power" | "efficacy" | "cct" | "ipik", string>> {
  const list = modelsForFamily(family);
  if (!list.length) return {};
  const variants = list.flatMap((model) => model.variants);
  const whole = variants.filter((variant) => !variant.perMetre);
  const powered = (whole.length ? whole : variants).filter((variant) => variant.powerW > 0);
  const unit = whole.length ? "W" : "W/m";
  const watts = powered.map((variant) => variant.powerW);
  const efficacy = efficacies(variants).map(Math.round);
  const ccts = [...new Set(list.flatMap((model) => model.cct))].sort((a, b) => a - b);
  const ips = [...new Set(list.flatMap((model) => model.ip))].sort();
  return {
    power: range([Math.min(...watts), Math.max(...watts)], unit),
    ...(efficacy.length ? { efficacy: range([Math.min(...efficacy), Math.max(...efficacy)], "lm/W") } : {}),
    ...(ccts.length ? { cct: `${ccts.join(" / ")} K` } : {}),
    ipik: ips.join(" · "),
  };
}
