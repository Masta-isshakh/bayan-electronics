"use client";

import type { ReactNode } from "react";
import { LazyMotion, MotionConfig, domAnimation } from "motion/react";

/**
 * LazyMotion + domAnimation for one lazily-loaded subtree (menus, page transitions).
 * Motion only ships inside those chunks, which load after the first paint, so it
 * never adds to first-load JavaScript. Respects prefers-reduced-motion.
 */
export function MotionScope({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
