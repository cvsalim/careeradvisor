import { forwardRef, type TextareaHTMLAttributes } from "react";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className = "", ...props }, ref) {
  return (
    <textarea
      ref={ref}
      rows={4}
      className={`w-full rounded-default border border-border bg-surface px-3 py-2 font-ui text-[13px] text-text-primary placeholder:text-text-muted focus:border-border-strong focus:outline-none ${className}`}
      {...props}
    />
  );
});
