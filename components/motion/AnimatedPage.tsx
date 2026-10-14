"use client";

import type { ReactNode } from "react";
import { m } from "motion/react";
import { DURATION, EASE_ENTRANCE } from "@/lib/motion";
import { MotionScope } from "./MotionScope";

/** 300 ms fade + 12 px rise for client-side navigations (loaded lazily by PageTransition). */
export default function AnimatedPage({ children }: { children: ReactNode }) {
  return (
    <MotionScope>
      <m.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.page, ease: EASE_ENTRANCE }}
        onAnimationComplete={() => window.dispatchEvent(new Event("page-transition-end"))}
      >
        {children}
      </m.div>
    </MotionScope>
  );
}
