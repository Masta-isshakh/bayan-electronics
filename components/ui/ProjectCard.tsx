import { Image } from "@/components/ui/Image";
import type { Project } from "@/content/projects";
import { getSector } from "@/content/solutions";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/cn";
import { SampleBadge, Tag } from "./Tag";

type ProjectCardProps = {
  project: Project;
  locale: Locale;
  sampleLabel: string;
  sizes: string;
  /** Tailwind aspect class for the image. */
  aspect?: string;
  headingLevel?: "h2" | "h3";
  priority?: boolean;
};

/** Project tile: image (revealed once with a clip-path wipe), sector tag, sample badge, title. */
export function ProjectCard({
  project,
  locale,
  sampleLabel,
  sizes,
  aspect = "aspect-[3/2]",
  headingLevel = "h3",
  priority = false,
}: ProjectCardProps) {
  const Heading = headingLevel;
  const sector = getSector(project.sector);

  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <span
        data-reveal="clip"
        className={cn("relative block overflow-hidden rounded-media border border-line bg-surface", aspect)}
      >
        <Image
          src={project.image.src}
          alt={project.alt[locale]}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-[scale] duration-700 ease-entrance group-hover:scale-[1.03]"
        />
      </span>
      <span className="mt-4 flex flex-wrap items-center gap-2">
        {sector && <Tag>{sector.name[locale]}</Tag>}
        {project.isPlaceholder && <SampleBadge label={sampleLabel} />}
      </span>
      <Heading className="mt-3 text-xl font-medium text-fg">{project.title[locale]}</Heading>
    </Link>
  );
}
