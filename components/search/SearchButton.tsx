"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useLocale } from "next-intl";
import type { SearchLabels } from "./search-types";

// The dialog and its index load on first use only.
const SearchDialog = dynamic(() => import("./SearchDialog"), { ssr: false });

/** Header search trigger; also opens on "/" or Ctrl/⌘ + K outside text fields. */
export function SearchButton({ labels }: { labels: SearchLabels }) {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    function onKey(event: globalThis.KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing = target?.closest("input, textarea, select, [contenteditable=true]");
      if ((event.key === "k" && (event.metaKey || event.ctrlKey)) || (event.key === "/" && !typing)) {
        event.preventDefault();
        setOpen(true);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={labels.open}
        aria-haspopup="dialog"
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-control text-fg transition-colors hover:text-lumen"
      >
        <Search aria-hidden="true" strokeWidth={1.5} className="size-5" />
      </button>
      {open && <SearchDialog locale={locale} labels={labels} onClose={close} />}
    </>
  );
}
