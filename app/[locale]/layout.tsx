import "../globals.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { Footer } from "@/components/layout/Footer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { site } from "@/content/site";
import { localeMeta } from "@/i18n/locales";
import { whatsappHref } from "@/lib/contact";
import { archivo, plexArabic } from "@/lib/fonts";
import { localeStaticParams, pickMessages, resolveLocale } from "@/lib/i18n";

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
  const t = await getTranslations("common");
  const ta = await getTranslations("a11y");
  const whatsapp = whatsappHref(t("whatsAppGreeting"));
  const fontClasses = locale === "ar" ? `${archivo.variable} ${plexArabic.variable}` : archivo.variable;

  return (
    <html lang={locale} dir={localeMeta[locale].dir} className={fontClasses}>
      <body>
        <NextIntlClientProvider messages={pickMessages(messages, ["common", "nav", "a11y"])}>
          <MotionProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-70 focus:rounded-control focus:bg-lumen focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:text-void"
            >
              {ta("skipToContent")}
            </a>
            <SiteHeader locale={locale} />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <Footer locale={locale} />
            {whatsapp && <WhatsAppFloat href={whatsapp} label={t("chatWhatsApp")} />}
          </MotionProvider>
        </NextIntlClientProvider>
        <SmoothScroll />
        <RevealObserver />
        {/* Analytics slot — add later with next/script, strategy="afterInteractive". No third-party scripts today. */}
      </body>
    </html>
  );
}
