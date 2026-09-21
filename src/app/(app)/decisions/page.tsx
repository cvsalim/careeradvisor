import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Badge } from "@/components/ui/badge";

export default async function DecisionsPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();

  const { data: decisions } = await supabase
    .from("decisions")
    .select("id, title, decision_date, status, client_id, clients(full_name)")
    .order("decision_date", { ascending: false })
    .limit(50);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-[28px] text-charcoal">
          {t.decisions.title}
        </h1>
        <p className="font-editorial text-sm text-text-secondary">
          {t.decisions.subtitle}
        </p>
      </div>

      {!decisions || decisions.length === 0 ? (
        <p className="font-editorial text-base text-text-secondary">
          {t.decisions.empty}
        </p>
      ) : (
        <table className="w-full border-collapse font-ui text-[13px]">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.decisions.table.date}
              </th>
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.decisions.table.client}
              </th>
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.decisions.table.title}
              </th>
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.decisions.table.status}
              </th>
              <th className="py-2 pr-4" />
            </tr>
          </thead>
          <tbody>
            {decisions.map((decision) => (
              <tr key={decision.id} className="border-b border-border last:border-0">
                <td className="py-2 pr-4 text-text-secondary">
                  {new Date(decision.decision_date).toLocaleDateString(
                    locale === "pt" ? "pt-BR" : "en-US",
                  )}
                </td>
                <td className="py-2 pr-4 text-text-primary">
                  {decision.clients?.[0]?.full_name ?? "—"}
                </td>
                <td className="py-2 pr-4 text-text-primary">{decision.title}</td>
                <td className="py-2 pr-4">
                  <Badge tone={decision.status === "approved" ? "positive" : decision.status === "rejected" ? "negative" : "neutral"}>
                    {t.status[decision.status as keyof typeof t.status]}
                  </Badge>
                </td>
                <td className="py-2 pr-4">
                  <Link
                    href={`/clients/${decision.client_id}/decisions`}
                    className="text-burgundy hover:underline"
                  >
                    {t.decisions.viewButton}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
