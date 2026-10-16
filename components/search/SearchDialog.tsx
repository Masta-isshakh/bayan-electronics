"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { normalize, type SearchEntry, type SearchLabels } from "./search-types";

type Indexed = SearchEntry & { haystack: string; code: string };

const MAX_RESULTS = 12;
const kindOrder: SearchEntry["kind"][] = ["model", "family", "sector", "project", "page"];

let indexCache: Promise<Indexed[]> | null = null;

function loadIndex(locale: string): Promise<Indexed[]> {
  indexCache ??= fetch(`/${locale}/search-index.json`)
    .then((response) => (response.ok ? (response.json() as Promise<SearchEntry[]>) : []))
    .then((entries) =>
      entries.map((entry) => ({
        ...entry,
        code: entry.kind === "model" ? normalize(entry.title) : "",
        haystack: normalize(`${entry.title} ${entry.subtitle} ${entry.keywords}`),
      })),
    )
    .catch(() => {
      indexCache = null;
      return [];
    });
  return indexCache;
}

/** Ranks by: model code prefix, title prefix, every query word present. */
function rank(entries: Indexed[], query: string): Indexed[] {
  const q = normalize(query);
  if (!q) return [];
  const words = q.split(" ");
  const scored: { entry: Indexed; score: number }[] = [];
  for (const entry of entries) {
    if (!words.every((word) => entry.haystack.includes(word))) continue;
    const title = normalize(entry.title);
    let score = kindOrder.indexOf(entry.kind);
    if (entry.code && entry.code.startsWith(q.replace(/ /g, ""))) score -= 20;
    else if (title.startsWith(q)) score -= 10;
    else if (title.includes(q)) score -= 5;
    scored.push({ entry, score });
  }
  return scored
    .sort((a, b) => a.score - b.score)
    .slice(0, MAX_RESULTS)
    .map(({ entry }) => entry);
}

/**
 * Site search in a modal <dialog>: the index (a few kB, per locale) loads on first open.
 * Arrow keys move through results, Enter opens one, Esc closes.
 */
export default function SearchDialog({
  locale,
  labels,
  onClose,
}: {
  locale: string;
  labels: SearchLabels;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [entries, setEntries] = useState<Indexed[]>([]);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const results = useMemo(() => rank(entries, query), [entries, query]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    inputRef.current?.focus();
    void loadIndex(locale).then(setEntries);
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [locale, onClose]);

  useEffect(() => setActive(0), [query]);

  function go(entry: SearchEntry) {
    dialogRef.current?.close();
    router.push(entry.href as Parameters<typeof router.push>[0]);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!results.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => (index - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      go(results[active]);
    }
  }

  const listId = "site-search-results";

  return (
    <dialog
      ref={dialogRef}
      aria-label={labels.title}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
      className="fixed inset-x-0 top-0 m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 text-fg backdrop:bg-void/70 backdrop:backdrop-blur-sm sm:inset-x-auto sm:top-[10vh] sm:mx-auto sm:h-auto sm:w-[min(40rem,calc(100vw-2rem))]"
    >
      <div className="flex h-full flex-col overflow-hidden border-line-strong bg-surface shadow-2xl sm:h-auto sm:max-h-[75vh] sm:rounded-media sm:border">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search aria-hidden="true" strokeWidth={1.5} className="size-5 shrink-0 text-fg-muted" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder={labels.placeholder}
            aria-label={labels.placeholder}
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={listId}
            aria-activedescendant={results.length ? `${listId}-${active}` : undefined}
            autoComplete="off"
            spellCheck={false}
            className="h-16 min-w-0 flex-1 bg-transparent text-lg outline-none placeholder:text-fg-muted"
          />
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label={labels.close}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-control text-fg-muted hover:text-fg"
          >
            <X aria-hidden="true" strokeWidth={1.5} className="size-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {query && results.length === 0 && <p className="px-3 py-8 text-center text-fg-muted">{labels.empty}</p>}
          {!query && <p className="px-3 py-6 text-sm text-fg-muted">{labels.hint}</p>}
          {results.length > 0 && (
            <ul id={listId} role="listbox" aria-label={labels.title}>
              {results.map((entry, index) => (
                <li
                  key={`${entry.kind}:${entry.href}`}
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={index === active}
                  onPointerMove={() => setActive(index)}
                  onClick={() => go(entry)}
                  className="flex cursor-pointer items-center gap-4 rounded-control px-3 py-2.5 aria-selected:bg-surface-2"
                >
                  {entry.image ? (
                    // eslint-disable-next-line @next/next/no-img-element -- tiny pre-built variant, no layout shift (fixed box)
                    <img
                      src={entry.image}
                      alt=""
                      width={44}
                      height={44}
                      className="size-11 shrink-0 rounded-control bg-day-surface object-contain p-0.5"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="inline-flex size-11 shrink-0 items-center justify-center rounded-control border border-line text-xs text-fg-muted"
                    >
                      {labels.kinds[entry.kind].slice(0, 1)}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium" dir={entry.kind === "model" ? "ltr" : undefined}>
                      {entry.title}
                    </span>
                    <span className="block truncate text-sm text-fg-muted">
                      {labels.kinds[entry.kind]} · {entry.subtitle}
                    </span>
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="size-4 shrink-0 text-fg-muted rtl:-scale-x-100"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </dialog>
  );
}
