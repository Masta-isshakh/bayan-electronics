import { pending } from "@/lib/placeholder";
import { assets } from "./assets";
import type { ImageAsset, Localized, VideoSources } from "./types";

export type Stat = { id: string; value: string; label: Localized };
export type SocialLink = { id: string; label: string; href: string };
export type Certification = { id: string; name: string; issuer: Localized; document: string };
export type TeamMember = { id: string; name: Localized; role: Localized; photo: ImageAsset };
export type Milestone = { id: string; year: string; text: Localized };

const heroVideo = {
  desktop: assets.hero.video.desktop,
  mobile: assets.hero.video.mobile,
} as VideoSources | null;

export const site = {
  /** Canonical origin. Set NEXT_PUBLIC_SITE_URL in Amplify once the domain is confirmed. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://albayan.example").replace(/\/$/, ""),

  brand: {
    name: {
      en: "Al Bayan Electronics & LED Technologies",
      ar: "البيان للإلكترونيات وتقنيات الإضاءة LED",
      confirm: "Arabic brand name spelling",
    },
    legalName: {
      en: "Al Bayan Electronics & LED Technologies Factory",
      ar: "مصنع البيان للإلكترونيات وتقنيات الإضاءة LED",
      confirm: "Arabic legal name exactly as on the commercial registration",
    },
    short: { en: "Al Bayan", ar: "البيان", confirm: "Arabic short name" },
  },

  contact: {
    phone: pending("main phone number in international format, e.g. +974 4000 0000"),
    whatsapp: pending("WhatsApp business number, digits only with country code, e.g. 97450000000"),
    email: pending("inquiry email address"),
    address: {
      en: pending("street address (English)"),
      ar: pending("street address (Arabic)"),
    },
    poBox: pending("P.O. box"),
    hours: {
      en: pending("working hours (English)"),
      ar: pending("working hours (Arabic)"),
    },
    map: {
      lat: pending("factory map latitude, e.g. 25.2854"),
      lng: pending("factory map longitude, e.g. 51.5310"),
    },
    commercialRegistration: pending("commercial registration (CR) number"),
  },

  foundingYear: pending("founding year"),

  hero: {
    /** Set to null to force the CSS light-field hero even when video files exist. */
    video: heroVideo,
  },

  /** Rendered only when every value is confirmed — never show invented numbers. */
  stats: [
    {
      id: "years",
      value: pending("years manufacturing in Qatar"),
      label: { en: "Years manufacturing in Qatar", ar: "سنوات من التصنيع في قطر" },
    },
    {
      id: "capacity",
      value: pending("monthly production capacity (fixtures)"),
      label: { en: "Fixtures produced per month", ar: "وحدة إنارة تُنتَج شهرياً" },
    },
    { id: "projects", value: pending("projects delivered"), label: { en: "Projects delivered", ar: "مشروعاً منجزاً" } },
    { id: "families", value: pending("number of product lines"), label: { en: "Product lines", ar: "خط منتجات" } },
  ] satisfies Stat[],

  social: [
    { id: "linkedin", label: "LinkedIn", href: pending("LinkedIn page URL") },
    { id: "instagram", label: "Instagram", href: pending("Instagram profile URL") },
    { id: "x", label: "X", href: pending("X profile URL") },
    { id: "youtube", label: "YouTube", href: pending("YouTube channel URL") },
  ] satisfies SocialLink[],

  /** Slots — hidden on the site until confirmed. */
  certifications: [
    {
      id: "certification-1",
      name: pending("certification name, e.g. ISO 9001:2015"),
      issuer: { en: pending("issuing body (English)"), ar: pending("issuing body (Arabic)") },
      document: pending("certificate PDF, place in public/media/certificates/"),
    },
  ] satisfies Certification[],

  team: [
    {
      id: "team-1",
      name: { en: pending("team member name (English)"), ar: pending("team member name (Arabic)") },
      role: { en: pending("role (English)"), ar: pending("role (Arabic)") },
      photo: assets.about.team,
    },
  ] satisfies TeamMember[],

  timeline: [
    {
      id: "milestone-1",
      year: pending("milestone year"),
      text: { en: pending("milestone (English)"), ar: pending("milestone (Arabic)") },
    },
  ] satisfies Milestone[],

  /** About-page story paragraphs, to be written with the client. */
  story: [
    {
      en: pending("company story, paragraph 1 — origins and why the factory was set up"),
      ar: pending("company story, paragraph 1 (Arabic)"),
    },
    {
      en: pending("company story, paragraph 2 — today: capacity, people, customers"),
      ar: pending("company story, paragraph 2 (Arabic)"),
    },
  ] satisfies Localized[],
};
