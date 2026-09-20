import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-burgundy text-surface hover:bg-coffee",
  secondary:
    "border border-border bg-surface text-text-primary hover:bg-surface-secondary",
  ghost: "text-text-secondary hover:text-text-primary",
  danger: "border border-burgundy text-burgundy hover:bg-burgundy hover:text-surface",
};

// Shared with Link-based "button-styled" navigation (e.g. next/link).
export function buttonVariants(variant: ButtonVariant = "primary", className = "") {
  return `inline-flex items-center rounded-default px-4 py-2 font-ui text-[13px] transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`;
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button className={buttonVariants(variant, className)} {...props} />;
}
