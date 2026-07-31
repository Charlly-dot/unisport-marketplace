import type { PaymentInitializeInput, PaymentInitializeResult, PaymentProvider, PaymentVerifyResult } from "./types";

export class MockPaymentProvider implements PaymentProvider {
  readonly name = "mock";

  async initialize(input: PaymentInitializeInput): Promise<PaymentInitializeResult> {
    return {
      provider: this.name,
      reference: input.reference,
      checkoutUrl: null,
      requiresRedirect: false,
    };
  }

  async verify(reference: string): Promise<PaymentVerifyResult> {
    return {
      provider: this.name,
      reference,
      status: "success",
      amount: 0,
    };
  }
}
