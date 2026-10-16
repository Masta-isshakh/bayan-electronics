// Server-side view models for the catalogue UI: card data, browser entries, category tree.
import { getImageProps } from "next/image";
import type { BrowserEntry, TreeNode } from "@/components/catalogue/CatalogueBrowser";
import type { ModelCardData } from "@/components/catalogue/ModelCard";
import { normalize } from "@/components/search/search-types";
import {
  categories,
  categoryTrail,
  cctLabel,
  childCategories,
  modelsInCategory,
  models,
  powerLabel,
  type Model,
} from "@/content/catalogue";
import type { Locale } from "@/i18n/locales";
import imageLoader from "./image-loader";

function cardImage(model: Model): ModelCardData["image"] {
  if (!model.image) return null;
  const { width, height, src } = model.image;
  const sizes = `${Math.min(width, 320)}px`;
  const { props } = getImageProps({ src, width, height, sizes, alt: "", loader: imageLoader });
  return { src: props.src, srcSet: props.srcSet ?? "", sizes, width, height };
}

export function toCardData(model: Model, locale: Locale): ModelCardData {
  return {
    slug: model.slug,
    href: `/${locale}/catalogue/${model.slug}`,
    code: model.code,
    type: model.type[locale],
    power: powerLabel(model),
    cct: cctLabel(model),
    ip: model.ip.join(" · "),
    variants: model.variants.length,
    image: cardImage(model),
  };
}

export function browserEntries(locale: Locale): BrowserEntry[] {
  return models.map((model) => ({
    ...toCardData(model, locale),
    path: [...model.path, ...(model.alsoIn ?? [])],
    ipList: model.ip,
    cctList: model.cct,
    search: normalize(
      [
        model.code,
        model.code.replace(/[^a-z0-9]/gi, ""),
        ...model.variants.map((variant) => variant.sku),
        model.type.en,
        model.type.ar,
        ...categoryTrail(model).flatMap((category) => [category.name.en, category.name.ar]),
      ].join(" "),
    ),
  }));
}

export function categoryTree(locale: Locale): TreeNode[] {
  const node = (slug: string, name: string): TreeNode => ({
    slug,
    name,
    count: modelsInCategory(slug).length,
    children: childCategories(slug).map((child) => node(child.slug, child.name[locale])),
  });
  return childCategories(null).map((top) => node(top.slug, top.name[locale]));
}

export const ipOptions = [...new Set(models.flatMap((model) => model.ip))].sort();
export const cctOptions = [...new Set(models.flatMap((model) => model.cct))].sort((a, b) => a - b);
export const categoryCount = categories.length;
