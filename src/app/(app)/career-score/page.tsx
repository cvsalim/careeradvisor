import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { CAREER_SCORE_DIMENSIONS } from "@/lib/career-score";

export default async function CareerScorePage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();

  const [{ data: clients }, { data: entries }] = await Promise.all([
    supabase.from("clients").select("id, full_name").order("full_name"),
    supabase
      .from("career_score_entries")
      .select("client_id, dimension, score, evaluated_at")
      .order("evaluated_at", { ascending: false }),
  ]);

  const latestByClientDimension = new Map<string, number>();
  for (const entry of entries ?? []) {
    const key = `${entry.client_id}:${entry.dimension}`;
    if (!latestByClientDimension.has(key)) {
      latestByClientDimension.set(key, entry.score);
    }
  }

  const averageByClient = new Map<string, number>();
  for (const client of clients ?? []) {
    const scores = CAREER_SCORE_DIMENSIONS.map((dimension) =>
      latestByClientDimension.get(`${client.id}:${dimension}`),
    ).filter((score): score is number => score !== undefined);

    if (scores.length > 0) {
      averageByClient.set(
        client.id,
        Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length),
      );
    }
  }

  const clientsWithScore = (clients ?? []).filter((client) =>
    averageByClient.has(client.id),
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-[28px] text-charcoal">
          {t.careerScore.title}
        </h1>
        <p className="font-editorial text-sm text-text-secondary">
          {t.careerScore.subtitle}
        </p>
        <p className="mt-1 font-ui text-[12px] text-text-muted">
          {t.careerScore.disclaimer}
        </p>
      </div>

      {clientsWithScore.length === 0 ? (
        <p className="font-editorial text-base text-text-secondary">
          {t.careerScore.empty}
        </p>
      ) : (
        <table className="w-full border-collapse font-ui text-[13px]">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.careerScore.table.client}
              </th>
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.careerScore.table.average}
              </th>
              <th className="py-2 pr-4" />
            </tr>
          </thead>
          <tbody>
            {clientsWithScore.map((client) => (
              <tr key={client.id} className="border-b border-border last:border-0">
                <td className="py-2 pr-4 text-text-primary">{client.full_name}</td>
                <td className="py-2 pr-4 text-text-secondary">
                  {averageByClient.get(client.id)}
                </td>
                <td className="py-2 pr-4">
                  <Link
                    href={`/clients/${client.id}/career-score`}
                    className="text-burgundy hover:underline"
                  >
                    {t.careerScore.viewButton}
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
