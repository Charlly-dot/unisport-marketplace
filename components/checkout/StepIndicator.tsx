"use client";

import { Check } from "lucide-react";
import type { CheckoutStep } from "@/lib/checkout/types";
import { CHECKOUT_STEPS, STEP_LABELS } from "@/lib/checkout/types";

interface StepIndicatorProps {
  currentStep: CheckoutStep;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIdx = CHECKOUT_STEPS.indexOf(currentStep);

  return (
    <nav aria-label="Checkout progress" className="flex items-center gap-2 overflow-x-auto pb-2">
      {CHECKOUT_STEPS.map((step, idx) => {
        const isActive = idx === currentIdx;
        const isCompleted = idx < currentIdx;

        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                isCompleted
                  ? "bg-sky-500 text-white"
                  : isActive
                    ? "border-2 border-sky-400 bg-sky-500/15 text-sky-300"
                    : "border border-slate-700 bg-slate-900 text-slate-500"
              }`}
              aria-current={isActive ? "step" : undefined}
            >
              {isCompleted ? <Check size={14} /> : idx + 1}
            </div>
            <span
              className={`hidden text-xs font-medium sm:inline ${
                isActive ? "text-white" : isCompleted ? "text-sky-400" : "text-slate-500"
              }`}
            >
              {STEP_LABELS[step]}
            </span>
            {idx < CHECKOUT_STEPS.length - 1 && (
              <div className={`mx-1 hidden h-px w-6 sm:block ${isCompleted ? "bg-sky-500" : "bg-slate-800"}`} />
            )}
          </div>
        );
      })}
    </nav>
  );
}
