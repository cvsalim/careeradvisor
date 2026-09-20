import type { LabelHTMLAttributes } from "react";

export function Label({
  className = "",
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={`mb-1 block font-ui text-[11px] uppercase tracking-[0.06em] text-text-muted ${className}`}
      {...props}
    />
  );
}
