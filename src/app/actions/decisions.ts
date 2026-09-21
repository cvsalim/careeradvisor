"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

const decisionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  decisionDate: z.string().min(1, "Date is required"),
  description: z.string().optional(),
  rationale: z.string().optional(),
  relatedMeetingId: z.string().optional(),
});

export type DecisionFormState = { error?: string };

export async function createDecision(
  clientId: string,
  _prevState: DecisionFormState,
  formData: FormData,
): Promise<DecisionFormState> {
  const parsed = decisionSchema.safeParse({
    title: formData.get("title"),
    decisionDate: formData.get("decisionDate"),
    description: formData.get("description"),
    rationale: formData.get("rationale"),
    relatedMeetingId: formData.get("relatedMeetingId"),
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
    .from("decisions")
    .insert({
      client_id: clientId,
      title: parsed.data.title,
      decision_date: parsed.data.decisionDate,
      description: parsed.data.description || null,
      rationale: parsed.data.rationale || null,
      related_meeting_id: parsed.data.relatedMeetingId || null,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Could not create decision" };
  }

  await logAudit(supabase, {
    clientId,
    entityType: "decisions",
    entityId: data.id,
    action: "created",
    newValue: parsed.data,
    changedBy: user.id,
  });

  revalidatePath(`/clients/${clientId}/decisions`);
  revalidatePath("/decisions");

  return {};
}

export async function updateDecisionStatus(
  clientId: string,
  decisionId: string,
  status: string,
) {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: before } = await supabase
    .from("decisions")
    .select("status")
    .eq("id", decisionId)
    .single();

  const { error } = await supabase
    .from("decisions")
    .update({ status })
    .eq("id", decisionId);

  if (error) return;

  await logAudit(supabase, {
    clientId,
    entityType: "decisions",
    entityId: decisionId,
    action: "status_changed",
    oldValue: { status: before?.status },
    newValue: { status },
    changedBy: user.id,
  });

  revalidatePath(`/clients/${clientId}/decisions`);
  revalidatePath("/decisions");
}
