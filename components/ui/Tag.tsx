import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Sector tag: a small maroon chip (maroon is never used for large fills). */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-control bg-maroon px-2 py-0.5 text-sm text-text", className)}>
      {children}
    </span>
  );
}

/** Marks sample (placeholder) records so they are never mistaken for real work. */
export function SampleBadge({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-control border border-dashed border-lumen/60 px-2 py-0.5 text-sm text-lumen",
        className,
      )}
    >
      {label}
    </span>
  );
}

/** A spec value chip: label | value. Unconfirmed values show the "to be confirmed" text. */
export function SpecChip({ label, value, pending }: { label: string; value: string; pending: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-control border border-line-strong bg-void/70 px-2.5 py-1 text-sm">
      <span className="text-muted">{label}</span>
      <span aria-hidden="true" className="h-3.5 w-px bg-line-strong" />
      <span className={pending ? "text-muted italic" : "text-text"}>{value}</span>
    </span>
  );
}
