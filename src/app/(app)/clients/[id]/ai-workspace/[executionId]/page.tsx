import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function AiExecutionDetailPage({
  params,
}: {
  params: Promise<{ id: string; executionId: string }>;
}) {
  const { executionId } = await params;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();

  const { data: execution } = await supabase
    .from("ai_executions")
    .select(
      "task_label, system_prompt, user_prompt, result, context_blocks, status, error_message, created_at",
    )
    .eq("id", executionId)
    .single();

  if (!execution) notFound();

  const labelKey = execution.task_label as keyof typeof t.aiWorkspace.tasks;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-[28px] text-charcoal">
          {t.aiWorkspace.tasks[labelKey] ?? execution.task_label}
        </h1>
        <p className="font-ui text-[13px] text-text-muted">
          {new Date(execution.created_at).toLocaleString(
            locale === "pt" ? "pt-BR" : "en-US",
          )}
        </p>
      </div>

      {Array.isArray(execution.context_blocks) && execution.context_blocks.length > 0 && (
        <div className="flex flex-col gap-1">
          <h2 className="font-ui text-[11px] uppercase tracking-[0.06em] text-text-muted">
            {t.aiWorkspace.detail.contextBlocksUsed}
          </h2>
          <p className="font-ui text-[13px] text-text-secondary">
            {(execution.context_blocks as string[]).join(", ")}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <h2 className="font-ui text-[11px] uppercase tracking-[0.06em] text-text-muted">
          {t.aiWorkspace.detail.systemPrompt}
        </h2>
        <pre className="whitespace-pre-wrap rounded-default bg-surface-secondary p-4 font-ui text-[12px] text-text-primary">
          {execution.system_prompt}
        </pre>
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="font-ui text-[11px] uppercase tracking-[0.06em] text-text-muted">
          {t.aiWorkspace.detail.userPrompt}
        </h2>
        <pre className="whitespace-pre-wrap rounded-default bg-surface-secondary p-4 font-ui text-[12px] text-text-primary">
          {execution.user_prompt}
        </pre>
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="font-ui text-[11px] uppercase tracking-[0.06em] text-text-muted">
          {t.aiWorkspace.detail.result}
        </h2>
        <pre className="whitespace-pre-wrap rounded-default bg-surface-secondary p-4 font-ui text-[12px] text-text-primary">
          {execution.result ?? execution.error_message ?? "—"}
        </pre>
      </div>
    </div>
  );
}
