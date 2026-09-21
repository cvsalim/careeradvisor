import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { MarketSignalForm } from "@/components/market-signals/market-signal-form";
import { Badge } from "@/components/ui/badge";

export default async function MarketSignalsPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();

  const [{ data: clients }, { data: signals }] = await Promise.all([
    supabase.from("clients").select("id, full_name").order("full_name"),
    supabase
      .from("market_signals")
      .select("id, client_id, title, source, summary, tags, signal_date, clients(full_name)")
      .order("signal_date", { ascending: false }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-[28px] text-charcoal">
          {t.marketSignals.title}
        </h1>
        <p className="font-editorial text-sm text-text-secondary">
          {t.marketSignals.subtitle}
        </p>
      </div>

      <MarketSignalForm t={t} clients={clients ?? []} />

      {!signals || signals.length === 0 ? (
        <p className="font-editorial text-base text-text-secondary">
          {t.marketSignals.empty}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {signals.map((signal) => (
            <div
              key={signal.id}
              className="flex flex-col gap-2 rounded-default border border-border bg-surface p-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg text-charcoal">
                  {signal.title}
                </h3>
                <span className="font-ui text-[12px] text-text-muted">
                  {new Date(signal.signal_date).toLocaleDateString(
                    locale === "pt" ? "pt-BR" : "en-US",
                  )}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="neutral">
                  {signal.client_id
                    ? (signal.clients?.[0]?.full_name ?? "—")
                    : t.marketSignals.generalWatchlist}
                </Badge>
                {signal.source && (
                  <span className="font-ui text-[12px] text-text-muted">
                    {signal.source}
                  </span>
                )}
                {signal.client_id && (
                  <Link
                    href={`/clients/${signal.client_id}`}
                    className="font-ui text-[12px] text-burgundy hover:underline"
                  >
                    {t.monthlyReports.viewButton}
                  </Link>
                )}
              </div>
              {signal.summary && (
                <p className="font-editorial text-base text-text-primary">
                  {signal.summary}
                </p>
              )}
              {signal.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {signal.tags.map((tag: string) => (
                    <Badge key={tag} tone="neutral">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
