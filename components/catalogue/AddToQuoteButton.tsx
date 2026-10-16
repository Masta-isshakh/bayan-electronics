"use client";

import { Check, Plus } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { quoteList, useQuoteList } from "@/lib/quote-list";

export type AddToQuoteLabels = { add: string; added: string };

/** Adds a model (or one variant) to the quote list; shows the added state. */
export function AddToQuoteButton({
  code,
  sku,
  label,
  labels,
  compact,
  className,
}: {
  code: string;
  sku?: string;
  label: string;
  labels: AddToQuoteLabels;
  compact?: boolean;
  className?: string;
}) {
  const items = useQuoteList();
  const added = items.some((item) => item.code === code && (item.sku ?? "") === (sku ?? ""));
  const Icon = added ? Check : Plus;

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => (added ? quoteList.remove({ code, sku }) : quoteList.add({ code, sku, label }))}
        aria-pressed={added}
        aria-label={`${added ? labels.added : labels.add}: ${sku ?? code}`}
        className={cn(
          "inline-flex size-10 items-center justify-center rounded-control border border-rule-strong text-fg transition-colors hover:border-brand hover:text-brand aria-pressed:border-brand aria-pressed:bg-brand aria-pressed:text-day-surface",
          className,
        )}
      >
        <Icon aria-hidden="true" strokeWidth={1.75} className="size-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => (added ? quoteList.remove({ code, sku }) : quoteList.add({ code, sku, label }))}
      aria-pressed={added}
      className={buttonClasses(added ? "outline" : "lumen", cn("gap-2", className))}
    >
      <Icon aria-hidden="true" strokeWidth={1.75} className="size-4" />
      {added ? labels.added : labels.add}
    </button>
  );
}
