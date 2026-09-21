import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function PortalCareerScorePage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: client } = await supabase
    .from("clients")
    .select("id")
    .eq("portal_user_id", user!.id)
    .single();

  const { data: entries } = await supabase
    .from("career_score_entries")
    .select("dimension, score, evaluated_at, justification")
    .eq("client_id", client?.id ?? "")
    .order("evaluated_at", { ascending: false });

  const latestByDimension = new Map<
    string,
    { score: number; evaluated_at: string; justification: string | null }
  >();
  for (const entry of entries ?? []) {
    if (!latestByDimension.has(entry.dimension)) {
      latestByDimension.set(entry.dimension, entry);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-[28px] text-charcoal">
        {t.portal.nav.careerScore}
      </h1>

      {latestByDimension.size === 0 ? (
        <p className="font-editorial text-base text-text-secondary">
          {t.portal.careerScore.empty}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {Array.from(latestByDimension.entries()).map(([dimension, entry]) => (
            <div
              key={dimension}
              className="flex flex-col gap-2 rounded-default border border-border bg-surface p-5"
            >
              <p className="font-ui text-[11px] uppercase tracking-[0.06em] text-text-muted">
                {t.careerScore.dimensions[
                  dimension as keyof typeof t.careerScore.dimensions
                ] ?? dimension}
              </p>
              <p className="font-display text-3xl text-charcoal">
                {entry.score}
              </p>
              {entry.justification && (
                <p className="font-editorial text-sm text-text-secondary">
                  {entry.justification}
                </p>
              )}
              <span className="font-ui text-[12px] text-text-muted">
                {new Date(entry.evaluated_at).toLocaleDateString(
                  locale === "pt" ? "pt-BR" : "en-US",
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
