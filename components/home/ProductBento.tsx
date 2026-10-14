import { getTranslations } from "next-intl/server";
import { FamilyTile } from "@/components/products/FamilyTile";
import { FlashlightGrid } from "@/components/products/FlashlightGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { products, type ProductFamily } from "@/content/products";
import type { Locale } from "@/i18n/locales";

// Desktop: a 10-column grid — 2 large (4×2), 4 medium (3×2), 5 small (2×1).
// Phones: 2 columns; large tiles and the last small tile span both.
const tileLayout: Record<ProductFamily["tile"], { className: string; sizes: string }> = {
  large: {
    className: "col-span-2 aspect-[4/3] lg:col-span-4 lg:row-span-2 lg:aspect-auto",
    sizes: "(min-width: 1024px) 40vw, 100vw",
  },
  medium: {
    className: "aspect-[3/4] lg:col-span-3 lg:row-span-2 lg:aspect-auto",
    sizes: "(min-width: 1024px) 30vw, 50vw",
  },
  small: {
    className: "aspect-square max-lg:last:col-span-2 max-lg:last:aspect-[2/1] lg:col-span-2 lg:aspect-auto",
    sizes: "(min-width: 1024px) 20vw, 50vw",
  },
};

export async function ProductBento({ locale, id }: { locale: Locale; id: string }) {
  const t = await getTranslations("home.products");

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="section-y">
      <div className="shell">
        <SectionHeading
          id={`${id}-title`}
          title={t("title")}
          intro={t("intro")}
          action={{ href: "/products", label: t("viewAll") }}
        />

        <FlashlightGrid
          data-defer=""
          className="mt-12 grid grid-cols-2 gap-3 md:gap-4 lg:mt-16 lg:auto-rows-[15rem] lg:grid-cols-10"
        >
          {products.map((family) => (
            <FamilyTile
              key={family.slug}
              family={family}
              locale={locale}
              sizes={tileLayout[family.tile].sizes}
              className={tileLayout[family.tile].className}
              prominent={family.tile === "large"}
            />
          ))}
        </FlashlightGrid>
      </div>
    </section>
  );
}
