import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return <div className={cn("overflow-hidden rounded-[2rem] border border-slate-800/80 bg-slate-950/90 shadow-xl shadow-slate-950/20", className)} {...props} />;
}
