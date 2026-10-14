import { getTranslations } from "next-intl/server";
import { whatsappHref } from "@/lib/contact";
import { AnchorButton, ButtonLink } from "./Button";

type CtaBandProps = {
  title: string;
  text: string;
  /** Pre-selects a product family on the quotation form. */
  family?: string;
};

/** Closing call to action for inner pages: quotation + WhatsApp (or contact while unconfirmed). */
export async function CtaBand({ title, text, family }: CtaBandProps) {
  const tc = await getTranslations("common");
  const whatsapp = whatsappHref(tc("whatsAppGreeting"));
  const quoteHref = family ? { pathname: "/quote", query: { family } } : "/quote";

  return (
    <section className="cv-auto border-t border-line">
      <div className="shell grid gap-8 py-20 lg:grid-cols-12 lg:items-end lg:py-28">
        <div className="lg:col-span-7">
          <h2 className="display text-4xl">{title}</h2>
          <p className="measure mt-5 text-lg text-fg-muted">{text}</p>
        </div>
        <div className="grid gap-3 sm:flex sm:flex-wrap lg:col-span-5 lg:justify-end">
          <ButtonLink href={quoteHref}>{tc("requestQuote")}</ButtonLink>
          {whatsapp ? (
            <AnchorButton href={whatsapp} target="_blank" rel="noopener noreferrer" variant="outline">
              {tc("chatWhatsApp")}
            </AnchorButton>
          ) : (
            <ButtonLink href="/contact" variant="outline">
              {tc("contactUs")}
            </ButtonLink>
          )}
        </div>
      </div>
    </section>
  );
}
