"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const NEAR_VIEWPORT = "400px 0px";

/**
 * Images inside `[data-defer]` stay display:none (so the browser does not fetch them,
 * even when they sit within its generous lazy-load distance) until the container is
 * within 400px of the viewport. Keeps below-the-fold photography from competing with
 * the first paint. A <noscript> rule in the layout shows them when JavaScript is off.
 */
export function DeferredMediaObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-defer-ready", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: NEAR_VIEWPORT },
    );
    document.querySelectorAll("[data-defer]:not([data-defer-ready])").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
