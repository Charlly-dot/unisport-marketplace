"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string | null;
  onSelect: (size: string) => void;
  disabled?: boolean;
}

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function SizeSelector({
  sizes,
  selectedSize,
  onSelect,
  disabled = false,
}: SizeSelectorProps) {
  const displaySizes = sizes.length > 0 ? sizes : [];

  if (displaySizes.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
          Size
        </p>
        {selectedSize && (
          <span className="text-sm text-sky-400">{selectedSize}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select size">
        {ALL_SIZES.map((size) => {
          const available = displaySizes.includes(size);
          const selected = selectedSize === size;

          return (
            <motion.button
              key={size}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-disabled={!available || disabled}
              disabled={!available || disabled}
              onClick={() => onSelect(size)}
              whileTap={available && !disabled ? { scale: 0.92 } : undefined}
              className={cn(
                "relative h-11 min-w-[2.75rem] rounded-xl border px-3 text-sm font-semibold transition-all",
                available && !disabled
                  ? selected
                    ? "border-sky-400 bg-sky-400/10 text-sky-400 shadow-lg shadow-sky-400/10"
                    : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500 hover:text-white"
                  : "cursor-not-allowed border-slate-800/50 bg-slate-900/40 text-slate-600"
              )}
            >
              {size}
              {!available && (
                <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                  <span className="h-px w-6 rotate-[-45deg] bg-slate-600" />
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
