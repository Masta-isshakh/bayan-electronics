"use client";

import { useCallback, useEffect, useRef, useState, type FocusEvent, type PointerEvent, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, Menu } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { LanguageSwitch } from "./LanguageSwitch";
import { MegaPanel } from "./MegaPanel";
import { MobileMenu } from "./MobileMenu";
import { primaryNav, type NavFamily, type NavFeature } from "./nav";

const SOLID_AFTER_PX = 40;
const HOVER_OPEN_MS = 80;
const HOVER_CLOSE_MS = 160;
const PANEL_ID = "mega-products";

type HeaderProps = {
  logo: ReactNode;
  families: NavFamily[];
  feature: NavFeature;
};

export function Header({ logo, families, feature }: HeaderProps) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > SOLID_AFTER_PX);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!panelOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setPanelOpen(false);
      triggerRef.current?.focus();
    };
    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setPanelOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [panelOpen]);

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  function scheduleHover(open: boolean, event: PointerEvent) {
    if (event.pointerType !== "mouse") return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setPanelOpen(open), open ? HOVER_OPEN_MS : HOVER_CLOSE_MS);
  }

  function closeOnFocusLeave(event: FocusEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPanelOpen(false);
  }

  const closePanel = () => setPanelOpen(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const solid = scrolled || panelOpen;

  return (
    <>
      <header
        ref={headerRef}
        data-site-header=""
        data-solid={solid}
        onPointerLeave={(event) => scheduleHover(false, event)}
        onBlur={closeOnFocusLeave}
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b border-transparent transition-[background-color,border-color] duration-300 ease-entrance",
          "data-[solid=true]:border-line data-[solid=true]:bg-surface/85 data-[solid=true]:backdrop-blur-md",
        )}
      >
        <div className="shell flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link href="/" aria-label={t("homeLink")} onClick={closePanel} className="inline-flex min-h-11 items-center">
            {logo}
          </Link>

          <nav aria-label={t("primary")} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              <li onPointerEnter={(event) => scheduleHover(true, event)}>
                <button
                  ref={triggerRef}
                  type="button"
                  aria-expanded={panelOpen}
                  aria-controls={PANEL_ID}
                  onClick={() => setPanelOpen((open) => !open)}
                  className={cn(navLinkClass, "gap-1.5")}
                  aria-current={isCurrent("/products") ? "page" : undefined}
                >
                  {t("products")}
                  <ChevronDown
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className={cn("size-4 transition-transform duration-300", panelOpen && "rotate-180")}
                  />
                </button>
              </li>
              {primaryNav.map((item) => (
                <li key={item.key} onPointerEnter={(event) => scheduleHover(false, event)}>
                  <Link
                    href={item.href}
                    onClick={closePanel}
                    aria-current={isCurrent(item.href) ? "page" : undefined}
                    className={navLinkClass}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <LanguageSwitch className="hidden lg:flex" />
            <Link href="/quote" onClick={closePanel} className={buttonClasses("lumen", "min-h-11 max-sm:hidden")}>
              {tc("requestQuote")}
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={t("openMenu")}
              onClick={() => setMenuOpen(true)}
              className="-me-2 inline-flex size-11 items-center justify-center rounded-control text-fg lg:hidden"
            >
              <Menu aria-hidden="true" strokeWidth={1.5} className="size-6" />
            </button>
          </div>
        </div>

        <MegaPanel id={PANEL_ID} open={panelOpen} families={families} feature={feature} onNavigate={closePanel} />
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={closeMenu}
        returnFocusTo={menuButtonRef}
        logo={logo}
        isCurrent={isCurrent}
      />
    </>
  );
}

const navLinkClass =
  "relative inline-flex min-h-11 items-center px-3 text-sm text-fg/80 transition-colors hover:text-fg aria-[current=page]:text-fg " +
  "after:absolute after:inset-x-3 after:bottom-2 after:h-px after:origin-left after:scale-x-0 after:bg-maroon after:transition-transform after:duration-300 rtl:after:origin-right " +
  "hover:after:scale-x-100 aria-[current=page]:after:scale-x-100 aria-[current=page]:after:bg-lumen";
