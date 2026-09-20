import type { ReactNode } from "react";

type Tone = "neutral" | "positive" | "warning" | "negative";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-surface-secondary text-text-secondary",
  positive: "bg-olive-bronze/10 text-olive-bronze",
  warning: "bg-terracotta/10 text-terracotta",
  negative: "bg-burgundy/10 text-burgundy",
};

// Maps domain status/priority values to a visual tone; unknown values fall back to neutral.
export const STATUS_TONES: Record<string, Tone> = {
  active: "positive",
  validated: "positive",
  approved: "positive",
  done: "positive",
  onboarding: "warning",
  in_review: "warning",
  in_progress: "warning",
  pending: "neutral",
  draft: "neutral",
  paused: "warning",
  blocked: "negative",
  rejected: "negative",
  cancelled: "negative",
  ended: "negative",
  archived: "neutral",
  high: "negative",
  medium: "warning",
  low: "neutral",
};

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-sm px-2 py-0.5 font-ui text-[11px] uppercase tracking-[0.06em] ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
