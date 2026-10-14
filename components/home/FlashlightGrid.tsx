"use client";

import { useEffect, useRef, type ComponentProps, type MouseEvent, type PointerEvent } from "react";

const TILE = "[data-flashlight]";

/**
 * Event delegation for the product tiles (which stay server-rendered):
 *  • mouse — a flashlight follows the cursor via --mx/--my, updated once per frame;
 *  • touch — the first tap lights a tile (spec chips appear), the second tap navigates.
 */
export function FlashlightGrid({ children, ...props }: ComponentProps<"div">) {
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const pointerType = useRef("mouse");

  useEffect(() => {
    const clearOutside = (event: globalThis.PointerEvent) => {
      if (root.current?.contains(event.target as Node)) return;
      root.current?.querySelectorAll<HTMLElement>(`${TILE}[data-lit]`).forEach((tile) => delete tile.dataset.lit);
    };
    document.addEventListener("pointerdown", clearOutside);
    return () => {
      document.removeEventListener("pointerdown", clearOutside);
      cancelAnimationFrame(frame.current);
    };
  }, []);

  function track(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const tile = (event.target as Element).closest<HTMLElement>(TILE);
    if (!tile) return;
    const { clientX, clientY } = event;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const box = tile.getBoundingClientRect();
      tile.style.setProperty("--mx", `${clientX - box.left}px`);
      tile.style.setProperty("--my", `${clientY - box.top}px`);
    });
  }

  // Capture phase: runs before the tile link's own click handler, so preventing
  // the default here stops navigation on the first tap.
  function firstTapReveals(event: MouseEvent<HTMLDivElement>) {
    if (pointerType.current === "mouse") return;
    const tile = (event.target as Element).closest<HTMLElement>(TILE);
    if (!tile || tile.dataset.lit !== undefined) return;
    event.preventDefault();
    root.current?.querySelectorAll<HTMLElement>(`${TILE}[data-lit]`).forEach((other) => delete other.dataset.lit);
    tile.style.removeProperty("--mx");
    tile.style.removeProperty("--my");
    tile.dataset.lit = "";
  }

  return (
    <div
      {...props}
      ref={root}
      onPointerMove={track}
      onPointerDown={(event) => {
        pointerType.current = event.pointerType;
      }}
      onClickCapture={firstTapReveals}
    >
      {children}
    </div>
  );
}
