import type Lenis from "lenis";

// Holds the Lenis instance (desktop pointer devices only) so overlays can pause
// smooth scrolling. Null on touch devices and under reduced motion.
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

/** Locks page scrolling (overlay menus). Returns the unlock function. */
export function lockScroll(): () => void {
  const root = document.documentElement;
  const previous = root.style.overflow;
  root.style.overflow = "hidden";
  instance?.stop();
  return () => {
    root.style.overflow = previous;
    instance?.start();
  };
}

export function scrollToTop() {
  if (instance) instance.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}
