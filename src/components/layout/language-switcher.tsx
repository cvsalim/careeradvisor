"use client";

import { useTransition } from "react";
import { setLocale } from "@/app/actions/locale";
import type { Locale } from "@/lib/i18n/dictionaries";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const [isPending, startTransition] = useTransition();

  function handleChange(next: Locale) {
    if (next === locale) return;
    startTransition(() => setLocale(next));
  }

  return (
    <div className="flex items-center gap-1 font-ui text-[12px] uppercase tracking-[0.06em]">
      {(["pt", "en"] as Locale[]).map((option) => (
        <button
          key={option}
          type="button"
          disabled={isPending}
          onClick={() => handleChange(option)}
          className={
            option === locale
              ? "rounded-sm px-1.5 py-1 text-burgundy"
              : "rounded-sm px-1.5 py-1 text-text-muted hover:text-text-secondary"
          }
        >
          {option}
        </button>
      ))}
    </div>
  );
}
