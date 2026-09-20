import { Search } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";

export function Topbar({ userEmail }: { userEmail?: string | null }) {
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
          <span className="font-ui text-[13px]">Search</span>
          <kbd className="ml-auto font-ui text-[11px] uppercase tracking-wide text-text-muted">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {userEmail && (
          <span className="font-ui text-[13px] text-text-secondary">
            {userEmail}
          </span>
        )}
        <LogoutButton />
      </div>
    </header>
  );
}
