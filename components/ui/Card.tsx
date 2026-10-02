import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return <div className={cn("overflow-hidden rounded-[1.5rem] border border-[#202024]/15 bg-[#fffdf7] shadow-[0_12px_30px_rgb(32_32_36/8%)]", className)} {...props} />;
}
