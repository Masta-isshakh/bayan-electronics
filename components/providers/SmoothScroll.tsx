"use client";

import { useEffect } from "react";
import { motionQueries } from "@/lib/motion";
import { setLenis } from "@/lib/smooth-scroll";

/**
 * Lenis smooth scrolling on desktop pointer devices only. Touch devices keep native
 * scrolling (no hijacking), and reduced motion disables it. Lenis is loaded after
 * hydration so it never adds to first-load JavaScript, and is driven by the GSAP
 * ticker so ScrollTrigger and Lenis share one frame loop.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (!window.matchMedia(motionQueries.desktop).matches) return;

    let cancelled = false;
    let teardown = () => {};

    void (async () => {
      const [{ default: Lenis }, { gsap, ScrollTrigger }] = await Promise.all([import("lenis"), import("@/lib/gsap")]);
      if (cancelled) return;

      const lenis = new Lenis({ autoRaf: false, syncTouch: false, anchors: true });
      const tick = (time: number) => lenis.raf(time * 1000);
      // Stop any in-flight easing before a navigation, so Lenis cannot pull the next
      // page back toward the previous page's scroll target.
      const settle = () => {
        lenis.stop();
        lenis.start();
      };
      lenis.on("scroll", ScrollTrigger.update);
      document.addEventListener("click", settle, true);
      window.addEventListener("popstate", settle);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(lenis);
      ScrollTrigger.refresh();

      teardown = () => {
        document.removeEventListener("click", settle, true);
        window.removeEventListener("popstate", settle);
        gsap.ticker.remove(tick);
        lenis.destroy();
        setLenis(null);
      };
    })();

    return () => {
      cancelled = true;
      teardown();
    };
  }, []);

  return null;
}
