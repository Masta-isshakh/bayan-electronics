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
 * Brand lockup. Uses the real logo once public/media/brand/logo-white.svg is supplied;
 * until then a typographic "AL BAYAN" wordmark in Archivo expanded. Its text (or the
 * logo's alt) starts the surrounding link's accessible name.
 */
export function Wordmark({ className }: { className?: string }) {
  const logo = assets.brand.logoWhite;

  if (logo.available) {
    return (
      <Image
        src={logo.src}
        alt="AL BAYAN"
        width={160}
        height={28}
        unoptimized
        priority
        className={cn("h-7 w-auto", className)}
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
