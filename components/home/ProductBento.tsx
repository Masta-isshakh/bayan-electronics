import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpecChip } from "@/components/ui/Tag";
import { products, type ProductFamily } from "@/content/products";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/cn";
import { isPlaceholder } from "@/lib/placeholder";
import { FlashlightGrid } from "./FlashlightGrid";
import styles from "./bento.module.css";

// Desktop: a 10-column grid — 2 large (4×2), 4 medium (3×2), 5 small (2×1).
// Phones: 2 columns; large tiles and the last small tile span both.
const tileLayout: Record<ProductFamily["tile"], { className: string; sizes: string }> = {
  large: { className: "col-span-2 aspect-[4/3] lg:col-span-4 lg:row-span-2", sizes: "(min-width: 1024px) 40vw, 100vw" },
  medium: { className: "aspect-[3/4] lg:col-span-3 lg:row-span-2", sizes: "(min-width: 1024px) 30vw, 50vw" },
  small: {
    className: "aspect-square max-lg:last:col-span-2 max-lg:last:aspect-[2/1] lg:col-span-2",
    sizes: "(min-width: 1024px) 20vw, 50vw",
  },
};

export async function ProductBento({ locale, id }: { locale: Locale; id: string }) {
  const t = await getTranslations("home.products");
  const ts = await getTranslations("specs");
  const tc = await getTranslations("common");

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="section-y">
      <div className="shell">
        <SectionHeading
          id={`${id}-title`}
          title={t("title")}
          intro={t("intro")}
          action={{ href: "/products", label: t("viewAll") }}
        />

        <FlashlightGrid data-defer="" className="mt-12 grid grid-cols-2 gap-3 md:gap-4 lg:mt-16 lg:auto-rows-[15rem] lg:grid-cols-10">
          {products.map((family) => {
            const layout = tileLayout[family.tile];
            return (
              <Link
                key={family.slug}
                href={`/products/${family.slug}`}
                data-flashlight=""
                className={cn(styles.tile, "group", layout.className, "lg:aspect-auto")}
              >
                <Image src={family.image.src} alt="" fill sizes={layout.sizes} className={styles.image} />
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
                  <span className={cn("block font-medium text-text", family.tile === "large" ? "text-2xl" : "text-lg")}>
                    {family.name[locale]}
                  </span>
                  <span className="mt-1.5 line-clamp-2 text-sm text-muted">{family.descriptor[locale]}</span>
                </span>
              </Link>
            );
          })}
        </FlashlightGrid>
      </div>
    </section>
  );
}
