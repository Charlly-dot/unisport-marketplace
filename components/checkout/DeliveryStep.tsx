"use client";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { DeliveryDetails, DeliveryMethod } from "@/lib/checkout/types";
import { PICKUP_LOCATIONS, ESTIMATED_DELIVERY } from "@/lib/checkout/types";

interface Props {
  data: DeliveryDetails;
  onChange: (data: DeliveryDetails) => void;
  onNext: () => void;
  onBack: () => void;
}

const methods: Array<{ value: DeliveryMethod; label: string; desc: string }> = [
  { value: "campus_pickup", label: "Campus Pickup", desc: "Free — pick up on campus" },
  { value: "standard", label: "Standard Shipping", desc: "₦2,500 — 3-5 days" },
  { value: "express", label: "Express Shipping", desc: "₦5,000 — 1-2 days" },
];

export default function DeliveryStep({ data, onChange, onNext, onBack }: Props) {
  const update = (patch: Partial<DeliveryDetails>) => onChange({ ...data, ...patch });

  const isValid =
    data.method === "campus_pickup"
      ? !!data.pickupLocation
      : !!data.state && !!data.city && !!data.address;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Delivery Method</h2>
        <p className="text-sm text-slate-400">Choose how you want to receive your order.</p>
      </div>

      <div className="space-y-3">
        {methods.map((m) => (
          <label
            key={m.value}
            className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition ${
              data.method === m.value
                ? "border-sky-400 bg-sky-500/10"
                : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
            }`}
          >
            <input
              type="radio"
              name="delivery"
              value={m.value}
              checked={data.method === m.value}
              onChange={() => update({ method: m.value })}
              className="h-4 w-4 border-slate-700 bg-slate-950 text-sky-400 focus:ring-sky-500"
            />
            <div>
              <p className="text-sm font-medium text-white">{m.label}</p>
              <p className="text-xs text-slate-400">{m.desc}</p>
            </div>
            <span className="ml-auto text-xs text-slate-500">{ESTIMATED_DELIVERY[m.value]}</span>
          </label>
        ))}
      </div>

      {data.method === "campus_pickup" && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Pickup Location</label>
          <div className="grid gap-2 sm:grid-cols-2">
            {PICKUP_LOCATIONS.map((loc) => (
              <label
                key={loc}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3 text-sm transition ${
                  data.pickupLocation === loc
                    ? "border-sky-400 bg-sky-500/10 text-white"
                    : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700"
                }`}
              >
                <input
                  type="radio"
                  name="pickup"
                  value={loc}
                  checked={data.pickupLocation === loc}
                  onChange={() => update({ pickupLocation: loc })}
                  className="h-4 w-4 border-slate-700 bg-slate-950 text-sky-400 focus:ring-sky-500"
                />
                {loc}
              </label>
            ))}
          </div>
        </div>
      )}

      {data.method !== "campus_pickup" && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="d-state" className="text-sm font-medium text-slate-300">State</label>
              <Input id="d-state" value={data.state ?? ""} onChange={(e) => update({ state: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label htmlFor="d-city" className="text-sm font-medium text-slate-300">City</label>
              <Input id="d-city" value={data.city ?? ""} onChange={(e) => update({ city: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="d-address" className="text-sm font-medium text-slate-300">Address</label>
            <Input id="d-address" value={data.address ?? ""} onChange={(e) => update({ address: e.target.value })} autoComplete="street-address" />
          </div>
          <div className="space-y-2">
            <label htmlFor="d-postal" className="text-sm font-medium text-slate-300">Postal Code</label>
            <Input id="d-postal" value={data.postalCode ?? ""} onChange={(e) => update({ postalCode: e.target.value })} autoComplete="postal-code" />
          </div>
        </div>
      )}

      <p className="text-xs text-slate-500">Estimated: {ESTIMATED_DELIVERY[data.method]}</p>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>Back</Button>
        <Button onClick={onNext} disabled={!isValid}>Continue to payment</Button>
      </div>
    </div>
  );
}
