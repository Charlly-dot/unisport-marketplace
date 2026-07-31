import type { PaymentInitializeInput, PaymentInitializeResult, PaymentProvider, PaymentVerifyResult } from "./types";

const PAYSTACK_API = "https://api.paystack.co";

export class PaystackProvider implements PaymentProvider {
  readonly name = "paystack";

  constructor(private secretKey: string) {}

  async initialize(input: PaymentInitializeInput): Promise<PaymentInitializeResult> {
    const res = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: input.amount * 100,
        email: input.email,
        reference: input.reference,
        metadata: input.metadata,
        currency: "NGN",
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.status) {
      throw new Error(data.message || "Paystack initialization failed.");
    }

    return {
      provider: this.name,
      reference: input.reference,
      checkoutUrl: data.data.authorization_url,
      requiresRedirect: true,
    };
  }

  async verify(reference: string): Promise<PaymentVerifyResult> {
    const res = await fetch(`${PAYSTACK_API}/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${this.secretKey}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Paystack verification failed.");

    const status = data.data.status === "success" ? "success" : data.data.status === "failed" ? "failed" : "pending";

    return {
      provider: this.name,
      reference,
      status,
      amount: data.data.amount ? Math.round(data.data.amount / 100) : 0,
    };
  }
}
