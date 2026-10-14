"use client";

import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motionQueries } from "@/lib/motion";

const END_SCALE = 1.08;

/** Scales the target from 1 to 1.08 while its parent crosses the viewport (loaded lazily). */
export default function KenBurnsScroll({ target }: { target: RefObject<HTMLElement | null> }) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(motionQueries.motionOk, () => {
        gsap.fromTo(
          target.current,
          { scale: 1 },
          {
            scale: END_SCALE,
            ease: "none",
            scrollTrigger: {
              trigger: target.current?.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: target },
  );

  return null;
}
