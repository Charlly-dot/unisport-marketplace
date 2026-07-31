import type { PaymentProvider } from "./types";
import { MockPaymentProvider } from "./mock";
import { PaystackProvider } from "./paystack";
import { FlutterwaveProvider } from "./flutterwave";

export type SupportedProvider = "mock" | "paystack" | "flutterwave";

let cachedProvider: PaymentProvider | null = null;

export function getPaymentProvider(): PaymentProvider {
  if (cachedProvider) return cachedProvider;

  const configured = process.env.PAYMENT_PROVIDER?.toLowerCase() as SupportedProvider | undefined;

  switch (configured) {
    case "paystack": {
      const key = process.env.PAYSTACK_SECRET_KEY;
      if (key) {
        cachedProvider = new PaystackProvider(key);
        return cachedProvider;
      }
      break;
    }
    case "flutterwave": {
      const key = process.env.FLUTTERWAVE_SECRET_KEY;
      if (key) {
        cachedProvider = new FlutterwaveProvider(key);
        return cachedProvider;
      }
      break;
    }
    default:
      break;
  }

  cachedProvider = new MockPaymentProvider();
  return cachedProvider;
}

export function generatePaymentReference(): string {
  return `ref-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
