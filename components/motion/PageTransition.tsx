"use client";

import { useEffect, useState, type ComponentType, type ReactNode } from "react";

type Wrapper = ComponentType<{ children: ReactNode }>;

// The animated wrapper (motion) is fetched once the browser is idle and kept here, so
// later navigations can render it synchronously — no Suspense fallback, no flash.
let AnimatedPage: Wrapper | null = null;
let hasNavigated = false;

function preloadAnimatedPage() {
  if (AnimatedPage) return;
  void import("./AnimatedPage").then((mod) => {
    AnimatedPage = mod.default;
  });
}

/**
 * Page transition for app/[locale]/template.tsx. The first page load is never
 * animated (it would delay LCP and fight the hero intro); client-side navigations
 * fade in with a 12 px rise once motion has loaded.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const [Wrapper] = useState<Wrapper | null>(() => (hasNavigated ? AnimatedPage : null));

  useEffect(() => {
    hasNavigated = true;
    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(preloadAnimatedPage);
      return () => window.cancelIdleCallback(handle);
    }
    preloadAnimatedPage();
  }, []);

  return Wrapper ? <Wrapper>{children}</Wrapper> : <div>{children}</div>;
}
