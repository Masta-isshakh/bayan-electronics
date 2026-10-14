"use client";

// Single registration point for GSAP. Import gsap, ScrollTrigger and useGSAP from
// here only, so plugins are registered once and never on the server.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const REFRESH_DEBOUNCE_MS = 200;

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.defaults({ ease: "power2.out" });
  ScrollTrigger.config({ ignoreMobileResize: true });

  // Recalculate trigger positions once web fonts have changed text metrics…
  void document.fonts?.ready.then(() => ScrollTrigger.refresh());

  // …and whenever the document height changes for reasons ScrollTrigger cannot see
  // (content-visibility sections rendering, late images, page transitions).
  let measuredHeight = 0;
  let timer: number | undefined;
  ScrollTrigger.addEventListener("refresh", () => {
    measuredHeight = document.documentElement.scrollHeight;
  });
  new ResizeObserver(() => {
    if (Math.abs(document.documentElement.scrollHeight - measuredHeight) < 2) return;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => ScrollTrigger.refresh(), REFRESH_DEBOUNCE_MS);
  }).observe(document.body);
  window.addEventListener("page-transition-end", () => ScrollTrigger.refresh());
}

export { gsap, ScrollTrigger, useGSAP };
