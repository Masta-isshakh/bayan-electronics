import { Image } from "@/components/ui/Image";
import { getTranslations } from "next-intl/server";
import { SpecChip } from "@/components/ui/Tag";
import type { ProductFamily } from "@/content/products";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/cn";
import { isPlaceholder } from "@/lib/placeholder";
import styles from "./tile.module.css";

type FamilyTileProps = {
  family: ProductFamily;
  locale: Locale;
  sizes: string;
  className?: string;
  /** Larger name for large bento tiles. */
  prominent?: boolean;
  /** Above-the-fold tile that is the page's LCP candidate. */
  priority?: boolean;
};

/**
 * Product family tile with the flashlight reveal. Must sit inside a FlashlightGrid,
 * which drives --mx/--my and the touch "first tap reveals" behaviour.
 */
export async function FamilyTile({
  family,
  locale,
  sizes,
  className,
  prominent = false,
  priority = false,
}: FamilyTileProps) {
  const ts = await getTranslations("specs");
  const tc = await getTranslations("common");

  return (
    <Link
      href={`/products/${family.slug}`}
      data-flashlight=""
      data-categories={family.categories.join(" ")}
      className={cn(styles.tile, "group", className)}
    >
      <Image src={family.image.src} alt="" fill sizes={sizes} priority={priority} className={styles.image} />
      <span className={styles.dim} aria-hidden="true" />
      <span className={styles.glow} aria-hidden="true" />
      <span className={styles.shade} aria-hidden="true" />

      <span className={styles.chips}>
        {family.chips.map((key) => {
          const pending = isPlaceholder(family.specs[key]);
          return (
            <SpecChip
              key={key}
              label={ts(key)}
              value={pending ? tc("toBeConfirmed") : family.specs[key]}
              pending={pending}
            />
          );
        })}
      </span>

      <span className={styles.body}>
        <span className={cn("block font-medium text-text", prominent ? "text-2xl" : "text-lg")}>
          {family.name[locale]}
        </span>
        <span className="mt-1.5 line-clamp-2 text-sm text-muted">{family.descriptor[locale]}</span>
      </span>
    </Link>
  );
}
