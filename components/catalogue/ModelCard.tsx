import { cn } from "@/lib/cn";

/** Plain, serializable card data (used by server pages and the client catalogue browser). */
export type ModelCardData = {
  slug: string;
  /** Locale-prefixed path to the model page. */
  href: string;
  code: string;
  type: string;
  power: string;
  cct: string;
  ip: string;
  variants: number;
  /** Pre-built variant sources (lib/catalogue-view.ts), so the card needs no client code. */
  image: { src: string; srcSet: string; sizes: string; width: number; height: number } | null;
};

/**
 * Catalogue card: the product photo on white at no more than its own size (the previous
 * site's photos are small — never upscaled), then code, type and key figures. Plain markup
 * (a link and an img): the catalogue renders 218 of them, so nothing here hydrates.
 */
export function ModelCard({
  model,
  variantsLabel,
  className,
}: {
  model: ModelCardData;
  variantsLabel: string;
  className?: string;
}) {
  return (
    <a
      href={model.href}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-media border border-rule bg-panel transition-[border-color,box-shadow] duration-300 hover:border-brand hover:shadow-[0_12px_32px_-16px_rgb(1_75_146/0.45)]",
        className,
      )}
    >
      <span className="relative block aspect-[4/3] bg-day-surface">
        {model.image && (
          // eslint-disable-next-line @next/next/no-img-element -- pre-built variants with srcset; see ModelCardData
          <img
            src={model.image.src}
            srcSet={model.image.srcSet}
            sizes={model.image.sizes}
            width={model.image.width}
            height={model.image.height}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 m-auto h-auto max-h-[84%] w-auto max-w-[84%] object-contain transition-transform duration-500 ease-entrance group-hover:scale-[1.04]"
          />
        )}
      </span>
      <span className="flex flex-1 flex-col gap-1 border-t border-rule p-4">
        <span className="text-lg font-semibold tracking-tight" dir="ltr">
          {model.code}
        </span>
        <span className="text-sm text-fg-muted">{model.type}</span>
        <span className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-3 text-xs text-fg-muted tabular-nums">
          <span dir="ltr">{model.power}</span>
          {model.cct && <span dir="ltr">{model.cct}</span>}
          <span dir="ltr">{model.ip}</span>
          <span>
            {model.variants} {variantsLabel}
          </span>
        </span>
      </span>
    </a>
  );
}
