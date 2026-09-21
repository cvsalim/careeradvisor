import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { DecisionForm } from "@/components/decisions/decision-form";
import { DecisionStatusSelect } from "@/components/decisions/decision-status-select";
import { createDecision } from "@/app/actions/decisions";

export default async function ClientDecisionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();

  const [{ data: decisions }, { data: meetings }] = await Promise.all([
    supabase
      .from("decisions")
      .select(
        "id, title, decision_date, description, rationale, status, related_meeting_id, meetings(title)",
      )
      .eq("client_id", id)
      .order("decision_date", { ascending: false }),
    supabase
      .from("meetings")
      .select("id, title")
      .eq("client_id", id)
      .order("meeting_date", { ascending: false }),
  ]);

  const boundCreate = createDecision.bind(null, id);

  return (
    <div className="flex flex-col gap-8">
      <DecisionForm t={t} action={boundCreate} meetings={meetings ?? []} />

      {!decisions || decisions.length === 0 ? (
        <p className="font-editorial text-base text-text-secondary">
          {t.decisions.empty}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {decisions.map((decision) => (
            <div
              key={decision.id}
              className="flex flex-col gap-2 rounded-default border border-border bg-surface p-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg text-charcoal">
                  {decision.title}
                </h3>
                <span className="font-ui text-[12px] text-text-muted">
                  {new Date(decision.decision_date).toLocaleDateString(
                    locale === "pt" ? "pt-BR" : "en-US",
                  )}
                </span>
              </div>
              {decision.description && (
                <p className="font-editorial text-base text-text-primary">
                  {decision.description}
                </p>
              )}
              {decision.rationale && (
                <p className="font-ui text-[13px] text-text-secondary">
                  {t.decisions.form.rationale}: {decision.rationale}
                </p>
              )}
              {decision.meetings?.[0]?.title && (
                <p className="font-ui text-[13px] text-text-secondary">
                  {t.decisions.form.relatedMeeting}: {decision.meetings[0].title}
                </p>
              )}
              <DecisionStatusSelect
                clientId={id}
                decisionId={decision.id}
                status={decision.status}
                labels={{
                  proposed: t.status.proposed,
                  approved: t.status.approved,
                  rejected: t.status.rejected,
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
