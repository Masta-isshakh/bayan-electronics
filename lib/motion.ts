// Motion tokens for JS-driven animation (mirrors --ease-entrance in globals.css).
export const EASE_ENTRANCE = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  /** Page transition. */
  page: 0.3,
  /** Menus, panels, small UI. */
  ui: 0.45,
  /** Larger reveals. */
  reveal: 0.7,
} as const;

export const STAGGER = {
  words: 0.06,
  items: 0.05,
} as const;

/** Media queries shared by every scroll choreography (used with gsap.matchMedia). */
export const motionQueries = {
  /** Pinned, scrubbed choreography and smooth scrolling: desktop pointer devices only. */
  desktop: "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
  /** Lighter scrubs for touch devices and narrow screens. */
  compact: "(max-width: 1023px) and (prefers-reduced-motion: no-preference), (hover: none) and (prefers-reduced-motion: no-preference)",
  motionOk: "(prefers-reduced-motion: no-preference)",
} as const;

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
