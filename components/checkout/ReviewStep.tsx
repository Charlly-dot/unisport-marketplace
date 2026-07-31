"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatPrice } from "@/lib/products";
import type { CheckoutState } from "@/lib/checkout/types";
import { ESTIMATED_DELIVERY, SHIPPING_COSTS } from "@/lib/checkout/types";
import { calculateDiscount } from "@/lib/checkout/coupons";
import { MapPin, CreditCard, Tag, Receipt } from "lucide-react";

interface Props {
  state: CheckoutState;
  onBack: () => void;
  onPlaceOrder: () => void;
  placing?: boolean;
}

export default function ReviewStep({ state, onBack, onPlaceOrder, placing }: Props) {
  const { items, customer, delivery, payment, appliedCoupon } = state;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = SHIPPING_COSTS[delivery.method];
  const tax = Math.round(subtotal * 0.075);
  const discountAmount = appliedCoupon ? calculateDiscount(appliedCoupon, subtotal, shipping) : 0;
  const total = subtotal + shipping + tax - discountAmount;

  const paymentLabel =
    payment.method === "credit_card" ? `Credit Card ••${(payment.cardNumber ?? "").slice(-4)}`
    : payment.method === "debit_card" ? `Debit Card ••${(payment.cardNumber ?? "").slice(-4)}`
    : payment.method === "bank_transfer" ? "Bank Transfer"
    : payment.method === "wallet" ? "UniSport Wallet"
    : "Pay on Pickup";

  const deliveryLabel =
    delivery.method === "campus_pickup"
      ? `Campus Pickup — ${delivery.pickupLocation}`
      : delivery.method === "express"
        ? `Express Shipping — ${delivery.city}, ${delivery.state}`
        : `Standard Shipping — ${delivery.city}, ${delivery.state}`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Review Your Order</h2>
        <p className="text-sm text-slate-400">Verify everything before placing your order.</p>
      </div>

      <Card className="divide-y divide-slate-800 p-0">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-900">
              <Image src={item.product.image} alt={item.product.title} fill className="object-cover" sizes="64px" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">{item.product.title}</p>
              <p className="text-xs text-slate-400">Qty: {item.quantity}{item.size ? ` · Size ${item.size}` : ""}</p>
            </div>
            <p className="text-sm font-semibold text-white">{formatPrice(item.product.price * item.quantity)}</p>
          </div>
        ))}
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="space-y-3 p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <Receipt size={16} className="text-slate-400" /> Customer
          </div>
          <p className="text-sm text-slate-300">{customer.firstName} {customer.lastName}</p>
          <p className="text-xs text-slate-400">{customer.email}</p>
          <p className="text-xs text-slate-400">{customer.phone}</p>
        </Card>

        <Card className="space-y-3 p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <MapPin size={16} className="text-slate-400" /> Delivery
          </div>
          <p className="text-sm text-slate-300">{deliveryLabel}</p>
          <p className="text-xs text-slate-500">{ESTIMATED_DELIVERY[delivery.method]}</p>
        </Card>

        <Card className="space-y-3 p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <CreditCard size={16} className="text-slate-400" /> Payment
          </div>
          <p className="text-sm text-slate-300">{paymentLabel}</p>
        </Card>

        {appliedCoupon && (
          <Card className="space-y-3 p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <Tag size={16} className="text-sky-400" /> Coupon
            </div>
            <p className="text-sm text-sky-300">{appliedCoupon.code} — {appliedCoupon.description}</p>
          </Card>
        )}
      </div>

      <Card className="space-y-3 p-5">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-slate-300"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="flex justify-between text-slate-300"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
          <div className="flex justify-between text-slate-300"><span>Tax (7.5%)</span><span>{formatPrice(tax)}</span></div>
          {discountAmount > 0 && <div className="flex justify-between text-sky-400"><span>Discount</span><span>-{formatPrice(discountAmount)}</span></div>}
          <div className="border-t border-slate-800 pt-2 flex justify-between text-base font-semibold text-white"><span>Total</span><span>{formatPrice(total)}</span></div>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack} disabled={placing}>Back</Button>
        <Button onClick={onPlaceOrder} disabled={placing}>
          {placing ? "Placing order…" : `Place order — ${formatPrice(total)}`}
        </Button>
      </div>
    </div>
  );
}
