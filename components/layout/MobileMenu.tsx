"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { AnimatePresence, m, type Variants } from "motion/react";
import { X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buttonClasses } from "@/components/ui/Button";
import { MotionScope } from "@/components/motion/MotionScope";
import { lockScroll } from "@/lib/smooth-scroll";
import { DURATION, EASE_ENTRANCE, STAGGER } from "@/lib/motion";
import { LanguageSwitch } from "./LanguageSwitch";
import { primaryNav, type NavLabels } from "./nav";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const list: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: STAGGER.items, delayChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  shown: { opacity: 1, y: 0, transition: { duration: DURATION.ui, ease: EASE_ENTRANCE } },
};

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  returnFocusTo: RefObject<HTMLButtonElement | null>;
  logo: ReactNode;
  isCurrent: (href: string) => boolean;
  labels: NavLabels;
};

/** Full-screen overlay menu below 1024px. Focus is trapped while open; Escape closes. Loaded lazily. */
export default function MobileMenu({ open, onClose, returnFocusTo, logo, isCurrent, labels }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const unlock = lockScroll();
    const returnTarget = returnFocusTo.current;
    dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      unlock();
      returnTarget?.focus();
    };
  }, [open, onClose, returnFocusTo]);

  const links = [{ key: "products", href: "/products" }, ...primaryNav, { key: "contact", href: "/contact" }] as const;

  return (
    <MotionScope>
      <AnimatePresence>
        {open && (
          <m.div
            ref={dialogRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={labels.menu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.page, ease: EASE_ENTRANCE }}
            className="fixed inset-0 z-60 flex flex-col bg-void lg:hidden"
          >
            <div className="shell flex h-[var(--header-h)] shrink-0 items-center justify-between">
              <Link href="/" onClick={onClose} className="inline-flex min-h-11 items-center">
                {logo}
                <span className="sr-only"> {labels.homeLink}</span>
              </Link>
              <button
                type="button"
                onClick={onClose}
                aria-label={labels.closeMenu}
                className="-me-2 inline-flex size-11 items-center justify-center rounded-control text-fg"
              >
                <X aria-hidden="true" strokeWidth={1.5} className="size-6" />
              </button>
            </div>

            <nav aria-label={labels.primary} className="shell flex-1 overflow-y-auto py-8">
              <m.ul variants={list} initial="hidden" animate="shown" className="space-y-1">
                {links.map((link) => (
                  <m.li key={link.key} variants={item}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      aria-current={isCurrent(link.href) ? "page" : undefined}
                      className="display block py-2 text-4xl text-fg/85 transition-colors hover:text-fg aria-[current=page]:text-lumen"
                    >
                      {labels[link.key]}
                    </Link>
                  </m.li>
                ))}
              </m.ul>
            </nav>

            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.ui, ease: EASE_ENTRANCE, delay: 0.3 }}
              className="shell flex shrink-0 flex-wrap items-center justify-between gap-4 border-t border-line py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
            >
              <LanguageSwitch labels={labels.language} />
              <Link href="/quote" onClick={onClose} className={buttonClasses("lumen")}>
                {labels.requestQuote}
              </Link>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </MotionScope>
  );
}
