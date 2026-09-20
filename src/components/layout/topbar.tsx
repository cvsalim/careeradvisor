import { Search } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import type { Locale } from "@/lib/i18n/dictionaries";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function Topbar({
  userEmail,
  locale,
}: {
  userEmail?: string | null;
  locale: Locale;
}) {
  const t = getDictionary(locale);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-6">
      <div className="flex items-center gap-3">
        <span className="font-display text-lg tracking-wide text-charcoal">
          Advisor Career Office
        </span>
      </div>

      <div className="flex flex-1 items-center justify-center px-8">
        <div className="flex w-full max-w-sm items-center gap-2 rounded-default border border-border bg-surface-secondary px-3 py-1.5 text-text-muted">
          <Search size={14} strokeWidth={1.75} />
          <span className="font-ui text-[13px]">{t.topbar.search}</span>
          <kbd className="ml-auto font-ui text-[11px] uppercase tracking-wide text-text-muted">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <LanguageSwitcher locale={locale} />
        {userEmail && (
          <span className="font-ui text-[13px] text-text-secondary">
            {userEmail}
          </span>
        )}
        <LogoutButton label={t.topbar.logout} />
      </div>
    </header>
  );
}
