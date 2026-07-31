import type { PaymentInitializeInput, PaymentInitializeResult, PaymentProvider, PaymentVerifyResult } from "./types";

const FLW_API = "https://api.flutterwave.com/v3";

export class FlutterwaveProvider implements PaymentProvider {
  readonly name = "flutterwave";

  constructor(private secretKey: string) {}

  async initialize(input: PaymentInitializeInput): Promise<PaymentInitializeResult> {
    const res = await fetch(`${FLW_API}/payments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref: input.reference,
        amount: input.amount,
        currency: "NGN",
        redirect_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/checkout?verify=${input.reference}`,
        customer: { email: input.email },
        meta: input.metadata,
      }),
    });

    const data = await res.json();
    if (!res.ok || data.status !== "success") {
      throw new Error(data.message || "Flutterwave initialization failed.");
    }

    return {
      provider: this.name,
      reference: input.reference,
      checkoutUrl: data.data.link,
      requiresRedirect: true,
    };
  }

  async verify(reference: string): Promise<PaymentVerifyResult> {
    const res = await fetch(`${FLW_API}/transactions/verify_by_reference?tx_ref=${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${this.secretKey}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Flutterwave verification failed.");

    const raw = data.data?.status;
    const status = raw === "successful" ? "success" : raw === "failed" || raw === "cancelled" ? "failed" : "pending";

    return {
      provider: this.name,
      reference,
      status,
      amount: data.data?.amount ?? 0,
    };
  }
}
