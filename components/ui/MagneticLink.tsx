"use client";

import { useRef, type ComponentProps, type PointerEvent } from "react";
import { Link } from "@/i18n/navigation";
import { motionQueries } from "@/lib/motion";

const MAX_SHIFT_PX = 6;

/** A link that leans up to ±6px toward a mouse pointer (fine pointers, motion allowed). */
export function MagneticLink(props: ComponentProps<typeof Link>) {
  const ref = useRef<HTMLAnchorElement>(null);

  function follow(event: PointerEvent<HTMLAnchorElement>) {
    const element = ref.current;
    if (!element || event.pointerType !== "mouse" || !window.matchMedia(motionQueries.motionOk).matches) return;
    const box = element.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width - 0.5) * 2 * MAX_SHIFT_PX;
    const y = ((event.clientY - box.top) / box.height - 0.5) * 2 * MAX_SHIFT_PX;
    element.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
  }

  function release() {
    if (ref.current) ref.current.style.translate = "";
  }

  return <Link {...props} ref={ref} onPointerMove={follow} onPointerLeave={release} />;
}
