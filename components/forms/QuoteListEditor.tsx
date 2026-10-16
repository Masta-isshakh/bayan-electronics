"use client";

import { Minus, Plus, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { quoteList, type QuoteItem } from "@/lib/quote-list";
import type { FormLabels } from "./labels";

const stepClass =
  "inline-flex size-11 items-center justify-center rounded-control border border-rule-strong bg-panel text-fg transition-colors hover:border-fg/40 disabled:opacity-40";

/** The models collected in the quote list, with quantities, inside the quotation form. */
export function QuoteListEditor({ items, labels }: { items: QuoteItem[]; labels: FormLabels["quoteList"] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-media border border-dashed border-rule-strong p-5 text-sm text-fg-muted sm:col-span-2">
        {labels.empty}{" "}
        <Link href="/catalogue" className="font-medium text-fg underline underline-offset-4 hover:decoration-lumen">
          {labels.browse}
        </Link>
      </div>
    );
  }

  return (
    <fieldset className="sm:col-span-2">
      <legend className="text-sm font-medium text-fg">
        {labels.title} ({items.length})
      </legend>
      <ul className="mt-3 divide-y divide-rule rounded-media border border-rule bg-panel">
        {items.map((item) => {
          const id = `quote-qty-${item.sku ?? item.code}`;
          return (
            <li key={`${item.code}|${item.sku ?? ""}`} className="flex flex-wrap items-center gap-3 p-3 sm:flex-nowrap">
              <div className="min-w-0 flex-1">
                <p className="font-medium" dir="ltr">
                  {item.sku ?? item.code}
                </p>
                <p className="truncate text-sm text-fg-muted">{item.label}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className={stepClass}
                  aria-label={labels.decrease}
                  disabled={item.qty <= 1}
                  onClick={() => quoteList.setQty(item, item.qty - 1)}
                >
                  <Minus aria-hidden="true" strokeWidth={1.5} className="size-4" />
                </button>
                <label htmlFor={id} className="sr-only">
                  {labels.quantity}
                </label>
                <input
                  id={id}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={item.qty}
                  onChange={(event) => quoteList.setQty(item, Number(event.target.value))}
                  className="h-11 w-20 rounded-control border border-rule-strong bg-panel text-center tabular-nums"
                />
                <button
                  type="button"
                  className={stepClass}
                  aria-label={labels.increase}
                  onClick={() => quoteList.setQty(item, item.qty + 1)}
                >
                  <Plus aria-hidden="true" strokeWidth={1.5} className="size-4" />
                </button>
                <button
                  type="button"
                  className="ms-1 inline-flex size-11 items-center justify-center rounded-control text-fg-muted hover:text-fg"
                  aria-label={`${labels.remove}: ${item.sku ?? item.code}`}
                  onClick={() => quoteList.remove(item)}
                >
                  <X aria-hidden="true" strokeWidth={1.5} className="size-4" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-sm text-fg-muted">
        <Link href="/catalogue" className="underline underline-offset-4 hover:decoration-lumen">
          {labels.addMore}
        </Link>
      </p>
    </fieldset>
  );
}
