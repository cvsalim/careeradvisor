"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

const brandBrainSchema = z.object({
  category: z.enum([
    "identity",
    "strategy",
    "audience",
    "differentiation",
    "communication",
    "approved_content",
    "advisor_guidance",
    "context",
  ]),
  content: z.string().min(1, "Content is required"),
  priority: z.enum(["low", "medium", "high"]),
  advisorNote: z.string().optional(),
});

export type BrandBrainFormState = { error?: string };

export async function createBrandBrainItem(
  clientId: string,
  _prevState: BrandBrainFormState,
  formData: FormData,
): Promise<BrandBrainFormState> {
  const parsed = brandBrainSchema.safeParse({
    category: formData.get("category"),
    content: formData.get("content"),
    priority: formData.get("priority") || "medium",
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
    .from("brand_brain_items")
    .insert({
      client_id: clientId,
      category: parsed.data.category,
      content: parsed.data.content,
      priority: parsed.data.priority,
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
    entityType: "brand_brain_items",
    entityId: data.id,
    action: "created",
    newValue: parsed.data,
    changedBy: user.id,
  });

  revalidatePath(`/clients/${clientId}/brand-brain`);
  revalidatePath("/career-intelligence");

  return {};
}

export async function updateBrandBrainItemStatus(
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
    .from("brand_brain_items")
    .select("status")
    .eq("id", itemId)
    .single();

  const { error } = await supabase
    .from("brand_brain_items")
    .update({ status })
    .eq("id", itemId);

  if (error) return;

  await logAudit(supabase, {
    clientId,
    entityType: "brand_brain_items",
    entityId: itemId,
    action: "status_changed",
    oldValue: { status: before?.status },
    newValue: { status },
    changedBy: user.id,
  });

  revalidatePath(`/clients/${clientId}/brand-brain`);
  revalidatePath("/career-intelligence");
}
