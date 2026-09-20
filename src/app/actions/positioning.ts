"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

const positioningSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  justification: z.string().optional(),
  targetAudience: z.string().optional(),
  niche: z.string().optional(),
  authorityTerritory: z.string().optional(),
  problemsSolved: z.string().optional(),
  differentiators: z.string().optional(),
  valueProposition: z.string().optional(),
  positioningStatement: z.string().optional(),
  presentationSpeech: z.string().optional(),
  professionalBio: z.string().optional(),
  keyMessages: z.string().optional(),
});

export type PositioningFormState = { error?: string };

export async function createPositioningVersion(
  clientId: string,
  _prevState: PositioningFormState,
  formData: FormData,
): Promise<PositioningFormState> {
  const parsed = positioningSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    justification: formData.get("justification"),
    targetAudience: formData.get("targetAudience"),
    niche: formData.get("niche"),
    authorityTerritory: formData.get("authorityTerritory"),
    problemsSolved: formData.get("problemsSolved"),
    differentiators: formData.get("differentiators"),
    valueProposition: formData.get("valueProposition"),
    positioningStatement: formData.get("positioningStatement"),
    presentationSpeech: formData.get("presentationSpeech"),
    professionalBio: formData.get("professionalBio"),
    keyMessages: formData.get("keyMessages"),
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
    .from("positioning_versions")
    .insert({
      client_id: clientId,
      name: parsed.data.name,
      description: parsed.data.description || null,
      justification: parsed.data.justification || null,
      target_audience: parsed.data.targetAudience || null,
      niche: parsed.data.niche || null,
      authority_territory: parsed.data.authorityTerritory || null,
      problems_solved: parsed.data.problemsSolved || null,
      differentiators: parsed.data.differentiators || null,
      value_proposition: parsed.data.valueProposition || null,
      positioning_statement: parsed.data.positioningStatement || null,
      presentation_speech: parsed.data.presentationSpeech || null,
      professional_bio: parsed.data.professionalBio || null,
      key_messages: parsed.data.keyMessages || null,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Could not create positioning version" };
  }

  await logAudit(supabase, {
    clientId,
    entityType: "positioning_versions",
    entityId: data.id,
    action: "created",
    newValue: parsed.data,
    changedBy: user.id,
  });

  revalidatePath(`/clients/${clientId}/positioning`);
  revalidatePath("/positioning");
  revalidatePath("/career-intelligence");

  return {};
}

export async function updatePositioningStatus(
  clientId: string,
  versionId: string,
  status: string,
) {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: before } = await supabase
    .from("positioning_versions")
    .select("status")
    .eq("id", versionId)
    .single();

  const { error } = await supabase
    .from("positioning_versions")
    .update({ status })
    .eq("id", versionId);

  if (error) return;

  await logAudit(supabase, {
    clientId,
    entityType: "positioning_versions",
    entityId: versionId,
    action: "status_changed",
    oldValue: { status: before?.status },
    newValue: { status },
    changedBy: user.id,
  });

  revalidatePath(`/clients/${clientId}/positioning`);
  revalidatePath("/positioning");
  revalidatePath("/career-intelligence");
}
