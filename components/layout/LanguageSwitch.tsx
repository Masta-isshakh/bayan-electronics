"use client";

import { Fragment, type MouseEvent } from "react";
import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { localeMeta, locales, type Locale } from "@/i18n/locales";
import { cn } from "@/lib/cn";
import type { LanguageLabels } from "./nav";

const shortLabel: Record<Locale, string> = { en: "EN", ar: "AR" };

/** EN | AR. Keeps the current path, query and hash when switching. */
export function LanguageSwitch({ labels, className }: { labels: LanguageLabels; className?: string }) {
  const current = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function keepQuery(event: MouseEvent<HTMLAnchorElement>, target: Locale) {
    const { search, hash } = window.location;
    if (!search && !hash) return;
    event.preventDefault();
    router.replace(`${pathname}${search}${hash}`, { locale: target });
  }

  return (
    <div role="group" aria-label={labels.group} className={cn("flex items-center text-sm", className)}>
      {locales.map((locale, index) => (
        <Fragment key={locale}>
          {index > 0 && <span aria-hidden="true" className="mx-1 h-4 w-px bg-rule-strong" />}
          {locale === current ? (
            <span
              aria-current="true"
              className="inline-flex min-h-11 min-w-9 items-center justify-center font-medium text-fg"
            >
              {shortLabel[locale]}
            </span>
          ) : (
            <Link
              href={pathname}
              locale={locale}
              hrefLang={localeMeta[locale].hreflang}
              onClick={(event) => keepQuery(event, locale)}
              className="inline-flex min-h-11 min-w-9 items-center justify-center text-fg-muted transition-colors hover:text-fg"
            >
              {shortLabel[locale]}
              <span className="sr-only"> {labels.switchTo[locale]}</span>
            </Link>
          )}
        </Fragment>
      ))}
    </div>
  );
}
