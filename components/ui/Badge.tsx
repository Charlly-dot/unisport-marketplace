import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "success" | "warning";
}

const badgeStyles = {
  default: "bg-[#d8ff35] text-[#202024]",
  secondary: "bg-[#ebe8df] text-[#202024]",
  success: "bg-emerald-500/15 text-emerald-700",
  warning: "bg-[#ff684f]/20 text-[#9a2d1e]",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.2em]",
        badgeStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
