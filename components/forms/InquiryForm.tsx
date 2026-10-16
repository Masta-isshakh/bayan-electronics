"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { AlertCircle, Check, Mail, MessageCircle } from "lucide-react";
import { Button, buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { InquiryInput } from "@/lib/amplify-client";
import { formatQuoteItems, quoteList, useQuoteList } from "@/lib/quote-list";
import { controlClass, FormField } from "./FormField";
import type { FormLabels } from "./labels";
import { QuoteListEditor } from "./QuoteListEditor";

export type FormVariant = "contact" | "quote" | "distributor";

export const roleKeys = ["contractor", "consultant", "developer", "distributor", "endUser", "other"] as const;
const NOT_SURE = "not-sure";
const RATE_LIMIT_MS = 30_000;
/** Amplify retries 5xx responses with backoff; stop waiting after this and offer alternatives. */
const SUBMIT_TIMEOUT_MS = 12_000;
const STORAGE_KEY = "albayan:last-inquiry";
const MIN_MESSAGE_LENGTH = 10;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;

type Values = {
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  role: string;
  productFamily: string;
  quantity: string;
  projectName: string;
  deliveryDate: string;
  message: string;
  /** Honeypot: hidden from people, filled in by bots. */
  website: string;
};
type FieldName = Exclude<keyof Values, "website">;
type Errors = Partial<Record<FieldName, string>>;
type Status = "idle" | "submitting" | "success" | "error" | "rate-limited" | "fallback";

const emptyValues: Values = {
  name: "",
  company: "",
  email: "",
  phone: "",
  country: "",
  role: "",
  productFamily: "",
  quantity: "",
  projectName: "",
  deliveryDate: "",
  message: "",
  website: "",
};

// Field order, used to focus the first invalid field.
const fieldOrder: FieldName[] = [
  "name",
  "company",
  "email",
  "phone",
  "country",
  "role",
  "productFamily",
  "quantity",
  "projectName",
  "deliveryDate",
  "message",
];

function validate(
  values: Values,
  variant: FormVariant,
  labels: FormLabels,
  today: string | undefined,
  quoteItems: number,
): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = labels.errors.nameRequired;
  if (!values.email.trim()) errors.email = labels.errors.emailRequired;
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = labels.errors.emailInvalid;
  if (values.phone.trim() && !PHONE_PATTERN.test(values.phone.trim())) errors.phone = labels.errors.phoneInvalid;
  if (variant !== "quote" && values.message.trim().length < MIN_MESSAGE_LENGTH)
    errors.message = labels.errors.messageRequired;
  if (variant === "distributor") {
    if (!values.company.trim()) errors.company = labels.errors.companyRequired;
    if (!values.country.trim()) errors.country = labels.errors.countryRequired;
  }
  if (variant === "quote") {
    if (!values.role) errors.role = labels.errors.roleRequired;
    // A quote list names the products; the family is then optional.
    if (!values.productFamily && quoteItems === 0) errors.productFamily = labels.errors.familyRequired;
    if (values.deliveryDate && today && values.deliveryDate < today) errors.deliveryDate = labels.errors.dateInvalid;
  }
  return errors;
}

function readLastSubmission(): number {
  try {
    return Number(window.sessionStorage.getItem(STORAGE_KEY) ?? 0);
  } catch {
    return 0;
  }
}

function rememberSubmission() {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    // Storage unavailable (private mode): the rate limit simply does not persist.
  }
}

type InquiryFormProps = {
  variant: FormVariant;
  locale: string;
  labels: FormLabels;
  families: { value: string; label: string }[];
  /** Direct channels for the fallback; null while unconfirmed. */
  whatsappNumber: string | null;
  email: string | null;
};

/**
 * Contact / quotation form posting to the Amplify `Inquiry` model. Visible labels,
 * inline validation (on blur and submit), a honeypot, one submission per 30 s per
 * session, and a WhatsApp / email fallback when the backend is not configured.
 */
