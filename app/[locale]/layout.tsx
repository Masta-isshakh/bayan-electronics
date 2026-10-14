import "../globals.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { localeMeta } from "@/i18n/locales";
import { archivo, plexArabic } from "@/lib/fonts";
import { localeStaticParams, pickMessages, resolveLocale } from "@/lib/i18n";
import { site } from "@/content/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return localeStaticParams();
}

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
};

export const viewport: Viewport = {
  themeColor: "#070a12",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = await resolveLocale(params);
  const messages = await getMessages();
  const fontClasses = locale === "ar" ? `${archivo.variable} ${plexArabic.variable}` : archivo.variable;

  return (
    <html lang={locale} dir={localeMeta[locale].dir} className={fontClasses}>
      <body>
        <NextIntlClientProvider messages={pickMessages(messages, ["common", "nav", "a11y"])}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
