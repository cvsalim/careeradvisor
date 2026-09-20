import { forwardRef, type InputHTMLAttributes } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function Input({ className = "", ...props }, ref) {
  return (
    <input
      ref={ref}
      className={`w-full rounded-default border border-border bg-surface px-3 py-2 font-ui text-[13px] text-text-primary placeholder:text-text-muted focus:border-border-strong focus:outline-none ${className}`}
      {...props}
    />
  );
});
