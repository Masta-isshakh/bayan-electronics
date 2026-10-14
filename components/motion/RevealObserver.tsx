"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Reveals `[data-reveal]` elements once, when they first scroll into view.
 * Server components only add the attribute; elements already on screen (or seen
 * with JavaScript off, or under reduced motion) are never hidden.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-reveal-state", "in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    for (const element of document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-reveal-state])")) {
      if (element.getBoundingClientRect().top < window.innerHeight) continue;
      element.setAttribute("data-reveal-state", "pending");
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
