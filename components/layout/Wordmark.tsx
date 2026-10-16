import Image from "next/image";
import { assets } from "@/content/assets";
import { cn } from "@/lib/cn";

/** The 2×2 LED matrix mark, in --lumen. */
export function LumenMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true" className={cn("text-lumen", className)}>
      <g fill="currentColor">
        <circle cx="3.5" cy="3.5" r="2.5" />
        <circle cx="10.5" cy="3.5" r="2.5" />
        <circle cx="3.5" cy="10.5" r="2.5" />
        <circle cx="10.5" cy="10.5" r="2.5" opacity="0.55" />
      </g>
    </svg>
  );
}

/**
 * Brand lockup: the B-LED logo (public/media/brand/logo-white.svg, a vector rebuild of the
 * client's logo) on dark backgrounds; a typographic wordmark while no logo file exists.
 * Its alt text starts the surrounding link's accessible name.
 */
export function Wordmark({ className }: { className?: string }) {
  const logo = assets.brand.logoWhite;

  if (logo.available) {
    return (
      <Image
        src={logo.src}
        alt="B-LED"
        width={133}
        height={40}
        unoptimized
        priority
        className={cn("h-9 w-auto lg:h-10", className)}
      />
    );
  }

  return (
    <span dir="ltr" className={cn("inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap text-fg", className)}>
      <LumenMark className="drop-shadow-[0_0_6px_rgb(255_194_71/0.55)]" />
      <span lang="en" className="text-lg leading-none font-bold tracking-[0.08em] [font-stretch:125%]">
        AL BAYAN
      </span>
    </span>
  );
}
