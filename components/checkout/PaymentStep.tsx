"use client";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { PaymentDetails, PaymentMethod } from "@/lib/checkout/types";
import { PAYMENT_METHODS } from "@/lib/checkout/types";

interface Props {
  data: PaymentDetails;
  onChange: (data: PaymentDetails) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PaymentStep({ data, onChange, onNext, onBack }: Props) {
  const update = (patch: Partial<PaymentDetails>) => onChange({ ...data, ...patch });

  const isCard = data.method === "credit_card" || data.method === "debit_card";
  const isValid =
    data.method === "pay_on_pickup" || data.method === "wallet" || data.method === "bank_transfer"
      ? true
      : isCard
        ? !!data.cardNumber && !!data.cardName && !!data.expiry && !!data.cvv
        : false;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Payment Method</h2>
        <p className="text-sm text-slate-400">Choose how you&apos;d like to pay.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {PAYMENT_METHODS.map((m) => (
          <label
            key={m.value}
            className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition ${
              data.method === m.value
                ? "border-sky-400 bg-sky-500/10"
                : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
            }`}
          >
            <input
              type="radio"
              name="payment"
              value={m.value}
              checked={data.method === m.value}
              onChange={() => update({ method: m.value as PaymentMethod })}
              className="h-4 w-4 border-slate-700 bg-slate-950 text-sky-400 focus:ring-sky-500"
            />
            <span className="text-lg">{m.icon}</span>
            <span className="text-sm font-medium text-white">{m.label}</span>
          </label>
        ))}
      </div>

      {isCard && (
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="space-y-2">
            <label htmlFor="p-card" className="text-sm font-medium text-slate-300">Card Number</label>
            <Input id="p-card" placeholder="0000 0000 0000 0000" value={data.cardNumber ?? ""} onChange={(e) => update({ cardNumber: e.target.value })} maxLength={19} autoComplete="cc-number" />
          </div>
          <div className="space-y-2">
            <label htmlFor="p-name" className="text-sm font-medium text-slate-300">Cardholder Name</label>
            <Input id="p-name" value={data.cardName ?? ""} onChange={(e) => update({ cardName: e.target.value })} autoComplete="cc-name" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="p-exp" className="text-sm font-medium text-slate-300">Expiry</label>
              <Input id="p-exp" placeholder="MM/YY" value={data.expiry ?? ""} onChange={(e) => update({ expiry: e.target.value })} maxLength={5} autoComplete="cc-exp" />
            </div>
            <div className="space-y-2">
              <label htmlFor="p-cvv" className="text-sm font-medium text-slate-300">CVV</label>
              <Input id="p-cvv" placeholder="123" type="password" value={data.cvv ?? ""} onChange={(e) => update({ cvv: e.target.value })} maxLength={4} autoComplete="cc-csc" />
            </div>
          </div>
          <p className="text-xs text-slate-500">This is a mock payment form. No data is transmitted.</p>
        </div>
      )}

      {data.method === "bank_transfer" && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <p className="font-medium text-white">Bank Transfer Instructions</p>
          <p className="mt-2">Transfer to: <strong>UniSport Escrow</strong></p>
          <p>Bank: <strong>Wema Bank</strong></p>
          <p>Account: <strong>0123456789</strong></p>
          <p className="mt-2 text-xs text-slate-500">Your order will be confirmed after payment verification.</p>
        </div>
      )}

      {data.method === "wallet" && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <p>Pay with your UniSport Wallet balance. This feature is coming soon.</p>
        </div>
      )}

      {data.method === "pay_on_pickup" && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <p>Pay cash or transfer when you pick up your order at the selected campus location.</p>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>Back</Button>
        <Button onClick={onNext} disabled={!isValid}>Review order</Button>
      </div>
    </div>
  );
}
