"use client";

import { Image } from "@/components/ui/Image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { ImageAsset } from "@/content/types";
import { cn } from "@/lib/cn";

export type StepItem = { id: string; title: string; text: string; image: ImageAsset; alt: string };

const DESKTOP = "(min-width: 1024px)";

/**
 * Six sequential steps beside a sticky intro. On desktop a sticky media panel
 * crossfades to the image of the step crossing the middle of the viewport
 * (IntersectionObserver — no scroll listeners). Phones show each image inline.
 * The panel's images are rendered client-side on desktop only, so the HTML carries
 * each step image once.
 */
export function ManufacturingSteps({ intro, steps }: { intro: ReactNode; steps: StepItem[] }) {
  const [active, setActive] = useState(0);
  const [desktop, setDesktop] = useState(false);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const query = window.matchMedia(DESKTOP);
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const items = list.current?.querySelectorAll<HTMLElement>("[data-step]");
    if (!items) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+2.5rem)]">
          {intro}
          <div className="relative mt-10 hidden aspect-[3/2] overflow-hidden rounded-media border border-rule bg-day-text lg:block">
            {desktop &&
              steps.map((step, index) => (
                <Image
                  key={step.id}
                  src={step.image.src}
                  alt={index === active ? step.alt : ""}
                  aria-hidden={index !== active}
                  fill
                  sizes="(min-width: 1440px) 560px, 40vw"
                  className={cn(
                    "object-cover transition-[opacity,scale] duration-700 ease-entrance",
                    index === active ? "scale-100 opacity-100" : "scale-[1.03] opacity-0",
                  )}
                />
              ))}
          </div>
        </div>
      </div>

      <ol ref={list} className="lg:col-span-6 lg:col-start-7">
        {steps.map((step, index) => (
          <li
            key={step.id}
            data-step={index}
            className="grid content-start gap-4 border-t border-rule py-10 first:border-t-0 first:pt-0 lg:min-h-[52vh] lg:py-14"
          >
            <span
              className={cn(
                "display text-5xl tabular-nums transition-colors duration-500",
                index === active ? "text-lumen-deep" : "text-fg-muted",
              )}
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-2xl font-medium">{step.title}</h3>
            <p className="measure text-lg text-fg-muted">{step.text}</p>
            <div className="relative mt-4 aspect-[3/2] overflow-hidden rounded-media border border-rule lg:hidden">
              <Image src={step.image.src} alt={step.alt} fill sizes="100vw" className="object-cover" />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