export function InquiryForm({ variant, locale, labels, families, whatsappNumber, email }: InquiryFormProps) {
  const [values, setValues] = useState<Values>(emptyValues);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [today, setToday] = useState<string>();
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const isQuote = variant === "quote";
  const isDistributor = variant === "distributor";
  const listed = useQuoteList();
  const quoteItems = isQuote ? listed : [];

  // Client-only: today's date (static pages must not bake in the build date) and a
  // product family preselected from ?family=…
  useEffect(() => {
    setToday(new Date().toISOString().slice(0, 10));
    const family = new URLSearchParams(window.location.search).get("family");
    if (family && families.some((option) => option.value === family)) {
      setValues((current) => ({ ...current, productFamily: family }));
    }
  }, [families]);

  useEffect(() => {
    if (status !== "idle" && status !== "submitting") statusRef.current?.focus();
  }, [status]);

  function update(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const name = event.target.name as keyof Values;
    const next = { ...values, [name]: event.target.value };
    setValues(next);
    if (name !== "website" && errors[name]) {
      setErrors((current) => ({ ...current, [name]: validate(next, variant, labels, today, quoteItems.length)[name] }));
    }
  }

  function check(name: FieldName) {
    setErrors((current) => ({ ...current, [name]: validate(values, variant, labels, today, quoteItems.length)[name] }));
  }

  // Loads the Amplify client in the background once the visitor starts typing.
  function preloadClient() {
    void import("@/lib/amplify-client");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(values, variant, labels, today, quoteItems.length);
    setErrors(found);
    const firstInvalid = fieldOrder.find((name) => found[name]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    if (values.website) {
      // A bot filled the honeypot: show success, send nothing.
      setStatus("success");
      return;
    }
    if (Date.now() - readLastSubmission() < RATE_LIMIT_MS) {
      setStatus("rate-limited");
      return;
    }

    setStatus("submitting");
    const input: InquiryInput = {
      type: variant,
      locale,
      name: values.name.trim(),
      company: values.company.trim() || undefined,
      email: values.email.trim(),
      phone: values.phone.trim() || undefined,
      country: values.country.trim() || undefined,
      role: values.role || undefined,
      productFamily: values.productFamily || undefined,
      quantity: values.quantity.trim() || undefined,
      projectName: values.projectName.trim() || undefined,
      deliveryDate: values.deliveryDate || undefined,
      items: quoteItems.length ? formatQuoteItems(quoteItems) : undefined,
      message: values.message.trim() || undefined,
      page: window.location.pathname,
    };

    try {
      const { submitInquiry, BackendUnavailableError } = await import("@/lib/amplify-client");
      try {
        await Promise.race([
          submitInquiry(input),
          new Promise((_, reject) => window.setTimeout(() => reject(new Error("timeout")), SUBMIT_TIMEOUT_MS)),
        ]);
        rememberSubmission();
        if (isQuote) quoteList.clear();
        setStatus("success");
      } catch (error) {
        setStatus(error instanceof BackendUnavailableError ? "fallback" : "error");
      }
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    setValues(emptyValues);
    setErrors({});
    setStatus("idle");
  }

  const messageLabel = isQuote ? labels.messageQuote : isDistributor ? labels.messageDistributor : labels.message;

  // A readable summary of the form for the WhatsApp / email fallback.
  const familyLabel = families.find((option) => option.value === values.productFamily)?.label;
  const summary = [
    [labels.name, values.name],
    [labels.company, values.company],
    [labels.email, values.email],
    [labels.phone, values.phone],
    [labels.country, values.country],
    [labels.role, values.role ? labels.roles[values.role as (typeof roleKeys)[number]] : ""],
    [labels.productFamily, familyLabel ?? ""],
    [labels.quantity, values.quantity],
    [labels.projectName, values.projectName],
    [labels.deliveryDate, values.deliveryDate],
    [
      labels.quoteList.title,
      quoteItems.length
        ? `
${formatQuoteItems(quoteItems)}`
        : "",
    ],
    [messageLabel, values.message],
  ]
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(summary)}` : null;
  const mailHref = email
    ? `mailto:${email}?subject=${encodeURIComponent(isDistributor ? labels.mailSubjectDistributor : labels.mailSubject)}&body=${encodeURIComponent(summary)}`
    : null;
  const hasChannels = Boolean(whatsappHref || mailHref);

  if (status === "success") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="rounded-media border border-rule bg-panel p-8 outline-none"
      >
        <Check aria-hidden="true" strokeWidth={1.5} className="size-8 text-lumen-deep" />
        <h3 className="mt-4 text-2xl font-medium">{labels.success.title}</h3>
        <p className="mt-3 text-base text-fg-muted">{labels.success.text}</p>
        <Button variant="outline" className="mt-6" onClick={reset}>
          {labels.success.again}
        </Button>
      </div>
    );
  }

  const field = (name: FieldName) => ({
    id: `${variant}-${name}`,
    name,
    value: values[name],
    onChange: update,
    onBlur: () => check(name),
    "aria-invalid": errors[name] ? true : undefined,
  });

  return (
    <form ref={formRef} noValidate onSubmit={submit} onFocus={preloadClient} className="grid gap-6 sm:grid-cols-2">
      <FormField id={`${variant}-name`} label={labels.name} error={errors.name}>
        {(describedBy) => (
          <input
            {...field("name")}
            type="text"
            autoComplete="name"
            required
            aria-describedby={describedBy}
            className={controlClass}
          />
        )}
      </FormField>
      <FormField
        id={`${variant}-company`}
        label={labels.company}
        optionalLabel={isDistributor ? undefined : labels.optional}
        error={errors.company}
      >
        {(describedBy) => (
          <input
            {...field("company")}
            type="text"
            autoComplete="organization"
            required={isDistributor}
            aria-describedby={describedBy}
            className={controlClass}
          />
        )}
      </FormField>
      <FormField id={`${variant}-email`} label={labels.email} error={errors.email}>
        {(describedBy) => (
          <input
            {...field("email")}
            type="email"
            autoComplete="email"
            inputMode="email"
            dir="ltr"
            required
            aria-describedby={describedBy}
            className={controlClass}
          />
        )}
      </FormField>
      <FormField
        id={`${variant}-phone`}
        label={labels.phone}
        optionalLabel={labels.optional}
        hint={labels.phoneHint}
        error={errors.phone}
      >
        {(describedBy) => (
          <input
            {...field("phone")}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            dir="ltr"
            aria-describedby={describedBy}
            className={controlClass}
          />
        )}
      </FormField>

      {isDistributor && (
        <FormField id={`${variant}-country`} label={labels.country} error={errors.country} className="sm:col-span-2">
          {(describedBy) => (
            <input
              {...field("country")}
              type="text"
              autoComplete="country-name"
              required
              aria-describedby={describedBy}
              className={controlClass}
            />
          )}
        </FormField>
      )}

      {isQuote && <QuoteListEditor items={quoteItems} labels={labels.quoteList} />}

      {isQuote && (
        <>
          <fieldset
            className="sm:col-span-2"
            aria-invalid={errors.role ? true : undefined}
            aria-describedby={errors.role ? `${variant}-role-error` : undefined}
          >
            <legend className="text-sm font-medium text-fg">{labels.role}</legend>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {roleKeys.map((role) => (
                <label
                  key={role}
                  className={cn(
                    "flex min-h-12 cursor-pointer items-center gap-3 rounded-control border border-rule-strong bg-panel px-4 text-base transition-colors hover:border-fg/40",
                    "has-[:checked]:border-lumen-deep has-[:checked]:bg-lumen/10 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-focus",
                  )}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={values.role === role}
                    onChange={update}
                    className="size-4 accent-lumen-deep focus-visible:outline-none"
                  />
                  {labels.roles[role]}
                </label>
              ))}
            </div>
            {errors.role && (
              <p id={`${variant}-role-error`} className="mt-2 text-sm font-medium text-maroon">
                {errors.role}
              </p>
            )}
          </fieldset>

          <FormField id={`${variant}-productFamily`} label={labels.productFamily} error={errors.productFamily}>
            {(describedBy) => (
              <select {...field("productFamily")} required aria-describedby={describedBy} className={controlClass}>
                <option value="" disabled>
                  {labels.productFamilyPlaceholder}
                </option>
                {families.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
                <option value={NOT_SURE}>{labels.notSure}</option>
              </select>
            )}
          </FormField>
          <FormField
            id={`${variant}-quantity`}
            label={labels.quantity}
            optionalLabel={labels.optional}
            hint={labels.quantityHint}
            error={errors.quantity}
          >
            {(describedBy) => (
              <input {...field("quantity")} type="text" aria-describedby={describedBy} className={controlClass} />
            )}
          </FormField>
          <FormField
            id={`${variant}-projectName`}
            label={labels.projectName}
            optionalLabel={labels.optional}
            error={errors.projectName}
          >
            {(describedBy) => (
              <input {...field("projectName")} type="text" aria-describedby={describedBy} className={controlClass} />
            )}
          </FormField>
          <FormField
            id={`${variant}-deliveryDate`}
            label={labels.deliveryDate}
            optionalLabel={labels.optional}
            error={errors.deliveryDate}
          >
            {(describedBy) => (
              <input
                {...field("deliveryDate")}
                type="date"
                min={today}
                aria-describedby={describedBy}
                className={controlClass}
              />
            )}
          </FormField>
        </>
      )}

      <FormField
        id={`${variant}-message`}
        label={messageLabel}
        optionalLabel={isQuote ? labels.optional : undefined}
        error={errors.message}
        className="sm:col-span-2"
      >
        {(describedBy) => (
          <textarea
            {...field("message")}
            rows={6}
            required={!isQuote}
            aria-describedby={describedBy}
            className={cn(controlClass, "resize-y")}
          />
        )}
      </FormField>

      {/* Honeypot: visually hidden and skipped by keyboard and screen readers. */}
      <div aria-hidden="true" className="visually-hidden">
        <label htmlFor={`${variant}-website`}>{labels.honeypot}</label>
        <input
          id={`${variant}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={update}
        />
      </div>

      <div className="sm:col-span-2">
        {Object.values(errors).some(Boolean) && (
          <p role="alert" className="mb-4 flex items-center gap-2 text-sm font-medium text-maroon">
            <AlertCircle aria-hidden="true" strokeWidth={1.5} className="size-4" />
            {labels.errors.summary}
          </p>
        )}
        <Button
          type="submit"
          disabled={status === "submitting"}
          aria-disabled={status === "submitting"}
          className="w-full sm:w-auto"
        >
          {status === "submitting"
            ? labels.submitting
            : isQuote
              ? labels.submitQuote
              : isDistributor
                ? labels.submitDistributor
                : labels.submit}
        </Button>
      </div>

      {(status === "error" || status === "rate-limited" || status === "fallback") && (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className="rounded-media border border-maroon/40 bg-maroon/5 p-6 outline-none sm:col-span-2"
        >
          <p className="font-medium">
            {status === "fallback"
              ? labels.fallback.title
              : status === "rate-limited"
                ? labels.error.rateLimited
                : labels.error.title}
          </p>
          {status === "error" && <p className="mt-2 text-sm text-fg-muted">{labels.error.text}</p>}
          {status === "fallback" && (
            <p className="mt-2 text-sm text-fg-muted">{hasChannels ? labels.fallback.text : labels.fallback.none}</p>
          )}
          {(status === "error" || (status === "fallback" && hasChannels)) && (
            <div className="mt-4 flex flex-wrap gap-3">
              {status === "error" && (
                <Button type="submit" variant="outline">
                  {labels.error.retry}
                </Button>
              )}
              {whatsappHref && (
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={buttonClasses("outline")}>
                  <MessageCircle aria-hidden="true" strokeWidth={1.5} className="size-4" />
                  {labels.fallback.whatsapp}
                </a>
              )}
              {mailHref && (
                <a href={mailHref} className={buttonClasses("outline")}>
                  <Mail aria-hidden="true" strokeWidth={1.5} className="size-4" />
                  {labels.fallback.email}
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </form>
  );
}
