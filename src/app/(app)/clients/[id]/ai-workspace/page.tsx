import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { assembleContext } from "@/lib/ai/context";
import { getTaskTemplate } from "@/lib/ai/task-templates";
import { TaskPicker } from "@/components/ai-workspace/task-picker";
import { AiWorkspaceRunner } from "@/components/ai-workspace/ai-workspace-runner";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function ClientAiWorkspacePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ task?: string }>;
}) {
  const { id } = await params;
  const { task } = await searchParams;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();

  const template = task ? getTaskTemplate(task) : undefined;

  const [{ data: executions }] = await Promise.all([
    supabase
      .from("ai_executions")
      .select("id, task_label, status, saved_to, created_at")
      .eq("client_id", id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const contextPreview = template
    ? await assembleContext(id, template.blocks)
    : null;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-[28px] text-charcoal">
          {t.aiWorkspace.title}
        </h1>
        <p className="font-editorial text-sm text-text-secondary">
          {t.aiWorkspace.subtitle}
        </p>
      </div>

      <TaskPicker t={t} clientId={id} selectedTask={task} />

      {template && contextPreview && (
        <AiWorkspaceRunner
          t={t}
          clientId={id}
          taskKey={template.key}
          requiresInput={template.requiresInput}
          contextText={contextPreview.contextText}
        />
      )}

      <div className="flex flex-col gap-3">
        <h2 className="font-ui text-[11px] uppercase tracking-[0.06em] text-text-muted">
          {t.aiWorkspace.historyLabel}
        </h2>
        {!executions || executions.length === 0 ? (
          <p className="font-editorial text-base text-text-secondary">
            {t.aiWorkspace.historyEmpty}
          </p>
        ) : (
          <table className="w-full border-collapse font-ui text-[13px]">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                  {t.aiWorkspace.table.date}
                </th>
                <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                  {t.aiWorkspace.table.task}
                </th>
                <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                  {t.aiWorkspace.table.status}
                </th>
                <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                  {t.aiWorkspace.table.saved}
                </th>
                <th className="py-2 pr-4" />
              </tr>
            </thead>
            <tbody>
              {executions.map((execution) => {
                const labelKey = execution.task_label as keyof typeof t.aiWorkspace.tasks;
                return (
                  <tr
                    key={execution.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="py-2 pr-4 text-text-secondary">
                      {new Date(execution.created_at).toLocaleDateString(
                        locale === "pt" ? "pt-BR" : "en-US",
                      )}
                    </td>
                    <td className="py-2 pr-4 text-text-primary">
                      {t.aiWorkspace.tasks[labelKey] ?? execution.task_label}
                    </td>
                    <td className="py-2 pr-4">
                      <Badge tone={execution.status === "completed" ? "positive" : "negative"}>
                        {execution.status}
                      </Badge>
                    </td>
                    <td className="py-2 pr-4 text-text-secondary">
                      {execution.saved_to ? "✓" : "—"}
                    </td>
                    <td className="py-2 pr-4">
                      <Link
                        href={`/clients/${id}/ai-workspace/${execution.id}`}
                        className="text-burgundy hover:underline"
                      >
                        {t.common.viewDetails}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
