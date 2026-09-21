import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { ScoreEntryForm } from "@/components/career-score/score-entry-form";
import { createScoreEntry } from "@/app/actions/career-score";
import { CAREER_SCORE_DIMENSIONS } from "@/lib/career-score";

export default async function ClientCareerScorePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();

  const { data: entries } = await supabase
    .from("career_score_entries")
    .select("id, dimension, score, evidence, justification, next_action, evaluated_at")
    .eq("client_id", id)
    .order("evaluated_at", { ascending: false });

  const boundCreate = createScoreEntry.bind(null, id);

  return (
    <div className="flex flex-col gap-8">
      <p className="font-ui text-[12px] text-text-muted">
        {t.careerScore.disclaimer}
      </p>

      <ScoreEntryForm t={t} action={boundCreate} />

      <div className="flex flex-col gap-6">
        {CAREER_SCORE_DIMENSIONS.map((dimension) => {
          const history = (entries ?? []).filter(
            (entry) => entry.dimension === dimension,
          );
          const latest = history[0];
          const previous = history[1];

          return (
            <div
              key={dimension}
              className="flex flex-col gap-2 rounded-default border border-border bg-surface p-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg text-charcoal">
                  {t.careerScore.dimensions[dimension]}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-2xl text-burgundy">
                    {latest ? latest.score : "—"}
                  </span>
                  {previous && (
                    <span className="font-ui text-[12px] text-text-muted">
                      {t.careerScore.previous}: {previous.score}
                    </span>
                  )}
                </div>
              </div>
              {!latest ? (
                <p className="font-editorial text-base text-text-secondary">
                  {t.careerScore.noEntry}
                </p>
              ) : (
                <>
                  {latest.evidence && (
                    <p className="font-ui text-[13px] text-text-secondary">
                      {t.careerScore.form.evidence}: {latest.evidence}
                    </p>
                  )}
                  {latest.justification && (
                    <p className="font-ui text-[13px] text-text-secondary">
                      {t.careerScore.form.justification}: {latest.justification}
                    </p>
                  )}
                  {latest.next_action && (
                    <p className="font-ui text-[13px] text-text-secondary">
                      {t.careerScore.form.nextAction}: {latest.next_action}
                    </p>
                  )}
                  <p className="font-ui text-[11px] text-text-muted">
                    {new Date(latest.evaluated_at).toLocaleDateString(
                      locale === "pt" ? "pt-BR" : "en-US",
                    )}
                  </p>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
