"use client";

import { useEffect, useState } from "react";

const DEFAULT_TIMEOUT_MS = 2000;

/**
 * True once the browser is idle after mount (or after `timeoutMs` at the latest).
 * Used to load scroll choreography and decorative layers after the first paint,
 * so they never compete with the page's critical resources.
 */
export function useIdle(timeoutMs = DEFAULT_TIMEOUT_MS): boolean {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    const done = () => setIdle(true);
    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(done, { timeout: timeoutMs });
      return () => window.cancelIdleCallback(handle);
    }
    const handle = window.setTimeout(done, timeoutMs / 2);
    return () => window.clearTimeout(handle);
  }, [timeoutMs]);

  return idle;
}
