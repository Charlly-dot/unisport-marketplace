import type { Order } from "@/types/user";
import type { DeliveryDetails } from "@/lib/checkout/types";

export interface CreateOrderPayload {
  email: string;
  items: Array<{
    slug: string;
    quantity: number;
    size?: string | null;
  }>;
  deliveryMethod: DeliveryDetails["method"];
  pickupLocation?: string;
  shippingAddress?: DeliveryDetails;
  discount?: number;
  payment?: { method: string; provider: string; reference: string; paidAt: string };
}

export interface PaymentInitializePayload {
  email: string;
  amount: number;
  metadata?: Record<string, unknown>;
}

export interface PaymentInitializeResult {
  reference: string;
  provider: string;
  redirectUrl?: string;
  accessCode?: string;
  [key: string]: unknown;
}

export interface PaymentVerifyResult {
  success: boolean;
  [key: string]: unknown;
}

async function handleResponse<T>(promise: Promise<Response>): Promise<T> {
  const res = await promise;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? "Request failed.");
  }
  return data as T;
}

export async function listOrders(email: string): Promise<Order[]> {
  const data = await handleResponse<{ orders: Order[] }>(
    fetch(`/api/orders?email=${encodeURIComponent(email)}`),
  );
  return data.orders;
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const data = await handleResponse<{ order: Order }>(
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
  return data.order;
}

export async function initializePayment(payload: PaymentInitializePayload): Promise<PaymentInitializeResult> {
  return handleResponse<PaymentInitializeResult>(
    fetch("/api/payments/initialize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function verifyPayment(reference: string): Promise<PaymentVerifyResult> {
  return handleResponse<PaymentVerifyResult>(
    fetch("/api/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference }),
    }),
  );
}
