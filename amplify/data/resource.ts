import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/**
 * Inquiry submissions from the contact, quotation and distributor forms.
 * Public visitors may only create records (API key); reading them requires
 * console/IAM access. Email notification on new inquiries is not set up yet —
 * see CONTENT-TODO.md.
 */
const schema = a.schema({
  Inquiry: a
    .model({
      type: a.enum(["contact", "quote", "distributor"]),
      locale: a.string(),
      name: a.string().required(),
      company: a.string(),
      email: a.string().required(),
      phone: a.string(),
      country: a.string(),
      role: a.string(),
      productFamily: a.string(),
      quantity: a.string(),
      projectName: a.string(),
      deliveryDate: a.string(),
      /** Quote list: one catalogue model per line, e.g. "HB82 (150 W, 4000 K) × 20". */
      items: a.string(),
      message: a.string(),
      page: a.string(),
      status: a.string().default("new"),
    })
    .authorization((allow) => [allow.publicApiKey().to(["create"])]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 365,
    },
  },
});
