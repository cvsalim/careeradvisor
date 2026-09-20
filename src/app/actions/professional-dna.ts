"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

const dnaItemSchema = z.object({
  category: z.enum([
    "education",
    "skill",
    "achievement",
    "value",
    "growth",
    "evidence",
  ]),
  content: z.string().min(1, "Content is required"),
  source: z
    .enum(["interview", "document", "observation", "client_statement"])
    .optional(),
  advisorNote: z.string().optional(),
});

export type DnaItemFormState = {
  error?: string;
};

export async function createDnaItem(
  clientId: string,
  _prevState: DnaItemFormState,
  formData: FormData,
): Promise<DnaItemFormState> {
  const parsed = dnaItemSchema.safeParse({
    category: formData.get("category"),
    content: formData.get("content"),
    source: formData.get("source") || undefined,
    advisorNote: formData.get("advisorNote"),
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
    .from("professional_dna_items")
    .insert({
      client_id: clientId,
      category: parsed.data.category,
      content: parsed.data.content,
      source: parsed.data.source || null,
      advisor_note: parsed.data.advisorNote || null,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Could not create item" };
  }

  await logAudit(supabase, {
    clientId,
    entityType: "professional_dna_items",
    entityId: data.id,
    action: "created",
    newValue: parsed.data,
    changedBy: user.id,
  });

  revalidatePath(`/clients/${clientId}/professional-dna`);
  revalidatePath("/professional-dna");

  return {};
}

export async function updateDnaItemStatus(
  clientId: string,
  itemId: string,
  status: string,
) {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: before } = await supabase
    .from("professional_dna_items")
    .select("status")
    .eq("id", itemId)
    .single();

  const { error } = await supabase
    .from("professional_dna_items")
    .update({ status })
    .eq("id", itemId);

  if (error) return;

  await logAudit(supabase, {
    clientId,
    entityType: "professional_dna_items",
    entityId: itemId,
    action: "status_changed",
    oldValue: { status: before?.status },
    newValue: { status },
    changedBy: user.id,
  });

  revalidatePath(`/clients/${clientId}/professional-dna`);
  revalidatePath("/professional-dna");
}
