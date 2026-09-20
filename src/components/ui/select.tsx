import { forwardRef, type SelectHTMLAttributes } from "react";

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className = "", ...props }, ref) {
  return (
    <select
      ref={ref}
      className={`w-full rounded-default border border-border bg-surface px-3 py-2 font-ui text-[13px] text-text-primary focus:border-border-strong focus:outline-none ${className}`}
      {...props}
    />
  );
});
