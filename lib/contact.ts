import { site } from "@/content/site";
import type { Locale } from "@/i18n/locales";
import { confirmedOr } from "./placeholder";

// Contact channels resolve to null while their values are still placeholders,
// so every consumer can simply skip what is not confirmed yet.

export function whatsappHref(message?: string): string | null {
  const number = confirmedOr(site.contact.whatsapp);
  if (!number) return null;
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${number.replace(/\D/g, "")}${query}`;
}

export function phoneHref(): string | null {
  const phone = confirmedOr(site.contact.phone);
  return phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : null;
}

export function emailHref(subject?: string, body?: string): string | null {
  const email = confirmedOr(site.contact.email);
  if (!email) return null;
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString().replaceAll("+", "%20");
  return `mailto:${email}${query ? `?${query}` : ""}`;
}

export type ContactChannel = {
  kind: "whatsapp" | "phone" | "email" | "address";
  value: string;
  href: string | null;
};

/** Confirmed contact channels in display order. Empty while all are placeholders. */
export function contactChannels(locale: Locale, whatsappMessage?: string): ContactChannel[] {
  const channels: ContactChannel[] = [];
  const whatsapp = whatsappHref(whatsappMessage);
  if (whatsapp) channels.push({ kind: "whatsapp", value: site.contact.whatsapp, href: whatsapp });
  const phone = phoneHref();
  if (phone) channels.push({ kind: "phone", value: site.contact.phone, href: phone });
  const email = emailHref();
  if (email) channels.push({ kind: "email", value: site.contact.email, href: email });
  const address = confirmedOr(site.contact.address[locale]);
  if (address) channels.push({ kind: "address", value: address, href: null });
  return channels;
}
