import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-2xl border border-[#202024]/20 bg-[#fffdf7] px-4 py-3 text-sm text-[#202024] placeholder:text-[#77757a] focus:border-[#3757df] focus:outline-none focus:ring-2 focus:ring-[#3757df]/20",
        className,
      )}
      {...props}
    />
  );
}
