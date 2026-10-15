import { getFamily, products } from "@/content/products";
import { site } from "@/content/site";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = site.brand.name.en;
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return products.map((family) => ({ family: family.slug }));
}

/** Share card per product family (English family name; see lib/og.tsx). */
export default async function FamilyOpengraphImage({ params }: { params: Promise<{ family: string }> }) {
  const family = getFamily((await params).family);
  return renderOgImage({ kicker: "Product family", title: family?.name.en ?? site.brand.name.en });
}
