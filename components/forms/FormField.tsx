import type { ReactNode } from "react";

export const controlClass =
  "block w-full min-h-12 rounded-control border border-rule-strong bg-panel px-4 py-3 text-base text-fg " +
  "transition-colors placeholder:text-fg-muted/70 hover:border-fg/40 " +
  "aria-[invalid=true]:border-maroon aria-[invalid=true]:bg-maroon/5";

type FormFieldProps = {
  id: string;
  label: string;
  /** Text shown after the label for optional fields, e.g. "optional". */
  optionalLabel?: string;
  hint?: string;
  error?: string;
  className?: string;
  /** Receives the ids the control must reference in aria-describedby. */
  children: (describedBy: string | undefined) => ReactNode;
};

/**
 * Label + control + hint + inline error. Errors are announced via aria-describedby.
 * Forms sit in daylight sections, where maroon error text has ample contrast.
 */
export function FormField({ id, label, optionalLabel, hint, error, className, children }: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-fg">
        {label}
        {optionalLabel && <span className="ms-1.5 font-normal text-fg-muted">({optionalLabel})</span>}
      </label>
      <div className="mt-2">{children(describedBy)}</div>
      {hint && (
        <p id={hintId} className="mt-2 text-sm text-fg-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-2 text-sm font-medium text-maroon">
          {error}
        </p>
      )}
    </div>
  );
}
