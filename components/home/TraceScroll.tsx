"use client";

import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motionQueries } from "@/lib/motion";

const PIN_LENGTH = "+=160%";
const SCRUB = 0.6;
const NODE_LIGHT_DURATION = 0.35;

/**
 * Traceability scroll choreography (loaded lazily). Desktop pointer devices only:
 * pins the chain, draws the line with stroke-dashoffset, lights each node and
 * reveals its caption as the line reaches it. Renders nothing.
 */
export default function TraceScroll({ root, steps }: { root: RefObject<HTMLElement | null>; steps: number }) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(motionQueries.desktop, () => {
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: PIN_LENGTH, pin: true, scrub: SCRUB },
        });
        timeline.fromTo("[data-trace-path]", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: steps }, 0);
        const start = (index: number) => Math.max(0, index - NODE_LIGHT_DURATION / 2);
        gsap.utils.toArray<HTMLElement>("[data-trace-node]", root.current).forEach((node, index) => {
          timeline.fromTo(node, { "--lit": 0 }, { "--lit": 1, duration: NODE_LIGHT_DURATION }, start(index));
        });
        gsap.utils.toArray<HTMLElement>("[data-trace-caption]", root.current).forEach((caption, index) => {
          timeline.fromTo(
            caption,
            { opacity: 0.2, y: 10 },
            { opacity: 1, y: 0, duration: NODE_LIGHT_DURATION * 2 },
            start(index),
          );
        });
      });
    },
    { scope: root, dependencies: [steps] },
  );

  return null;
}
