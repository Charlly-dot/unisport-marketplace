"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CheckCircle2, Package, MapPin, ShoppingBag } from "lucide-react";
import type { CheckoutState } from "@/lib/checkout/types";
import { ESTIMATED_DELIVERY } from "@/lib/checkout/types";

interface Props {
  state: CheckoutState;
  orderId: string;
}

export default function ConfirmationStep({ state, orderId }: Props) {
  const { delivery } = state;

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-4">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15">
          <CheckCircle2 size={40} className="text-emerald-400" />
        </div>
        <h2 className="text-2xl font-semibold text-white">Order Confirmed!</h2>
        <p className="mx-auto max-w-md text-sm text-slate-400">
          Thank you for your order. We&apos;ll send you updates via email.
        </p>
      </div>

      <Card className="mx-auto max-w-md space-y-4 p-6 text-left">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Order Number</p>
          <p className="text-lg font-bold text-sky-400 font-mono">{orderId}</p>
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-300">
          <Package size={16} className="text-slate-400" />
          <span>{ESTIMATED_DELIVERY[delivery.method]}</span>
        </div>

        {delivery.method === "campus_pickup" && (
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <MapPin size={16} className="text-slate-400" />
            <span>Pickup at: <strong>{delivery.pickupLocation}</strong></span>
          </div>
        )}

        {delivery.method === "campus_pickup" && (
          <div className="rounded-2xl bg-sky-500/10 p-4 text-xs text-sky-300">
            <p className="font-medium">Campus Pickup Instructions</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sky-400/80">
              <li>Bring a valid student ID</li>
              <li>Order number ready for verification</li>
              <li>Pickup window: 9am - 5pm on weekdays</li>
            </ul>
          </div>
        )}
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button variant="secondary" onClick={() => window.print()} className="inline-flex items-center gap-2">
          Print receipt
        </Button>
        <Button href="/shop" className="inline-flex items-center gap-2">
          <ShoppingBag size={16} /> Continue shopping
        </Button>
      </div>

      <Link href="/orders" className="inline-block text-sm text-sky-400 hover:underline">
        View order history
      </Link>
    </div>
  );
}
