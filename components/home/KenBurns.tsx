"use client";

import dynamic from "next/dynamic";
import { useRef, type ReactNode } from "react";
import { useIdle } from "@/components/motion/useIdle";

const KenBurnsScroll = dynamic(() => import("./KenBurnsScroll"), { ssr: false });

/** Slow Ken Burns scrub (scale 1 → 1.08) on its child as the band scrolls through view. */
export function KenBurns({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const idle = useIdle();

  return (
    <div ref={root} className={className}>
      {children}
      {idle && <KenBurnsScroll target={root} />}
    </div>
  );
}
