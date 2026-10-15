import { Image } from "@/components/ui/Image";
import type { Sector } from "@/content/solutions";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/locales";

/** Sector card: 3:2 image, name and one line. */
export function SectorCard({
  sector,
  locale,
  sizes,
  priority = false,
}: {
  sector: Sector;
  locale: Locale;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <Link href={`/solutions/${sector.slug}`} className="group block">
      <span className="relative block aspect-[3/2] overflow-hidden rounded-media border border-line bg-surface">
        <Image
          src={sector.image.src}
          alt={sector.alt[locale]}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-[scale,filter] duration-700 ease-entrance group-hover:scale-[1.03] group-hover:brightness-110"
        />
      </span>
      <span className="mt-4 block text-lg font-medium text-fg">{sector.name[locale]}</span>
      <span className="mt-1 block text-sm text-fg-muted">{sector.line[locale]}</span>
    </Link>
  );
}
