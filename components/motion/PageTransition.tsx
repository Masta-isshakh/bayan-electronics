"use client";

import { useEffect, useState, type ReactNode } from "react";
import { m } from "motion/react";
import { DURATION, EASE_ENTRANCE } from "@/lib/motion";

// The first page load is never animated (it would delay LCP and fight the hero intro);
// client-side navigations fade in with a short rise.
let hasNavigated = false;

export function PageTransition({ children }: { children: ReactNode }) {
  const [animate] = useState(() => hasNavigated);

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <m.div
      initial={animate ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.page, ease: EASE_ENTRANCE }}
      onAnimationComplete={() => window.dispatchEvent(new Event("page-transition-end"))}
    >
      {children}
    </m.div>
  );
}
