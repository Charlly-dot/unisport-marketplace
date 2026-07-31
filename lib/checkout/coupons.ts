export interface Coupon {
  code: string;
  type: "percentage" | "fixed" | "free_shipping";
  value: number;
  description: string;
  minOrder?: number;
}

export const COUPONS: Record<string, Coupon> = {
  CAMPUS10: {
    code: "CAMPUS10",
    type: "percentage",
    value: 10,
    description: "10% off your order",
    minOrder: 5000,
  },
  FREESHIP: {
    code: "FREESHIP",
    type: "free_shipping",
    value: 0,
    description: "Free shipping on your order",
    minOrder: 10000,
  },
  STUDENT5: {
    code: "STUDENT5",
    type: "fixed",
    value: 5000,
    description: "₦5,000 off your order",
    minOrder: 20000,
  },
};

export function validateCoupon(code: string, subtotal: number): { valid: boolean; coupon?: Coupon; error?: string } {
  const normalized = code.trim().toUpperCase();
  const coupon = COUPONS[normalized];

  if (!coupon) {
    return { valid: false, error: "Invalid coupon code." };
  }
  if (coupon.minOrder && subtotal < coupon.minOrder) {
    return { valid: false, error: `Minimum order of ₦${coupon.minOrder.toLocaleString()} required.` };
  }
  return { valid: true, coupon };
}

export function calculateDiscount(coupon: Coupon, subtotal: number, shippingCost: number): number {
  switch (coupon.type) {
    case "percentage":
      return Math.round(subtotal * (coupon.value / 100));
    case "fixed":
      return coupon.value;
    case "free_shipping":
      return shippingCost;
    default:
      return 0;
  }
}
