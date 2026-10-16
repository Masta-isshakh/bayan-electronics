import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { catalogueStats } from "@/content/catalogue";
import { products } from "@/content/products";
import { sectors } from "@/content/solutions";
import { site } from "@/content/site";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/locales";
import { contactChannels, type ContactChannel } from "@/lib/contact";
import { isPlaceholder } from "@/lib/placeholder";
import { getLanguageLabels } from "./labels";
import { LanguageSwitch } from "./LanguageSwitch";
import { QatarMark } from "./QatarMark";
import { Wordmark } from "./Wordmark";

const channelIcon: Record<ContactChannel["kind"], typeof Phone> = {
  whatsapp: MessageCircle,
  phone: Phone,
  email: Mail,
  address: MapPin,
};

const linkClass =
  "inline-flex min-h-11 items-center text-sm text-fg-muted transition-colors hover:text-fg lg:min-h-0 lg:py-1";

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");
  const tc = await getTranslations("common");
  const tcn = await getTranslations("company.nav");
  const channels = contactChannels(locale, tc("whatsAppGreeting"));
  const social = site.social.filter((link) => !isPlaceholder(link.href));
  const year = new Date().getFullYear();
  const languageLabels = await getLanguageLabels();

  return (
    <footer className="border-t border-line bg-void">
      <div className="shell pt-16 pb-8 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-4">
            <Link href="/" className="inline-flex min-h-11 items-center">
              <Wordmark />
              <span className="sr-only"> {tn("homeLink")}</span>
            </Link>
            <p className="max-w-sm text-sm text-fg-muted">{t("statement")}</p>
            <QatarMark label={tc("madeInQatar")} />
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
            <FooterColumn title={t("products")}>
              {products.map((family) => (
                <li key={family.slug}>
                  <Link href={`/products/${family.slug}`} className={linkClass}>
                    {family.name[locale]}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/catalogue" className={`${linkClass} text-lumen hover:text-lumen`}>
                  {tn("catalogueLink", { count: catalogueStats.models })}
                </Link>
              </li>
            </FooterColumn>

            <FooterColumn title={t("solutions")}>
              {sectors.map((sector) => (
                <li key={sector.slug}>
                  <Link href={`/solutions/${sector.slug}`} className={linkClass}>
                    {sector.name[locale]}
                  </Link>
                </li>
              ))}
            </FooterColumn>

            <FooterColumn title={t("company")}>
              {(
                [
                  ["/about", tcn("about")],
                  ["/about/ceo-message", tcn("ceo")],
                  ["/about/organization", tcn("organization")],
                  ["/manufacturing", tn("manufacturing")],
                  ["/projects", tn("projects")],
                  ["/distributors", tcn("distributor")],
                  ["/contact", tn("contact")],
                ] as const
              ).map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className={linkClass}>
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/quote" className={`${linkClass} text-lumen hover:text-lumen`}>
                  {tc("requestQuote")}
                </Link>
              </li>
            </FooterColumn>

            <div>
              <h2 className="text-sm font-medium text-fg">{t("contact")}</h2>
              {channels.length > 0 ? (
                <ul className="mt-4 space-y-3">
                  {channels.map((channel) => {
                    const Icon = channelIcon[channel.kind];
                    const content = (
                      <>
                        <Icon aria-hidden="true" strokeWidth={1.5} className="mt-0.5 size-4 shrink-0 text-lumen" />
                        <span>
                          <span className="sr-only">{t(channel.kind)}: </span>
                          <span dir={channel.kind === "address" ? undefined : "ltr"}>{channel.value}</span>
                        </span>
                      </>
                    );
                    return (
                      <li key={channel.kind}>
                        {channel.href ? (
                          <a href={channel.href} className={`${linkClass} gap-3 lg:items-start`}>
                            {content}
                          </a>
                        ) : (
                          <p className="flex gap-3 text-sm text-fg-muted">{content}</p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="mt-4 space-y-3">
                  <p className="text-sm text-fg-muted">{t("contactPending")}</p>
                  <Link
                    href="/contact"
                    className="inline-flex min-h-11 items-center text-sm text-lumen hover:underline"
                  >
                    {tc("contactUs")}
                  </Link>
                </div>
              )}

              {social.length > 0 && (
                <>
                  <h2 className="mt-8 text-sm font-medium text-fg">{t("social")}</h2>
                  <ul className="mt-3 flex flex-wrap gap-x-5">
                    {social.map((link) => (
                      <li key={link.id}>
                        <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-6 text-sm text-fg-muted md:flex-row md:items-center md:justify-between">
          <p>{t("copyright", { year, legalName: site.brand.legalName[locale] })}</p>
          <div className="flex flex-wrap items-center gap-x-6">
            <nav aria-label={t("company")} className="flex gap-6">
              <Link href="/privacy" className={linkClass}>
                {t("privacy")}
              </Link>
              <Link href="/terms" className={linkClass}>
                {t("terms")}
              </Link>
            </nav>
            <LanguageSwitch labels={languageLabels} />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-medium text-fg">{title}</h2>
      <ul className="mt-4 space-y-0.5">{children}</ul>
    </div>
  );
}
