import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { InquirySection } from "@/components/forms/InquirySection";
import { AnchorButton } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { TextLink } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";
import { contactChannels, whatsappHref, type ContactChannel } from "@/lib/contact";
import { type LocaleParams, resolveLocale } from "@/lib/i18n";
import { confirmedOr } from "@/lib/placeholder";
import { pageMetadata } from "@/lib/seo";

const channelIcon: Record<ContactChannel["kind"], typeof Phone> = {
  whatsapp: MessageCircle,
  phone: Phone,
  email: Mail,
  address: MapPin,
};

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.contact" });
  return pageMetadata({ locale, path: "/contact", title: t("title"), description: t("description") });
}

export default async function ContactPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("contact");
  const tf = await getTranslations("footer");
  const tc = await getTranslations("common");
  const channels = contactChannels(locale, tc("whatsAppGreeting"));
  const whatsapp = whatsappHref(tc("whatsAppGreeting"));
  const hours = confirmedOr(site.contact.hours[locale]);
  const lat = confirmedOr(site.contact.map.lat);
  const lng = confirmedOr(site.contact.map.lng);

  return (
    <>
      <PageHeader
        locale={locale}
        title={t("title")}
        intro={t("intro")}
        crumbs={[{ label: t("title"), href: "/contact" }]}
      />

      <section aria-labelledby="details-title" className="shell grid gap-6 pb-20 lg:grid-cols-12 lg:pb-28">
        <div className="rounded-media border border-line bg-surface p-6 lg:col-span-5 lg:p-8">
          <h2 id="details-title" className="text-xl font-medium">
            {t("detailsTitle")}
          </h2>
          {channels.length > 0 ? (
            <ul className="mt-6 space-y-4">
              {channels.map((channel) => {
                const Icon = channelIcon[channel.kind];
                return (
                  <li key={channel.kind} className="flex gap-3">
                    <Icon aria-hidden="true" strokeWidth={1.5} className="mt-1 size-5 shrink-0 text-lumen" />
                    <div>
                      <p className="text-sm text-fg-muted">{tf(channel.kind)}</p>
                      {channel.href ? (
                        <a
                          href={channel.href}
                          dir={channel.kind === "address" ? undefined : "ltr"}
                          className="text-lg hover:text-lumen"
                        >
                          {channel.value}
                        </a>
                      ) : (
                        <p className="text-lg">{channel.value}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-4 text-base text-fg-muted">{tf("contactPending")}</p>
          )}
          {hours && (
            <p className="mt-6 flex gap-3 border-t border-line pt-6">
              <Clock aria-hidden="true" strokeWidth={1.5} className="mt-1 size-5 shrink-0 text-lumen" />
              <span>
                <span className="block text-sm text-fg-muted">{t("hours")}</span>
                <span className="text-base">{hours}</span>
              </span>
            </p>
          )}
        </div>

        {whatsapp && (
          <div className="flex flex-col justify-between gap-6 rounded-media border border-line bg-surface p-6 lg:col-span-4 lg:p-8">
            <div>
              <MessageCircle aria-hidden="true" strokeWidth={1.5} className="size-6 text-lumen" />
              <h2 className="mt-4 text-xl font-medium">{t("whatsappTitle")}</h2>
              <p className="mt-2 text-base text-fg-muted">{t("whatsappText")}</p>
            </div>
            <AnchorButton href={whatsapp} target="_blank" rel="noopener noreferrer">
              {tc("chatWhatsApp")}
            </AnchorButton>
          </div>
        )}

        {lat && lng && (
          <div className="overflow-hidden rounded-media border border-line lg:col-span-12">
            <h2 className="sr-only">{t("mapTitle")}</h2>
            <iframe
              title={t("mapTitle")}
              src={`https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=15&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[16/7] w-full border-0"
            />
          </div>
        )}
      </section>

      <section aria-labelledby="form-title" className="daylight section-y">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="form-title" className="display text-4xl">
              {t("formTitle")}
            </h2>
            <p className="mt-5 text-base text-fg-muted">{t("formIntro")}</p>
            <p className="mt-8 text-sm text-fg-muted">{t("quoteHint")}</p>
            <TextLink href="/quote">{t("quoteLink")}</TextLink>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <InquirySection locale={locale} variant="contact" />
          </div>
        </div>
      </section>
    </>
  );
}
