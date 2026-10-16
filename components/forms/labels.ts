import { getTranslations } from "next-intl/server";

/** All strings the inquiry form needs, resolved on the server (no client message runtime). */
export async function getFormLabels() {
  const t = await getTranslations("form");
  return {
    optional: t("optional"),
    name: t("name"),
    company: t("company"),
    email: t("email"),
    phone: t("phone"),
    phoneHint: t("phoneHint"),
    country: t("country"),
    role: t("role"),
    roles: {
      contractor: t("roles.contractor"),
      consultant: t("roles.consultant"),
      developer: t("roles.developer"),
      distributor: t("roles.distributor"),
      endUser: t("roles.endUser"),
      other: t("roles.other"),
    },
    productFamily: t("productFamily"),
    productFamilyPlaceholder: t("productFamilyPlaceholder"),
    notSure: t("notSure"),
    quantity: t("quantity"),
    quantityHint: t("quantityHint"),
    projectName: t("projectName"),
    deliveryDate: t("deliveryDate"),
    message: t("message"),
    messageQuote: t("messageQuoteLabel"),
    messageDistributor: t("messageDistributor"),
    honeypot: t("honeypot"),
    submit: t("submit"),
    submitQuote: t("submitQuote"),
    submitDistributor: t("submitDistributor"),
    submitting: t("submitting"),
    errors: {
      summary: t("errors.summary"),
      nameRequired: t("errors.nameRequired"),
      companyRequired: t("errors.companyRequired"),
      countryRequired: t("errors.countryRequired"),
      emailRequired: t("errors.emailRequired"),
      emailInvalid: t("errors.emailInvalid"),
      phoneInvalid: t("errors.phoneInvalid"),
      roleRequired: t("errors.roleRequired"),
      familyRequired: t("errors.familyRequired"),
      messageRequired: t("errors.messageRequired"),
      dateInvalid: t("errors.dateInvalid"),
    },
    success: { title: t("success.title"), text: t("success.text"), again: t("success.again") },
    error: {
      title: t("error.title"),
      text: t("error.text"),
      retry: t("error.retry"),
      rateLimited: t("error.rateLimited"),
    },
    fallback: {
      title: t("fallback.title"),
      text: t("fallback.text"),
      none: t("fallback.none"),
      email: t("fallback.email"),
      whatsapp: t("fallback.whatsapp"),
    },
    mailSubject: t("mailSubject"),
    mailSubjectDistributor: t("mailSubjectDistributor"),
  };
}

export type FormLabels = Awaited<ReturnType<typeof getFormLabels>>;
