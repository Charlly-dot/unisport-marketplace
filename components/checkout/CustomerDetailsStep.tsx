"use client";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { CustomerDetails } from "@/lib/checkout/types";

interface Props {
  data: CustomerDetails;
  onChange: (data: CustomerDetails) => void;
  onNext: () => void;
}

export default function CustomerDetailsStep({ data, onChange, onNext }: Props) {
  const update = (key: keyof CustomerDetails, value: string) => onChange({ ...data, [key]: value });

  const isValid = data.firstName.trim() && data.lastName.trim() && data.email.trim() && data.phone.trim();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Customer Details</h2>
        <p className="text-sm text-slate-400">Confirm your information for this order.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="c-first" className="text-sm font-medium text-slate-300">First Name</label>
          <Input id="c-first" value={data.firstName} onChange={(e) => update("firstName", e.target.value)} autoComplete="given-name" />
        </div>
        <div className="space-y-2">
          <label htmlFor="c-last" className="text-sm font-medium text-slate-300">Last Name</label>
          <Input id="c-last" value={data.lastName} onChange={(e) => update("lastName", e.target.value)} autoComplete="family-name" />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="c-email" className="text-sm font-medium text-slate-300">Email</label>
        <Input id="c-email" type="email" value={data.email} onChange={(e) => update("email", e.target.value)} autoComplete="email" />
      </div>

      <div className="space-y-2">
        <label htmlFor="c-phone" className="text-sm font-medium text-slate-300">Phone</label>
        <Input id="c-phone" type="tel" placeholder="+234 ..." value={data.phone} onChange={(e) => update("phone", e.target.value)} autoComplete="tel" />
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!isValid}>Continue to delivery</Button>
      </div>
    </div>
  );
}
