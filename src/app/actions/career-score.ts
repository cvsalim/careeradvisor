"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { CAREER_SCORE_DIMENSIONS } from "@/lib/career-score";

const scoreSchema = z.object({
  dimension: z.enum(CAREER_SCORE_DIMENSIONS),
  score: z.coerce.number().int().min(0).max(100),
  evidence: z.string().optional(),
  justification: z.string().optional(),
  nextAction: z.string().optional(),
});

export type ScoreEntryFormState = { error?: string };

export async function createScoreEntry(
  clientId: string,
  _prevState: ScoreEntryFormState,
  formData: FormData,
): Promise<ScoreEntryFormState> {
  const parsed = scoreSchema.safeParse({
    dimension: formData.get("dimension"),
    score: formData.get("score"),
    evidence: formData.get("evidence"),
    justification: formData.get("justification"),
    nextAction: formData.get("nextAction"),
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
    .from("career_score_entries")
    .insert({
      client_id: clientId,
      dimension: parsed.data.dimension,
      score: parsed.data.score,
      evidence: parsed.data.evidence || null,
      justification: parsed.data.justification || null,
      next_action: parsed.data.nextAction || null,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Could not save evaluation" };
  }

  await logAudit(supabase, {
    clientId,
    entityType: "career_score_entries",
    entityId: data.id,
    action: "created",
    newValue: parsed.data,
    changedBy: user.id,
  });

  revalidatePath(`/clients/${clientId}/career-score`);
  revalidatePath("/career-score");

  return {};
}
