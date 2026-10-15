"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const NEAR_VIEWPORT = "1200px 0px";
const IDLE_TIMEOUT_MS = 300;

/**
 * Images inside `[data-defer]` stay display:none (so the browser does not fetch them,
 * even when they sit within its generous lazy-load distance) until the page has finished
 * loading — keeping below-the-fold photography out of the first paint — or, if the visitor
 * scrolls first, until the container is within 1200px of the viewport. They are then
 * already loaded by the time they scroll into view. A <noscript> rule in the layout shows
 * them when JavaScript is off.
 */
export function DeferredMediaObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const pending = () => document.querySelectorAll("[data-defer]:not([data-defer-ready])");
    const release = (element: Element) => element.setAttribute("data-defer-ready", "");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          release(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: NEAR_VIEWPORT },
    );
    pending().forEach((element) => observer.observe(element));

    let idleHandle: number | undefined;
    const releaseAll = () => {
      idleHandle = undefined;
      pending().forEach(release);
      observer.disconnect();
    };
    const schedule = () => {
      idleHandle =
        typeof window.requestIdleCallback === "function"
          ? window.requestIdleCallback(releaseAll, { timeout: IDLE_TIMEOUT_MS })
          : window.setTimeout(releaseAll, IDLE_TIMEOUT_MS);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      window.removeEventListener("load", schedule);
      if (idleHandle !== undefined) {
        if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idleHandle);
        window.clearTimeout(idleHandle);
      }
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
