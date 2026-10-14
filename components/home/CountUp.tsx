"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

const DURATION_MS = 1400;

/** Counts the leading number of `value` up from zero once, when first in view ("120+" → 0…120+). */
export function CountUp({ value }: { value: string }) {
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    const match = value.match(/^(\D*)([\d,.]+)(.*)$/);
    if (!match || !element || prefersReducedMotion()) return;
    const [, prefix, digits, suffix] = match;
    const target = Number(digits.replaceAll(",", ""));
    let frame = 0;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION_MS);
        const eased = 1 - (1 - t) ** 3;
        setDisplay(`${prefix}${Math.round(target * eased).toLocaleString("en")}${suffix}`);
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} dir="ltr">
      {display}
    </span>
  );
}
