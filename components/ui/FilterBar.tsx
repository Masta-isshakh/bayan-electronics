"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

export type FilterOption = {
  value: string;
  label: string;
  /** Result count sentence for this option, e.g. "4 product families". */
  summary: string;
};

type FilterBarProps = {
  /** URL query parameter that keeps the selection, e.g. "category". */
  param: string;
  options: FilterOption[];
  label: string;
  /** id of the container whose `[data-categories]` children are filtered. */
  targetId: string;
};

const ALL = "all";

/**
 * Filter buttons with an animated lumen underline (transform only). Items stay
 * server-rendered; this toggles their `hidden` attribute and keeps the choice in the
 * URL (?param=value) without a navigation. Without JavaScript every item is shown.
 */
export function FilterBar({ param, options, label, targetId }: FilterBarProps) {
  const [active, setActive] = useState(ALL);
  const group = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get(param);
    if (fromUrl && options.some((option) => option.value === fromUrl)) setActive(fromUrl);
  }, [param, options]);

  useEffect(() => {
    document
      .getElementById(targetId)
      ?.querySelectorAll<HTMLElement>("[data-categories]")
      .forEach((item) => {
        item.hidden = active !== ALL && !(item.dataset.categories ?? "").split(" ").includes(active);
      });
  }, [active, targetId]);

  useLayoutEffect(() => {
    const button = group.current?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!button || !indicator.current) return;
    indicator.current.style.transform = `translateX(${button.offsetLeft}px) scaleX(${button.offsetWidth})`;
  }, [active]);

  function select(value: string) {
    setActive(value);
    const url = new URL(window.location.href);
    if (value === ALL) url.searchParams.delete(param);
    else url.searchParams.set(param, value);
    window.history.replaceState(null, "", url);
  }

  const summary = options.find((option) => option.value === active)?.summary;

  return (
    <div>
      <div
        ref={group}
        role="group"
        aria-label={label}
        className="relative flex gap-1 overflow-x-auto border-b border-rule [scrollbar-width:none]"
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={active === option.value}
            onClick={() => select(option.value)}
            className="min-h-11 shrink-0 px-4 text-sm whitespace-nowrap text-fg-muted transition-colors hover:text-fg aria-pressed:text-fg"
          >
            {option.label}
          </button>
        ))}
        <span
          ref={indicator}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-px origin-left bg-lumen transition-transform duration-500 ease-entrance"
        />
      </div>
      <p aria-live="polite" className="mt-4 text-sm text-fg-muted">
        {summary}
      </p>
    </div>
  );
}
