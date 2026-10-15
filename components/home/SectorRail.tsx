"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { ImageAsset } from "@/content/types";

export type RailCard = { slug: string; name: string; line: string; image: ImageAsset; alt: string };

type SectorRailProps = {
  cards: RailCard[];
  labels: { previous: string; next: string; progress: string };
};

/**
 * Native horizontal scroll with scroll-snap — no pinning, no hijacking. A thin lumen
 * bar shows position; previous/next buttons on desktop. Works in RTL, where
 * scrollLeft runs from 0 to a negative value.
 */
export function SectorRail({ cards, labels }: SectorRailProps) {
  const scroller = useRef<HTMLUListElement>(null);
  const [progress, setProgress] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [near, setNear] = useState(false);

  const measure = useCallback(() => {
    const element = scroller.current;
    if (!element) return;
    const max = element.scrollWidth - element.clientWidth;
    const position = Math.abs(element.scrollLeft);
    setProgress(max > 0 ? position / max : 1);
    setEdges({ start: position <= 1, end: position >= max - 1 });
  }, []);

  // Cards off to the side would only load once swiped to. When the rail nears the
  // viewport, load them all so swiping never reveals an empty card.
  useEffect(() => {
    const element = scroller.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      { rootMargin: "800px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  function step(direction: 1 | -1) {
    const element = scroller.current;
    if (!element) return;
    const card = element.querySelector("li");
    const distance = (card?.getBoundingClientRect().width ?? element.clientWidth) + 16;
    const rtl = getComputedStyle(element).direction === "rtl";
    element.scrollBy({ left: distance * direction * (rtl ? -1 : 1), behavior: "smooth" });
  }

  return (
    <div>
      <ul
        ref={scroller}
        onScroll={measure}
        className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] md:-mx-12 md:scroll-px-12 md:px-12 [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card) => (
          <li key={card.slug} className="w-[78%] shrink-0 snap-start sm:w-[44%] lg:w-[30%]">
            <Link href={`/solutions/${card.slug}`} className="group block">
              <span className="relative block aspect-[4/3] overflow-hidden rounded-media border border-line bg-surface">
                <Image
                  src={card.image.src}
                  alt={card.alt}
                  fill
                  loading={near ? "eager" : "lazy"}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 44vw, 78vw"
                  className="object-cover transition-[scale,filter] duration-700 ease-entrance group-hover:scale-[1.03] group-hover:brightness-110"
                />
              </span>
              <span className="mt-4 block text-lg font-medium text-fg">{card.name}</span>
              <span className="mt-1 block text-sm text-fg-muted">{card.line}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center gap-6">
        <div
          role="progressbar"
          aria-label={labels.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          className="h-px flex-1 bg-line-strong"
        >
          <span
            className="block h-full origin-left bg-lumen transition-transform duration-150 rtl:origin-right"
            style={{ transform: `scaleX(${Math.max(progress, 0.04)})` }}
          />
        </div>
        <div className="hidden gap-2 lg:flex">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={edges.start}
            aria-label={labels.previous}
            className="inline-flex size-11 items-center justify-center rounded-full border border-line-strong text-fg transition-colors hover:border-lumen disabled:opacity-35 disabled:hover:border-line-strong"
          >
            <ChevronLeft aria-hidden="true" strokeWidth={1.5} className="size-5 rtl:-scale-x-100" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={edges.end}
            aria-label={labels.next}
            className="inline-flex size-11 items-center justify-center rounded-full border border-line-strong text-fg transition-colors hover:border-lumen disabled:opacity-35 disabled:hover:border-line-strong"
          >
            <ChevronRight aria-hidden="true" strokeWidth={1.5} className="size-5 rtl:-scale-x-100" />
          </button>
        </div>
      </div>
    </div>
  );
}
