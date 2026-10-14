import type { CSSProperties, ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SplitWords } from "@/components/motion/SplitWords";
import { JsonLd } from "@/components/seo/JsonLd";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/cn";
import { absoluteUrl } from "@/lib/seo";

export type Crumb = { label: string; href: string };

type PageHeaderProps = {
  locale: Locale;
  title: string;
  intro?: string;
  /** Trail after "Home"; the last item is the current page. */
  crumbs: Crumb[];
  /** Extra content under the intro (badges, actions). */
  children?: ReactNode;
  /** Media shown beside the text from 1024px (e.g. a product image). */
  aside?: ReactNode;
  className?: string;
};

const WORD_DELAY = { "--word-delay": "80ms" } as CSSProperties;

/**
 * Compact inner-page header: breadcrumb (+ BreadcrumbList JSON-LD), a headline revealed
 * word by word once (CSS only, ~0.6 s), and a one-line intro.
 */
export async function PageHeader({ locale, title, intro, crumbs, children, aside, className }: PageHeaderProps) {
  const t = await getTranslations("common");
  const trail: Crumb[] = [{ label: t("home"), href: "/" }, ...crumbs];
  const hasAside = Boolean(aside);

  return (
    <header
      className={cn(
        "shell pt-[calc(var(--header-h)+3rem)] pb-12 lg:pt-[calc(var(--header-h)+5rem)] lg:pb-16",
        hasAside && "grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16",
        className,
      )}
    >
      <div className={cn(hasAside && "lg:col-span-7")}>
        <nav aria-label={t("breadcrumb")}>
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-fg-muted">
            {trail.map((crumb, index) => {
              const current = index === trail.length - 1;
              return (
                <li key={crumb.href} className="flex items-center gap-1.5">
                  {index > 0 && (
                    <ChevronRight
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className="size-3.5 opacity-60 rtl:-scale-x-100"
                    />
                  )}
                  {current ? (
                    <span aria-current="page" className="text-fg">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="inline-flex min-h-11 items-center transition-colors hover:text-fg"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <h1 className="display word-reveal mt-6 max-w-[22ch] text-5xl" style={WORD_DELAY}>
          <SplitWords text={title} />
        </h1>
        {intro && <p className="measure mt-6 text-lg text-fg-muted">{intro}</p>}
        {children}
      </div>
      {hasAside && <div className="lg:col-span-5">{aside}</div>}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: trail.map((crumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: crumb.label,
            item: absoluteUrl(locale, crumb.href),
          })),
        }}
      />
    </header>
  );
}
