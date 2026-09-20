import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { StrategyForm } from "@/components/strategy/strategy-form";
import { GoalForm } from "@/components/strategy/goal-form";
import { ActionForm } from "@/components/strategy/action-form";
import { ActionStatusSelect } from "@/components/strategy/action-status-select";
import {
  createStrategyVersion,
  createGoal,
  createAction,
} from "@/app/actions/strategy";
import { Badge, STATUS_TONES } from "@/components/ui/badge";

export default async function ClientStrategyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();

  const { data: current } = await supabase
    .from("career_strategies")
    .select("*")
    .eq("client_id", id)
    .eq("is_current", true)
    .maybeSingle();

  const { data: history } = await supabase
    .from("career_strategies")
    .select("id, version, main_objective, is_current, created_at")
    .eq("client_id", id)
    .order("version", { ascending: false });

  const [{ data: goals }, { data: actions }] = current
    ? await Promise.all([
        supabase
          .from("career_goals")
          .select("id, description, is_primary")
          .eq("career_strategy_id", current.id)
          .order("created_at", { ascending: true }),
        supabase
          .from("career_actions")
          .select(
            "id, description, responsible, due_date, status, priority",
          )
          .eq("career_strategy_id", current.id)
          .order("due_date", { ascending: true, nullsFirst: false }),
      ])
    : [{ data: [] }, { data: [] }];

  const boundCreateStrategy = createStrategyVersion.bind(null, id);
  const d = t.strategy.detail;

  return (
    <div className="flex flex-col gap-10">
      {current && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="font-ui text-[11px] uppercase tracking-[0.06em] text-text-muted">
              {d.currentVersion} — v{current.version}
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-ui text-[11px] uppercase tracking-[0.06em] text-text-muted">
              {d.goals}
            </h3>
            {goals && goals.length > 0 && (
              <ul className="flex flex-col gap-1">
                {goals.map((goal) => (
                  <li
                    key={goal.id}
                    className="font-editorial text-base text-text-primary"
                  >
                    {goal.is_primary && (
                      <Badge tone="positive">★</Badge>
                    )}{" "}
                    {goal.description}
                  </li>
                ))}
              </ul>
            )}
            <GoalForm t={t} action={createGoal.bind(null, current.id, id)} />
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-ui text-[11px] uppercase tracking-[0.06em] text-text-muted">
              {d.actions}
            </h3>
            {actions && actions.length > 0 && (
              <table className="w-full border-collapse font-ui text-[13px]">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                      {t.strategy.actionForm.description}
                    </th>
                    <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                      {t.strategy.actionForm.responsible}
                    </th>
                    <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                      {t.strategy.actionForm.dueDate}
                    </th>
                    <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                      {t.strategy.actionForm.priority}
                    </th>
                    <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                      {t.strategy.actionForm.status}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {actions.map((action) => (
                    <tr
                      key={action.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="py-2 pr-4 text-text-primary">
                        {action.description}
                      </td>
                      <td className="py-2 pr-4 text-text-secondary">
                        {action.responsible ?? "—"}
                      </td>
                      <td className="py-2 pr-4 text-text-secondary">
                        {action.due_date
                          ? new Date(action.due_date).toLocaleDateString(
                              locale === "pt" ? "pt-BR" : "en-US",
                            )
                          : "—"}
                      </td>
                      <td className="py-2 pr-4">
                        <Badge tone={STATUS_TONES[action.priority] ?? "neutral"}>
                          {t.priority[action.priority as keyof typeof t.priority]}
                        </Badge>
                      </td>
                      <td className="py-2 pr-4">
                        <ActionStatusSelect
                          clientId={id}
                          actionId={action.id}
                          status={action.status}
                          labels={t.status}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <ActionForm t={t} action={createAction.bind(null, current.id, id)} />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h2 className="font-ui text-[11px] uppercase tracking-[0.06em] text-text-muted">
          {current ? d.newVersionButton : t.strategy.empty}
        </h2>
        <StrategyForm t={t} action={boundCreateStrategy} defaultValues={current ?? undefined} />
      </div>

      {history && history.length > 1 && (
        <div className="flex flex-col gap-2">
          <h2 className="font-ui text-[11px] uppercase tracking-[0.06em] text-text-muted">
            {d.versionHistory}
          </h2>
          <ul className="flex flex-col gap-1">
            {history.map((version) => (
              <li
                key={version.id}
                className="font-ui text-[13px] text-text-secondary"
              >
                v{version.version} — {version.main_objective ?? "—"}{" "}
                {version.is_current && <Badge tone="positive">•</Badge>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
