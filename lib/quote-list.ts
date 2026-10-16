"use client";

import { useSyncExternalStore } from "react";

// The quote list: catalogue models a visitor collects before requesting a quotation —
// the B2B replacement for the previous website's cart and wishlist. Kept in localStorage
// (per browser, survives reloads), synced across tabs, sent with the quotation form.

export type QuoteItem = {
  /** Model code, e.g. "HB82". */
  code: string;
  /** Optional variant, e.g. "HB82-IN1-840-05-150". */
  sku?: string;
  /** Human-readable label in the visitor's language at the time it was added. */
  label: string;
  qty: number;
};

const STORAGE_KEY = "bled:quote-list:v1";
const CHANGE_EVENT = "bled:quote-list";
const MAX_ITEMS = 60;
const MAX_QTY = 99_999;
const EMPTY: QuoteItem[] = [];

let cache: QuoteItem[] | null = null;

function read(): QuoteItem[] {
  if (cache) return cache;
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    cache = Array.isArray(parsed)
      ? parsed
          .filter((item): item is QuoteItem => typeof item?.code === "string" && typeof item?.label === "string")
          .map((item) => ({ ...item, qty: clampQty(item.qty) }))
          .slice(0, MAX_ITEMS)
      : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(items: QuoteItem[]) {
  cache = items;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage unavailable (private mode, quota): the list lives for this page only.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function clampQty(value: unknown): number {
  const qty = Math.round(Number(value));
  return Number.isFinite(qty) ? Math.min(Math.max(qty, 1), MAX_QTY) : 1;
}

const key = (item: Pick<QuoteItem, "code" | "sku">) => `${item.code}|${item.sku ?? ""}`;

export const quoteList = {
  add(item: Omit<QuoteItem, "qty"> & { qty?: number }) {
    const items = read();
    const existing = items.find((entry) => key(entry) === key(item));
    if (existing) {
      write(
        items.map((entry) => (entry === existing ? { ...entry, qty: clampQty(entry.qty + (item.qty ?? 1)) } : entry)),
      );
    } else if (items.length < MAX_ITEMS) {
      write([...items, { ...item, qty: clampQty(item.qty ?? 1) }]);
    }
  },
  setQty(item: Pick<QuoteItem, "code" | "sku">, qty: number) {
    write(read().map((entry) => (key(entry) === key(item) ? { ...entry, qty: clampQty(qty) } : entry)));
  },
  remove(item: Pick<QuoteItem, "code" | "sku">) {
    write(read().filter((entry) => key(entry) !== key(item)));
  },
  clear() {
    write(EMPTY);
  },
  has(item: Pick<QuoteItem, "code" | "sku">) {
    return read().some((entry) => key(entry) === key(item));
  },
};

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    cache = null;
    onChange();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/** The current quote list; empty during server rendering and hydration. */
export function useQuoteList(): QuoteItem[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

/** One line per item for the inquiry record and the WhatsApp / email fallback. */
export function formatQuoteItems(items: QuoteItem[]): string {
  return items.map((item) => `${item.sku ?? item.code} — ${item.label} × ${item.qty}`).join("\n");
}
