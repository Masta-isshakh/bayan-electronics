"use client";

import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motionQueries } from "@/lib/motion";

const PIN_LENGTH = "+=120%";
const FRAME_SCALE = 0.92;
const MEDIA_SHIFT_DESKTOP = -8;
const MEDIA_SHIFT_COMPACT = 10;
const CONTENT_RISE_PX = -40;
/** Content is gone before the next section reaches the headline. */
const CONTENT_FADE_SHARE = 0.3;
const SCRUB = 0.6;

/**
 * Hero scroll choreography (loaded lazily by Hero.tsx). Desktop pointer devices: pin
 * for 120vh while the frame shrinks into a lit, rounded panel and the next section
 * slides over it. Touch / narrow screens: a light parallax only. Renders nothing.
 */
export default function HeroScroll({ root }: { root: RefObject<HTMLElement | null> }) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(motionQueries.desktop, () => {
        const radius = getComputedStyle(document.documentElement).getPropertyValue("--radius-frame").trim();
        gsap
          .timeline({
            defaults: { ease: "none", duration: 1 },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: PIN_LENGTH,
              pin: true,
              pinSpacing: false,
              scrub: SCRUB,
            },
          })
          .to("[data-hero-frame]", { scale: FRAME_SCALE, borderRadius: radius }, 0)
          .to("[data-hero-media]", { yPercent: MEDIA_SHIFT_DESKTOP }, 0)
          .to("[data-hero-content]", { opacity: 0, y: CONTENT_RISE_PX, duration: CONTENT_FADE_SHARE }, 0)
          .to("[data-hero-edge]", { opacity: 1 }, 0);
      });

      mm.add(motionQueries.compact, () => {
        gsap.to("[data-hero-media]", {
          yPercent: MEDIA_SHIFT_COMPACT,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root },
  );

  return null;
}
