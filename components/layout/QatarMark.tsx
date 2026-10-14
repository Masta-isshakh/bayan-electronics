import { cn } from "@/lib/cn";

/** "Manufactured in Qatar" mark: the nine-point serration in Qatar maroon. */
export function QatarMark({ label, className }: { label: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-3 text-sm text-fg-muted", className)}>
      <svg viewBox="0 0 12 27" width="12" height="27" aria-hidden="true" className="shrink-0">
        <path
          fill="var(--color-maroon)"
          d="M12 0H4L0 1.5L4 3L0 4.5L4 6L0 7.5L4 9L0 10.5L4 12L0 13.5L4 15L0 16.5L4 18L0 19.5L4 21L0 22.5L4 24L0 25.5L4 27H12Z"
        />
      </svg>
      {label}
    </span>
  );
}
