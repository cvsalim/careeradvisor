"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

const meetingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  meetingDate: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
  summary: z.string().optional(),
  nextSteps: z.string().optional(),
});

export type MeetingFormState = { error?: string };

export async function createMeeting(
  clientId: string,
  _prevState: MeetingFormState,
  formData: FormData,
): Promise<MeetingFormState> {
  const parsed = meetingSchema.safeParse({
    title: formData.get("title"),
    meetingDate: formData.get("meetingDate"),
    notes: formData.get("notes"),
    summary: formData.get("summary"),
    nextSteps: formData.get("nextSteps"),
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
    .from("meetings")
    .insert({
      client_id: clientId,
      title: parsed.data.title,
      meeting_date: parsed.data.meetingDate,
      notes: parsed.data.notes || null,
      summary: parsed.data.summary || null,
      next_steps: parsed.data.nextSteps || null,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Could not create meeting" };
  }

  await logAudit(supabase, {
    clientId,
    entityType: "meetings",
    entityId: data.id,
    action: "created",
    newValue: parsed.data,
    changedBy: user.id,
  });

  revalidatePath(`/clients/${clientId}/meetings`);
  revalidatePath("/meetings");

  return {};
}
