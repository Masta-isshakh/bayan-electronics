import { pending } from "@/lib/placeholder";
import { assets } from "./assets";
import type { ImageAsset, Localized, VideoSources } from "./types";

export type Stat = { id: string; value: string; label: Localized };
export type SocialLink = { id: string; label: string; href: string; confirm?: string };
export type Office = {
  id: string;
  country: Localized;
  role: Localized;
  company: Localized;
  address?: Localized;
  contactPerson?: Localized;
  phones: string[];
  email?: string;
  /** Set when the client still has to confirm the published details. */
  confirm?: string;
};
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
    /** Trading brand, as on the logo (B-LED Lighting Technologies). */
    trade: "B-LED",
    tradeFull: { en: "B-LED Lighting Technologies", ar: "B-LED لتقنيات الإضاءة" },
    name: {
      en: "Al Bayan Electronics & LED Technologies",
      ar: "البيان للإلكترونيات وتقنيات الـ LED",
    },
    legalName: {
      en: "Al Bayan Electronics & LED Technologies Factory",
      ar: "مصنع البيان للإلكترونيات وتقنيات الإضاءة LED",
      confirm: "Arabic legal name exactly as on the commercial registration",
    },
    short: { en: "Al Bayan", ar: "البيان" },
  },

  // Phone, email and address as published on the company's previous website (b-ledtec.com).
  contact: {
    phone: "+974 3348 8020",
    phoneAlt: "+974 7747 8254",
    whatsapp: pending(
      "WhatsApp business number, digits only with country code — +974 3348 8020 (main line) if it is on WhatsApp",
    ),
    email: "info@b-ledtec.com",
    address: {
      en: "81 New Industrial Area, Doha, Qatar",
      ar: "81، المنطقة الصناعية الجديدة، الدوحة، قطر",
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
    { id: "instagram", label: "Instagram", href: "https://www.instagram.com/albayanledtec" },
    {
      id: "facebook",
      label: "Facebook",
      href: "https://www.facebook.com/people/B-LED-Technologies",
      confirm: "Facebook page URL (the previous site links to /people/B-LED-Technologies without the page id)",
    },
    { id: "linkedin", label: "LinkedIn", href: pending("LinkedIn page URL") },
    { id: "youtube", label: "YouTube", href: pending("YouTube channel URL") },
  ] satisfies SocialLink[],

  /** Offices and distributors, as listed on the previous website's contact page. */
  offices: [
    {
      id: "doha",
      country: { en: "Qatar", ar: "قطر" },
      role: { en: "Head office & factory", ar: "المقر الرئيسي والمصنع" },
      company: { en: "Al Bayan Electronics & LED Technologies", ar: "البيان للإلكترونيات وتقنيات الـ LED" },
      address: { en: "81 New Industrial Area, Doha, Qatar", ar: "81، المنطقة الصناعية الجديدة، الدوحة، قطر" },
      phones: ["+974 3348 8020", "+974 7747 8254"],
      email: "info@b-ledtec.com",
    },
    {
      id: "kuwait",
      country: { en: "Kuwait", ar: "الكويت" },
      role: { en: "Distributor", ar: "الموزّع" },
      company: {
        en: "Arab Harvest General Trading & Contracting Co.",
        ar: "شركة أرب هارفيست العامة للتجارة والمقاولات",
      },
      address: {
        en: "Al-Fahaheel, Block 7, Street 65, Building 10, 5th floor, Offices 01–03, Kuwait",
        ar: "الكويت، الفحيحيل - القطاع (7) - الشارع (65)، المبنى 10 - الطابق الخامس، مكتب رقم 01، 02، 03",
      },
      contactPerson: { en: "Faisal Abdul Hadi Theeb Al Hajri", ar: "فيصل عبد الهادي ذيب الهاجري" },
      phones: ["+965 6613 3331", "+965 2392 8540"],
      email: "Arab_Harvest@hotmail.com",
      confirm: "Kuwait distributor details are current",
    },
    {
      id: "oman",
      country: { en: "Oman", ar: "عُمان" },
      role: { en: "Office", ar: "مكتب" },
      company: { en: "Al Bayan Electronics & LED Technologies", ar: "البيان للإلكترونيات وتقنيات الـ LED" },
      phones: ["+968 9339 6422"],
      email: "houssam@b-ledtec.com",
      confirm:
        "Oman office address and phone — the previous site shows the Doha address for Oman, and different numbers on its English and Arabic pages",
    },
  ] satisfies Office[],

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
};
