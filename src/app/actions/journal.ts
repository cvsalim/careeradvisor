"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

const journalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  entryDate: z.string().min(1, "Date is required"),
  entryType: z.enum([
    "achievement",
    "feedback",
    "decision",
    "difficulty",
    "learning",
    "objective_change",
    "positioning_change",
    "event",
    "other",
  ]),
  description: z.string().optional(),
  impact: z.string().optional(),
  tags: z.string().optional(),
  visibility: z.enum(["advisor_only", "client_visible"]),
  relatedTo: z.string().optional(),
});

export type JournalFormState = { error?: string };

export async function createJournalEntry(
  clientId: string,
  _prevState: JournalFormState,
  formData: FormData,
): Promise<JournalFormState> {
  const parsed = journalSchema.safeParse({
    title: formData.get("title"),
    entryDate: formData.get("entryDate"),
    entryType: formData.get("entryType"),
    description: formData.get("description"),
    impact: formData.get("impact"),
    tags: formData.get("tags"),
    visibility: formData.get("visibility") || "advisor_only",
    relatedTo: formData.get("relatedTo"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const tags = parsed.data.tags
    ? parsed.data.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
    : [];

  const { data, error } = await supabase
    .from("career_journal_entries")
    .insert({
      client_id: clientId,
      title: parsed.data.title,
      entry_date: parsed.data.entryDate,
      entry_type: parsed.data.entryType,
      description: parsed.data.description || null,
      impact: parsed.data.impact || null,
      tags,
      visibility: parsed.data.visibility,
      related_to: parsed.data.relatedTo || null,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Could not create entry" };
  }

  await logAudit(supabase, {
    clientId,
    entityType: "career_journal_entries",
    entityId: data.id,
    action: "created",
    newValue: parsed.data,
    changedBy: user.id,
  });

  revalidatePath(`/clients/${clientId}/journal`);

  return {};
}
