// Placeholder convention: any unconfirmed value is the string "[[CONFIRM: what is needed]]".
// Components hide or badge such values; scripts/content-todo.mjs lists them.
const MARKER = "[[CONFIRM";

/** Builds an unconfirmed value, e.g. pending("phone number") → "[[CONFIRM: phone number]]". */
export function pending(what: string): string {
  return `${MARKER}: ${what}]]`;
}

export function isPlaceholder(value: unknown): boolean {
  return typeof value === "string" && value.includes(MARKER);
}

/** The value when confirmed, otherwise null — for fields that should simply disappear. */
export function confirmedOr<T extends string>(value: T): T | null {
  return isPlaceholder(value) ? null : value;
}
