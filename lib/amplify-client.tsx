"use client";

// Amplify Gen 2 data client for the inquiry forms, following the starter's pattern:
// configure once on the client with the generated amplify_outputs.json (ssr: true).
// The form imports this module on demand, so aws-amplify never ships in first-load JS.
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";

export type InquiryInput = Schema["Inquiry"]["createType"];

type OutputsShape = { data?: { model_introspection?: { models?: Record<string, unknown> } } };

/**
 * False when amplify_outputs.json is the local stub or predates the Inquiry model
 * (e.g. the backend has not been redeployed yet) — the form then offers WhatsApp/email.
 */
export const inquiryBackendReady = Boolean((outputs as OutputsShape).data?.model_introspection?.models?.Inquiry);

export class BackendUnavailableError extends Error {
  constructor() {
    super("Inquiry backend is not configured");
    this.name = "BackendUnavailableError";
  }
}

let configured = false;

function configureOnce() {
  if (configured) return;
  Amplify.configure(outputs as Parameters<typeof Amplify.configure>[0], { ssr: true });
  configured = true;
}

export async function submitInquiry(input: InquiryInput): Promise<void> {
  if (!inquiryBackendReady) throw new BackendUnavailableError();
  configureOnce();
  const client = generateClient<Schema>();
  const { errors } = await client.models.Inquiry.create(input);
  if (errors?.length) throw new Error(errors.map((error) => error.message).join("; "));
}
