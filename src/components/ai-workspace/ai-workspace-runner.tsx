"use client";

import { useActionState, useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { getDictionary } from "@/lib/i18n/dictionaries";
import { runAiTask, saveAiResultToBrandBrain } from "@/app/actions/ai-workspace";

type Dictionary = ReturnType<typeof getDictionary>;

export function AiWorkspaceRunner({
  t,
  clientId,
  taskKey,
  requiresInput,
  contextText,
}: {
  t: Dictionary;
  clientId: string;
  taskKey: string;
  requiresInput: boolean;
  contextText: string;
}) {
  const action = runAiTask.bind(null, clientId, taskKey);
  const [state, formAction, isPending] = useActionState(action, {});
  const [isSaving, startSaving] = useTransition();
  const [saved, setSaved] = useState(false);

  const errorMessage =
    state.error === "not_configured"
      ? t.aiWorkspace.notConfiguredError
      : state.error === "generic"
        ? t.aiWorkspace.genericError
        : state.error;

  return (
    <div className="flex flex-col gap-4 rounded-default border border-border bg-surface p-5">
      <details className="font-ui text-[13px] text-text-secondary">
        <summary className="cursor-pointer text-text-primary">
          {t.aiWorkspace.contextPreviewLabel}
        </summary>
        <pre className="mt-2 whitespace-pre-wrap rounded-default bg-surface-secondary p-3 text-[12px]">
          {contextText}
        </pre>
      </details>

      <form action={formAction} className="flex flex-col gap-3">
        <div>
          <Label htmlFor="advisorInput">{t.aiWorkspace.instructionsLabel}</Label>
          <Textarea
            id="advisorInput"
            name="advisorInput"
            placeholder={t.aiWorkspace.instructionsPlaceholder}
            required={requiresInput}
          />
        </div>

        {errorMessage && (
          <p className="font-ui text-[13px] text-burgundy">{errorMessage}</p>
        )}

        <div>
          <Button type="submit" disabled={isPending}>
            {isPending ? t.aiWorkspace.generating : t.aiWorkspace.generateButton}
          </Button>
        </div>
      </form>

      {state.result && (
        <div className="flex flex-col gap-2">
          <h3 className="font-ui text-[11px] uppercase tracking-[0.06em] text-text-muted">
            {t.aiWorkspace.resultLabel}
          </h3>
          <pre className="whitespace-pre-wrap rounded-default bg-surface-secondary p-4 font-ui text-[13px] text-text-primary">
            {state.result}
          </pre>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={isSaving || saved}
              onClick={() => {
                if (!state.executionId) return;
                startSaving(async () => {
                  await saveAiResultToBrandBrain(clientId, state.executionId!);
                  setSaved(true);
                });
              }}
            >
              {saved ? t.aiWorkspace.savedLabel : t.aiWorkspace.saveButton}
            </Button>
            {taskKey === "monthly_report" && state.executionId && (
              <a
                href={`/clients/${clientId}/reports?draft=${state.executionId}`}
                className="inline-flex items-center rounded-default border border-border px-3 py-1.5 font-ui text-[13px] text-text-secondary hover:border-burgundy/50"
              >
                {t.monthlyReports.useAiDraft}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
