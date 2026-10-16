"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { normalize } from "@/components/search/search-types";
import { cn } from "@/lib/cn";
import { ModelCard, type ModelCardData } from "./ModelCard";

export type BrowserEntry = ModelCardData & {
  path: string[];
  ipList: string[];
  cctList: number[];
  /** Normalised code, types (both languages) and category names. */
  search: string;
};

export type TreeNode = { slug: string; name: string; count: number; children: TreeNode[] };

export type BrowserLabels = {
  search: string;
  all: string;
  categories: string;
  ip: string;
  cct: string;
  results: string;
  clear: string;
  empty: string;
  variants: string;
};

type Filters = { category: string; q: string; ip: string[]; cct: number[] };
const EMPTY: Filters = { category: "", q: "", ip: [], cct: [] };

function readUrl(): Filters {
  const params = new URLSearchParams(window.location.search);
  return {
    category: params.get("category") ?? "",
    q: params.get("q") ?? "",
    ip: params.get("ip")?.split(",").filter(Boolean) ?? [],
    cct: params.get("cct")?.split(",").map(Number).filter(Boolean) ?? [],
  };
}

function writeUrl(filters: Filters) {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.q) params.set("q", filters.q);
  if (filters.ip.length) params.set("ip", filters.ip.join(","));
  if (filters.cct.length) params.set("cct", filters.cct.join(","));
  const query = params.toString();
  window.history.replaceState(window.history.state, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
}

const toggle = <T,>(list: T[], value: T) =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

const chipClass =
  "inline-flex min-h-10 items-center rounded-full border px-4 text-sm transition-colors tabular-nums aria-pressed:border-brand aria-pressed:bg-brand aria-pressed:text-day-surface border-rule-strong hover:border-fg/40";

/**
 * Catalogue browser: category tree, search and IP / CCT filters over every model. The
 * full grid is server-rendered (static page); filtering happens in the browser, and the
 * URL reflects it (?category=…&q=…&ip=…&cct=…) so a filtered view can be shared.
 */
