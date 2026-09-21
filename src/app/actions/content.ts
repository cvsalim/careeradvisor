"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

const contentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  objective: z.string().optional(),
  pillar: z.string().optional(),
  theme: z.string().optional(),
  format: z.string().optional(),
  channel: z.string().optional(),
  mainMessage: z.string().optional(),
  briefing: z.string().optional(),
  scriptText: z.string().optional(),
  externalLink: z.string().optional(),
  plannedDate: z.string().optional(),
  publishedDate: z.string().optional(),
  result: z.string().optional(),
  learning: z.string().optional(),
});

export type ContentItemFormState = { error?: string };

export async function createContentItem(
  clientId: string,
  _prevState: ContentItemFormState,
  formData: FormData,
): Promise<ContentItemFormState> {
  const parsed = contentSchema.safeParse({
    title: formData.get("title"),
    objective: formData.get("objective"),
    pillar: formData.get("pillar"),
    theme: formData.get("theme"),
    format: formData.get("format"),
    channel: formData.get("channel"),
    mainMessage: formData.get("mainMessage"),
    briefing: formData.get("briefing"),
    scriptText: formData.get("scriptText"),
    externalLink: formData.get("externalLink"),
    plannedDate: formData.get("plannedDate"),
    publishedDate: formData.get("publishedDate"),
    result: formData.get("result"),
    learning: formData.get("learning"),
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
    .from("content_items")
    .insert({
      client_id: clientId,
      title: parsed.data.title,
      objective: parsed.data.objective || null,
      pillar: parsed.data.pillar || null,
      theme: parsed.data.theme || null,
      format: parsed.data.format || null,
      channel: parsed.data.channel || null,
      main_message: parsed.data.mainMessage || null,
      briefing: parsed.data.briefing || null,
      script_text: parsed.data.scriptText || null,
      external_link: parsed.data.externalLink || null,
      planned_date: parsed.data.plannedDate || null,
      published_date: parsed.data.publishedDate || null,
      result: parsed.data.result || null,
      learning: parsed.data.learning || null,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Could not create content item" };
  }

  await logAudit(supabase, {
    clientId,
    entityType: "content_items",
    entityId: data.id,
    action: "created",
    newValue: parsed.data,
    changedBy: user.id,
  });

  revalidatePath(`/clients/${clientId}/content`);
  revalidatePath("/content");

  return {};
}

export async function updateContentItemStatus(
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
    .from("content_items")
    .select("status")
    .eq("id", itemId)
    .single();

  const { error } = await supabase
    .from("content_items")
    .update({ status })
    .eq("id", itemId);

  if (error) return;

  await logAudit(supabase, {
    clientId,
    entityType: "content_items",
    entityId: itemId,
    action: "status_changed",
    oldValue: { status: before?.status },
    newValue: { status },
    changedBy: user.id,
  });

  revalidatePath(`/clients/${clientId}/content`);
  revalidatePath("/content");
}
