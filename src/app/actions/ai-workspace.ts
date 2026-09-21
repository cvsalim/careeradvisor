"use server";

import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { assembleContext } from "@/lib/ai/context";
import { buildPrompt } from "@/lib/ai/prompt";
import { getTaskTemplate, TASK_LABEL_KEYS } from "@/lib/ai/task-templates";
import { getAiProvider, AiNotConfiguredError } from "@/lib/ai";

export type RunAiTaskState = {
  result?: string;
  executionId?: string;
  error?: string;
};

export async function runAiTask(
  clientId: string,
  taskKey: string,
  _prevState: RunAiTaskState,
  formData: FormData,
): Promise<RunAiTaskState> {
  const template = getTaskTemplate(taskKey);
  if (!template) {
    return { error: "Unknown task type" };
  }

  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const advisorInput = String(formData.get("advisorInput") ?? "").trim();
  if (template.requiresInput && !advisorInput) {
    return { error: "This task requires input from the advisor" };
  }

  const { blocksUsed, contextText } = await assembleContext(
    clientId,
    template.blocks,
  );
  const { systemPrompt, userPrompt } = buildPrompt({
    template,
    contextText,
    advisorInput,
  });

  try {
    const provider = await getAiProvider();
    const { text } = await provider.generateCompletion({
      systemPrompt,
      userPrompt,
    });

    const { data, error } = await supabase
      .from("ai_executions")
      .insert({
        client_id: clientId,
        task_key: taskKey,
        task_label: TASK_LABEL_KEYS[template.key],
        context_blocks: blocksUsed,
        system_prompt: systemPrompt,
        user_prompt: userPrompt,
        result: text,
        status: "completed",
        created_by: user.id,
      })
      .select("id")
      .single();

    if (error || !data) {
      return { error: "Could not save the execution" };
    }

    await logAudit(supabase, {
      clientId,
      entityType: "ai_executions",
      entityId: data.id,
      action: "created",
      changedBy: user.id,
    });

    revalidatePath(`/clients/${clientId}/ai-workspace`);

    return { result: text, executionId: data.id };
  } catch (err) {
    const isNotConfigured = err instanceof AiNotConfiguredError;

    await supabase.from("ai_executions").insert({
      client_id: clientId,
      task_key: taskKey,
      task_label: TASK_LABEL_KEYS[template.key],
      context_blocks: blocksUsed,
      system_prompt: systemPrompt,
      user_prompt: userPrompt,
      status: "failed",
      error_message: isNotConfigured
        ? "AI provider not configured"
        : String(err),
      created_by: user.id,
    });

    revalidatePath(`/clients/${clientId}/ai-workspace`);

    return {
      error: isNotConfigured ? "not_configured" : "generic",
    };
  }
}

export async function saveAiResultToBrandBrain(
  clientId: string,
  executionId: string,
) {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: execution } = await supabase
    .from("ai_executions")
    .select("result, task_key")
    .eq("id", executionId)
    .single();

  if (!execution?.result) return;

  const { data: brandBrainItem, error } = await supabase
    .from("brand_brain_items")
    .insert({
      client_id: clientId,
      category: "advisor_guidance",
      content: execution.result,
      status: "draft",
      priority: "medium",
      advisor_note: `Generated via AI Workspace — ${execution.task_key}`,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !brandBrainItem) return;

  await supabase
    .from("ai_executions")
    .update({ saved_to: { table: "brand_brain_items", id: brandBrainItem.id } })
    .eq("id", executionId);

  await logAudit(supabase, {
    clientId,
    entityType: "brand_brain_items",
    entityId: brandBrainItem.id,
    action: "created",
    reason: "Saved from AI Workspace",
    changedBy: user.id,
  });

  revalidatePath(`/clients/${clientId}/brand-brain`);
  revalidatePath(`/clients/${clientId}/ai-workspace`);
}
