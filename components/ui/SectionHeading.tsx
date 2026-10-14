import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  id: string;
  title: string;
  intro?: string;
  action?: { href: string; label: string };
  className?: string;
};

/** Section title + intro, with an optional "view all" link aligned to the end. */
export function SectionHeading({ id, title, intro, action, className }: SectionHeadingProps) {
  return (
    <div className={cn("grid gap-6 md:grid-cols-12 md:items-end", className)}>
      <div className="md:col-span-8 lg:col-span-7">
        <h2 id={id} className="display text-4xl">
          {title}
        </h2>
        {intro && <p className="measure mt-5 text-lg text-fg-muted">{intro}</p>}
      </div>
      {action && (
        <div className="md:col-span-4 md:justify-self-end lg:col-span-5">
          <TextLink href={action.href}>{action.label}</TextLink>
        </div>
      )}
    </div>
  );
}

/** Text link with a direction-aware arrow — for "view all" style links only. */
export function TextLink({ href, children, className }: { href: string; children: string; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex min-h-11 items-center gap-2 text-sm font-medium text-fg underline decoration-transparent decoration-2 underline-offset-[0.45em] transition-colors hover:decoration-maroon",
        className,
      )}
    >
      {children}
      <ArrowRight
        aria-hidden="true"
        strokeWidth={1.5}
        className="size-4 text-lumen transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
      />
    </Link>
  );
}
