import type { Locale } from "@/i18n/locales";

/**
 * A bilingual string. `confirm` flags copy the client must verify before launch;
 * scripts/content-todo.mjs lists every flag in CONTENT-TODO.md.
 */
export type Localized = { readonly [L in Locale]: string } & { readonly confirm?: string };

export type ImageAsset = {
  /** Path under public/media, e.g. "products/led-panels.jpg". */
  readonly path: string;
  /** Public URL including the content-hash version query. */
  readonly src: string;
  readonly width: number;
  readonly height: number;
  /** True while the file is a generated placeholder (or missing). */
  readonly placeholder: boolean;
};

export type MediaFile = {
  readonly path: string;
  readonly src: string;
  readonly available: boolean;
};

/** Marks a record whose existence or naming the client still has to confirm. */
export type Confirmable = { readonly confirm?: true };
