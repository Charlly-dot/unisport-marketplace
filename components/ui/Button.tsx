import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

const variants = {
  default: "bg-[#d8ff35] text-[#202024] hover:bg-[#c8ec2c]",
  secondary: "border border-[#202024]/20 bg-[#fffdf7] text-[#202024] hover:bg-[#ebe8df]",
  ghost: "bg-transparent text-[#202024] hover:bg-[#ebe8df]",
};

const sizes = {
  default: "h-12 rounded-2xl px-5 text-sm font-semibold",
  sm: "h-10 rounded-2xl px-4 text-sm",
  lg: "h-14 rounded-[1.35rem] px-6 text-base",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  href?: string;
}

export function Button({ className, variant = "default", size = "default", href, children, ...props }: ButtonProps) {
  const classNames = cn(
    "inline-flex items-center justify-center gap-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3757df] disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classNames}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classNames} {...props}>
      {children}
    </button>
  );
}
