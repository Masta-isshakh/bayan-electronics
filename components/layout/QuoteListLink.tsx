"use client";

import { ClipboardList } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useQuoteList } from "@/lib/quote-list";

/** Header shortcut to the quotation form; shown once the quote list has items. */
export function QuoteListLink({ label, onClick }: { label: string; onClick?: () => void }) {
  const count = useQuoteList().length;
  if (count === 0) return null;

  return (
    <Link
      href="/quote"
      onClick={onClick}
      aria-label={`${label} (${count})`}
      className="relative inline-flex size-11 shrink-0 items-center justify-center rounded-control text-fg transition-colors hover:text-lumen"
    >
      <ClipboardList aria-hidden="true" strokeWidth={1.5} className="size-6" />
      <span
        aria-hidden="true"
        className="absolute -end-0.5 top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-lumen px-1 text-xs font-semibold text-void tabular-nums"
      >
        {count}
      </span>
    </Link>
  );
}
