import type { CartItem } from "@/types/product";
import type { Coupon } from "./coupons";

export type CheckoutStep = "details" | "delivery" | "payment" | "review" | "confirmation";

export const CHECKOUT_STEPS: CheckoutStep[] = ["details", "delivery", "payment", "review", "confirmation"];

export const STEP_LABELS: Record<CheckoutStep, string> = {
  details: "Customer Details",
  delivery: "Delivery",
  payment: "Payment",
  review: "Review",
  confirmation: "Confirmation",
};

export type DeliveryMethod = "campus_pickup" | "standard" | "express";

export interface DeliveryDetails {
  method: DeliveryMethod;
  pickupLocation?: string;
  state?: string;
  city?: string;
  address?: string;
  postalCode?: string;
}

export type PaymentMethod = "credit_card" | "debit_card" | "bank_transfer" | "pay_on_pickup" | "wallet";

export interface PaymentDetails {
  method: PaymentMethod;
  cardNumber?: string;
  cardName?: string;
  expiry?: string;
  cvv?: string;
  bankName?: string;
}

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface CheckoutState {
  step: CheckoutStep;
  customer: CustomerDetails;
  delivery: DeliveryDetails;
  payment: PaymentDetails;
  couponCode: string;
  appliedCoupon: Coupon | null;
  items: CartItem[];
}

export const PICKUP_LOCATIONS = [
  "Student Union",
  "Campus Gym",
  "Library",
  "Sports Complex",
] as const;

export const PAYMENT_METHODS: Array<{ value: PaymentMethod; label: string; icon: string }> = [
  { value: "credit_card", label: "Credit Card", icon: "💳" },
  { value: "debit_card", label: "Debit Card", icon: "💳" },
  { value: "bank_transfer", label: "Bank Transfer", icon: "🏦" },
  { value: "pay_on_pickup", label: "Pay on Pickup", icon: " campus" },
  { value: "wallet", label: "Wallet", icon: "👛" },
];

export const SHIPPING_COSTS: Record<DeliveryMethod, number> = {
  campus_pickup: 0,
  standard: 2500,
  express: 5000,
};

export const ESTIMATED_DELIVERY: Record<DeliveryMethod, string> = {
  campus_pickup: "Ready in 24 hours",
  standard: "3-5 business days",
  express: "1-2 business days",
};
