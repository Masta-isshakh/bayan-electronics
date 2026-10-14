import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/locales";

export type LocaleParams = { params: Promise<{ locale: string }> };

/** Validates the [locale] segment and enables static rendering for the request. */
export async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return locale;
}

export function localeStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** Picks a subset of a messages object for a client provider. */
export function pickMessages<M extends Record<string, unknown>, K extends keyof M>(messages: M, keys: readonly K[]) {
  return Object.fromEntries(keys.map((key) => [key, messages[key]])) as Pick<M, K>;
}
