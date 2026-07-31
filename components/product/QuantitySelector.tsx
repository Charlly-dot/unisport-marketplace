"use client";

import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  quantity: number;
  max: number;
  onChange: (quantity: number) => void;
  disabled?: boolean;
}

export default function QuantitySelector({
  quantity,
  max,
  onChange,
  disabled = false,
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (quantity > 1) onChange(quantity - 1);
  };

  const handleIncrement = () => {
    if (quantity < max) onChange(quantity + 1);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
        Quantity
      </p>
      <div className="flex items-center gap-1">
        <motion.button
          type="button"
          whileTap={quantity > 1 && !disabled ? { scale: 0.88 } : undefined}
          onClick={handleDecrement}
          disabled={quantity <= 1 || disabled}
          aria-label="Decrease quantity"
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl border transition-all",
            quantity > 1 && !disabled
              ? "border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500 hover:text-white"
              : "cursor-not-allowed border-slate-800/50 bg-slate-900/40 text-slate-600"
          )}
        >
          <Minus size={16} />
        </motion.button>

        <motion.span
          key={quantity}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="flex h-11 min-w-[3rem] items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-center text-sm font-semibold text-white"
          aria-live="polite"
          aria-atomic="true"
        >
          {quantity}
        </motion.span>

        <motion.button
          type="button"
          whileTap={quantity < max && !disabled ? { scale: 0.88 } : undefined}
          onClick={handleIncrement}
          disabled={quantity >= max || disabled}
          aria-label="Increase quantity"
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl border transition-all",
            quantity < max && !disabled
              ? "border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500 hover:text-white"
              : "cursor-not-allowed border-slate-800/50 bg-slate-900/40 text-slate-600"
          )}
        >
          <Plus size={16} />
        </motion.button>
      </div>
    </div>
  );
}
