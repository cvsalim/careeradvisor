import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function ObjectivesIndexPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();

  const [{ data: clients }, { data: strategies }] = await Promise.all([
    supabase.from("clients").select("id, full_name").order("full_name"),
    supabase
      .from("career_strategies")
      .select("client_id, version, main_objective, updated_at")
      .eq("is_current", true),
  ]);

  const strategyByClient = new Map(
    (strategies ?? []).map((strategy) => [strategy.client_id, strategy]),
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-[28px] text-charcoal">
          {t.strategy.title}
        </h1>
        <p className="font-editorial text-sm text-text-secondary">
          {t.strategy.subtitle}
        </p>
      </div>

      {!clients || clients.length === 0 ? (
        <p className="font-editorial text-base text-text-secondary">
          {t.clients.empty}
        </p>
      ) : (
        <table className="w-full border-collapse font-ui text-[13px]">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.strategy.table.client}
              </th>
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.strategy.table.mainObjective}
              </th>
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.strategy.table.version}
              </th>
              <th className="py-2 pr-4" />
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => {
              const strategy = strategyByClient.get(client.id);
              return (
                <tr
                  key={client.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="py-2 pr-4 text-text-primary">
                    {client.full_name}
                  </td>
                  <td className="py-2 pr-4 text-text-secondary">
                    {strategy?.main_objective ?? t.strategy.empty}
                  </td>
                  <td className="py-2 pr-4 text-text-secondary">
                    {strategy ? `v${strategy.version}` : "—"}
                  </td>
                  <td className="py-2 pr-4">
                    <Link
                      href={`/clients/${client.id}/strategy`}
                      className="text-burgundy hover:underline"
                    >
                      {t.strategy.viewButton}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
