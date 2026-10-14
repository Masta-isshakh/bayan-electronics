"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { usePathname } from "@/i18n/navigation";

const SHOW_AFTER_VIEWPORTS = 0.6;

/**
 * Floating WhatsApp button (bottom-end). Appears once the hero has left the viewport —
 * or, on pages without a hero, after a short scroll. Only rendered when a WhatsApp
 * number is confirmed in content/site.ts.
 */
export function WhatsAppFloat({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (hero) {
      const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting));
      observer.observe(hero);
      return () => observer.disconnect();
    }
    const update = () => setVisible(window.scrollY > window.innerHeight * SHOW_AFTER_VIEWPORTS);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [pathname]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      aria-hidden={!visible}
      tabIndex={visible ? undefined : -1}
      data-visible={visible}
      className="fixed end-5 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-40 inline-flex size-14 items-center justify-center rounded-full bg-lumen text-void shadow-[0_0_32px_rgb(255_194_71/0.35)] transition-[opacity,transform] duration-500 ease-entrance data-[visible=false]:pointer-events-none data-[visible=false]:translate-y-4 data-[visible=false]:opacity-0"
    >
      <MessageCircle aria-hidden="true" strokeWidth={1.5} className="size-6" />
    </a>
  );
}
