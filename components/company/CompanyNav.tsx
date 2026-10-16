import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

const pages = [
  { key: "about", href: "/about" },
  { key: "ceo", href: "/about/ceo-message" },
  { key: "organization", href: "/about/organization" },
  { key: "distributor", href: "/distributors" },
] as const;

export type CompanyPage = (typeof pages)[number]["key"];

/** Tabs across the Company pages; scrolls sideways on narrow screens. */
export async function CompanyNav({ current }: { current: CompanyPage }) {
  const t = await getTranslations("company");

  return (
    <nav aria-label={t("label")} className="shell">
      <ul className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
        {pages.map((page) => (
          <li key={page.key} className="shrink-0">
            <Link
              href={page.href}
              aria-current={page.key === current ? "page" : undefined}
              className={cn(
                "inline-flex min-h-11 items-center rounded-full border border-line px-5 text-sm whitespace-nowrap text-fg-muted transition-colors",
                "hover:border-line-strong hover:text-fg",
                "aria-[current=page]:border-brand aria-[current=page]:bg-brand aria-[current=page]:text-text",
              )}
            >
              {t(`nav.${page.key}`)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