export function CatalogueBrowser({
  entries,
  tree,
  ipOptions,
  cctOptions,
  labels,
}: {
  entries: BrowserEntry[];
  tree: TreeNode[];
  ipOptions: string[];
  cctOptions: number[];
  labels: BrowserLabels;
}) {
  const [filters, setFilters] = useState<Filters>(EMPTY);

  useEffect(() => setFilters(readUrl()), []);

  function update(next: Partial<Filters>) {
    setFilters((current) => {
      const merged = { ...current, ...next };
      writeUrl(merged);
      return merged;
    });
  }

  const results = useMemo(() => {
    const words = normalize(filters.q).split(" ").filter(Boolean);
    return entries.filter(
      (entry) =>
        (!filters.category || entry.path.includes(filters.category)) &&
        (!filters.ip.length || entry.ipList.some((ip) => filters.ip.includes(ip))) &&
        (!filters.cct.length || entry.cctList.some((cct) => filters.cct.includes(cct))) &&
        words.every((word) => entry.search.includes(word)),
    );
  }, [entries, filters]);

  const filtered = Boolean(filters.category || filters.q || filters.ip.length || filters.cct.length);
  const flat = tree.flatMap((top) => [top, ...top.children.flatMap((mid) => [mid, ...mid.children])]);

  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12">
      {/* Categories: a select on small screens, a tree from 1024px. */}
      <div className="lg:hidden">
        <label htmlFor="catalogue-category" className="text-sm font-medium">
          {labels.categories}
        </label>
        <select
          id="catalogue-category"
          value={filters.category}
          onChange={(event) => update({ category: event.target.value })}
          className="mt-2 h-12 w-full rounded-control border border-rule-strong bg-panel px-3"
        >
          <option value="">{labels.all}</option>
          {tree.map((top) => (
            <optgroup key={top.slug} label={top.name}>
              <option value={top.slug}>
                {top.name} ({top.count})
              </option>
              {top.children.flatMap((mid) => [
                <option key={mid.slug} value={mid.slug}>
                  {` ${mid.name} (${mid.count})`}
                </option>,
                ...mid.children.map((leaf) => (
                  <option key={leaf.slug} value={leaf.slug}>
                    {`  ${leaf.name} (${leaf.count})`}
                  </option>
                )),
              ])}
            </optgroup>
          ))}
        </select>
      </div>

      <nav aria-label={labels.categories} className="hidden lg:block">
        <div className="sticky top-[calc(var(--header-h)+1.5rem)] max-h-[calc(100vh-var(--header-h)-3rem)] overflow-y-auto pe-2">
          <button
            type="button"
            aria-pressed={!filters.category}
            onClick={() => update({ category: "" })}
            className="mb-4 text-start text-sm font-medium text-fg-muted aria-pressed:text-brand"
          >
            {labels.all} ({entries.length})
          </button>
          <ul className="space-y-6">
            {tree.map((top) => (
              <li key={top.slug}>
                <CategoryButton
                  node={top}
                  current={filters.category}
                  onSelect={(slug) => update({ category: slug })}
                  strong
                />
                <ul className="mt-2 space-y-1 border-s border-rule ps-3">
                  {top.children.map((mid) => (
                    <li key={mid.slug}>
                      <CategoryButton
                        node={mid}
                        current={filters.category}
                        onSelect={(slug) => update({ category: slug })}
                      />
                      {mid.children.length > 1 && (
                        <ul className="space-y-0.5 ps-3">
                          {mid.children.map((leaf) => (
                            <li key={leaf.slug}>
                              <CategoryButton
                                node={leaf}
                                current={filters.category}
                                onSelect={(slug) => update({ category: slug })}
                                small
                              />
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search
              aria-hidden="true"
              strokeWidth={1.5}
              className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-fg-muted"
            />
            <input
              type="search"
              value={filters.q}
              onChange={(event) => update({ q: event.target.value })}
              placeholder={labels.search}
              aria-label={labels.search}
              className="h-13 w-full rounded-control border border-rule-strong bg-panel ps-12 pe-4 text-base outline-offset-2"
            />
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <fieldset className="flex flex-wrap items-center gap-2">
              <legend className="sr-only">{labels.ip}</legend>
              <span aria-hidden="true" className="me-1 text-sm text-fg-muted">
                {labels.ip}
              </span>
              {ipOptions.map((ip) => (
                <button
                  key={ip}
                  type="button"
                  aria-pressed={filters.ip.includes(ip)}
                  onClick={() => update({ ip: toggle(filters.ip, ip) })}
                  className={chipClass}
                >
                  {ip}
                </button>
              ))}
            </fieldset>
            <fieldset className="flex flex-wrap items-center gap-2">
              <legend className="sr-only">{labels.cct}</legend>
              <span aria-hidden="true" className="me-1 text-sm text-fg-muted">
                {labels.cct}
              </span>
              {cctOptions.map((cct) => (
                <button
                  key={cct}
                  type="button"
                  aria-pressed={filters.cct.includes(cct)}
                  onClick={() => update({ cct: toggle(filters.cct, cct) })}
                  className={chipClass}
                  dir="ltr"
                >
                  {cct} K
                </button>
              ))}
            </fieldset>
          </div>
          <div className="flex min-h-11 items-center justify-between gap-4 border-b border-rule pb-3">
            <p role="status" className="text-sm text-fg-muted">
              {labels.results.replace("{count}", String(results.length))}
              {filters.category && ` · ${flat.find((node) => node.slug === filters.category)?.name ?? ""}`}
            </p>
            {filtered && (
              <button
                type="button"
                onClick={() => update(EMPTY)}
                className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium hover:text-brand"
              >
                <X aria-hidden="true" strokeWidth={1.5} className="size-4" />
                {labels.clear}
              </button>
            )}
          </div>
        </div>

        {results.length ? (
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {results.map((entry) => (
              <li key={entry.slug}>
                <ModelCard model={entry} variantsLabel={labels.variants} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-12 text-center text-fg-muted">{labels.empty}</p>
        )}
      </div>
    </div>
  );
}

function CategoryButton({
  node,
  current,
  onSelect,
  strong,
  small,
}: {
  node: TreeNode;
  current: string;
  onSelect: (slug: string) => void;
  strong?: boolean;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={current === node.slug}
      onClick={() => onSelect(node.slug)}
      className={cn(
        "flex w-full items-baseline justify-between gap-3 rounded-control py-1 text-start transition-colors hover:text-brand aria-pressed:text-brand",
        strong ? "font-semibold" : small ? "text-sm text-fg-muted" : "text-sm",
      )}
    >
      <span>{node.name}</span>
      <span className="text-xs text-fg-muted tabular-nums">{node.count}</span>
    </button>
  );
}
