import { products } from "@/content/products";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/locales";
import { confirmedOr } from "@/lib/placeholder";
import { InquiryForm, type FormVariant } from "./InquiryForm";
import { getFormLabels } from "./labels";

/** Server wrapper: resolves labels, product options and confirmed fallback channels for the form. */
export async function InquirySection({ locale, variant }: { locale: Locale; variant: FormVariant }) {
  const labels = await getFormLabels();
  const whatsapp = confirmedOr(site.contact.whatsapp);
  const families = products.map((family) => ({ value: family.slug, label: family.name[locale] }));

  return (
    <InquiryForm
      variant={variant}
      locale={locale}
      labels={labels}
      families={variant === "quote" ? families : []}
      whatsappNumber={whatsapp ? whatsapp.replace(/\D/g, "") : null}
      email={confirmedOr(site.contact.email)}
    />
  );
}
