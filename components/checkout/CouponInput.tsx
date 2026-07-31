"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { validateCoupon, calculateDiscount, type Coupon } from "@/lib/checkout/coupons";
import { formatPrice } from "@/lib/products";
import { Tag, X, Check } from "lucide-react";

interface Props {
  subtotal: number;
  shippingCost: number;
  appliedCoupon: Coupon | null;
  onApply: (coupon: Coupon) => void;
  onRemove: () => void;
}

export default function CouponInput({ subtotal, shippingCost, appliedCoupon, onApply, onRemove }: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleApply = () => {
    const result = validateCoupon(code, subtotal);
    if (result.valid && result.coupon) {
      onApply(result.coupon);
      setCode("");
      setError("");
    } else {
      setError(result.error || "Invalid code.");
    }
  };

  if (appliedCoupon) {
    const discount = calculateDiscount(appliedCoupon, subtotal, shippingCost);
    return (
      <div className="flex items-center justify-between rounded-2xl border border-sky-500/30 bg-sky-500/10 px-4 py-3">
        <div className="flex items-center gap-2 text-sm">
          <Check size={14} className="text-sky-400" />
          <span className="font-medium text-sky-300">{appliedCoupon.code}</span>
          <span className="text-slate-400">— {appliedCoupon.description}</span>
          <span className="font-semibold text-sky-300">(-{formatPrice(discount)})</span>
        </div>
        <button type="button" onClick={onRemove} className="text-slate-400 hover:text-white" aria-label="Remove coupon">
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(""); }}
            placeholder="Coupon code"
            className="pl-9"
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
          />
        </div>
        <Button variant="secondary" onClick={handleApply} disabled={!code.trim()}>Apply</Button>
      </div>
      {error && <p className="text-xs text-rose-400">{error}</p>}
      <p className="text-xs text-slate-500">Try: CAMPUS10, FREESHIP, STUDENT5</p>
    </div>
  );
}
