"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

const strategySchema = z.object({
  futureVision: z.string().optional(),
  mainObjective: z.string().optional(),
  currentSituation: z.string().optional(),
  perceivedPositioning: z.string().optional(),
  desiredSituation: z.string().optional(),
  strategicGaps: z.string().optional(),
  priorities: z.string().optional(),
  plan90Days: z.string().optional(),
  plan12Months: z.string().optional(),
  risksAndObstacles: z.string().optional(),
  decisionCriteria: z.string().optional(),
});

export type StrategyFormState = { error?: string };

function toRow(data: z.infer<typeof strategySchema>) {
  return {
    future_vision: data.futureVision || null,
    main_objective: data.mainObjective || null,
    current_situation: data.currentSituation || null,
    perceived_positioning: data.perceivedPositioning || null,
    desired_situation: data.desiredSituation || null,
    strategic_gaps: data.strategicGaps || null,
    priorities: data.priorities || null,
    plan_90_days: data.plan90Days || null,
    plan_12_months: data.plan12Months || null,
    risks_and_obstacles: data.risksAndObstacles || null,
    decision_criteria: data.decisionCriteria || null,
  };
}

export async function createStrategyVersion(
  clientId: string,
  _prevState: StrategyFormState,
  formData: FormData,
): Promise<StrategyFormState> {
  const parsed = strategySchema.safeParse({
    futureVision: formData.get("futureVision"),
    mainObjective: formData.get("mainObjective"),
    currentSituation: formData.get("currentSituation"),
    perceivedPositioning: formData.get("perceivedPositioning"),
    desiredSituation: formData.get("desiredSituation"),
    strategicGaps: formData.get("strategicGaps"),
    priorities: formData.get("priorities"),
    plan90Days: formData.get("plan90Days"),
    plan12Months: formData.get("plan12Months"),
    risksAndObstacles: formData.get("risksAndObstacles"),
    decisionCriteria: formData.get("decisionCriteria"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: existing } = await supabase
    .from("career_strategies")
    .select("id, version")
    .eq("client_id", clientId)
    .eq("is_current", true)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("career_strategies")
      .update({ is_current: false })
      .eq("id", existing.id);
  }

  const nextVersion = (existing?.version ?? 0) + 1;

  const { data, error } = await supabase
    .from("career_strategies")
    .insert({
      client_id: clientId,
      version: nextVersion,
      ...toRow(parsed.data),
      is_current: true,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Could not create strategy version" };
  }

  await logAudit(supabase, {
    clientId,
    entityType: "career_strategies",
    entityId: data.id,
    action: "created",
    newValue: toRow(parsed.data),
    changedBy: user.id,
  });

  revalidatePath(`/clients/${clientId}/strategy`);
  revalidatePath("/objectives");

  return {};
}

export type GoalFormState = { error?: string };

export async function createGoal(
  strategyId: string,
  clientId: string,
  _prevState: GoalFormState,
  formData: FormData,
): Promise<GoalFormState> {
  const description = (formData.get("description") as string | null)?.trim();
  if (!description) return { error: "Description is required" };
  const isPrimary = formData.get("isPrimary") === "on";

  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("career_goals")
    .insert({
      career_strategy_id: strategyId,
      description,
      is_primary: isPrimary,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Could not create goal" };
  }

  await logAudit(supabase, {
    clientId,
    entityType: "career_goals",
    entityId: data.id,
    action: "created",
    newValue: { description, isPrimary },
    changedBy: user.id,
  });

  revalidatePath(`/clients/${clientId}/strategy`);

  return {};
}

const actionSchema = z.object({
  description: z.string().min(1, "Description is required"),
  responsible: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.enum(["pending", "in_progress", "done", "blocked", "cancelled"]),
  priority: z.enum(["low", "medium", "high"]),
  expectedResult: z.string().optional(),
  actualResult: z.string().optional(),
  notes: z.string().optional(),
});

export type ActionFormState = { error?: string };

export async function createAction(
  strategyId: string,
  clientId: string,
  _prevState: ActionFormState,
  formData: FormData,
): Promise<ActionFormState> {
  const parsed = actionSchema.safeParse({
    description: formData.get("description"),
    responsible: formData.get("responsible"),
    dueDate: formData.get("dueDate"),
    status: formData.get("status") || "pending",
    priority: formData.get("priority") || "medium",
    expectedResult: formData.get("expectedResult"),
    actualResult: formData.get("actualResult"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("career_actions")
    .insert({
      career_strategy_id: strategyId,
      description: parsed.data.description,
      responsible: parsed.data.responsible || null,
      due_date: parsed.data.dueDate || null,
      status: parsed.data.status,
      priority: parsed.data.priority,
      expected_result: parsed.data.expectedResult || null,
      actual_result: parsed.data.actualResult || null,
      notes: parsed.data.notes || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Could not create action" };
  }

  await logAudit(supabase, {
    clientId,
    entityType: "career_actions",
    entityId: data.id,
    action: "created",
    newValue: parsed.data,
    changedBy: user.id,
  });

  revalidatePath(`/clients/${clientId}/strategy`);
  revalidatePath("/priorities");

  return {};
}

export async function updateActionStatus(
  clientId: string,
  actionId: string,
  status: string,
) {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: before } = await supabase
    .from("career_actions")
    .select("status")
    .eq("id", actionId)
    .single();

  const { error } = await supabase
    .from("career_actions")
    .update({ status })
    .eq("id", actionId);

  if (error) return;

  await logAudit(supabase, {
    clientId,
    entityType: "career_actions",
    entityId: actionId,
    action: "status_changed",
    oldValue: { status: before?.status },
    newValue: { status },
    changedBy: user.id,
  });

  revalidatePath(`/clients/${clientId}/strategy`);
  revalidatePath("/priorities");
}
