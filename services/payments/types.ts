export interface PaymentInitializeInput {
  amount: number;
  email: string;
  reference: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentInitializeResult {
  provider: string;
  reference: string;
  checkoutUrl: string | null;
  requiresRedirect: boolean;
}

export interface PaymentVerifyResult {
  provider: string;
  reference: string;
  status: "success" | "failed" | "pending";
  amount: number;
}

export interface PaymentProvider {
  readonly name: string;
  initialize(input: PaymentInitializeInput): Promise<PaymentInitializeResult>;
  verify(reference: string): Promise<PaymentVerifyResult>;
}
