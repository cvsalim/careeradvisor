"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

const clientSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.union([z.literal(""), z.string().email()]).optional(),
  phone: z.string().optional(),
  roleTitle: z.string().optional(),
  company: z.string().optional(),
  segment: z.string().optional(),
  city: z.string().optional(),
  website: z.string().optional(),
  relationshipStatus: z.enum(["onboarding", "active", "paused", "ended"]),
  startDate: z.string().optional(),
  mainObjective: z.string().optional(),
  currentChallenges: z.string().optional(),
  notes: z.string().optional(),
});

export type ClientFormState = {
  error?: string;
};

function parseFormData(formData: FormData) {
  return clientSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    roleTitle: formData.get("roleTitle"),
    company: formData.get("company"),
    segment: formData.get("segment"),
    city: formData.get("city"),
    website: formData.get("website"),
    relationshipStatus: formData.get("relationshipStatus"),
    startDate: formData.get("startDate"),
    mainObjective: formData.get("mainObjective"),
    currentChallenges: formData.get("currentChallenges"),
    notes: formData.get("notes"),
  });
}

function toRow(data: z.infer<typeof clientSchema>) {
  return {
    full_name: data.fullName,
    email: data.email || null,
    phone: data.phone || null,
    role_title: data.roleTitle || null,
    company: data.company || null,
    segment: data.segment || null,
    city: data.city || null,
    website: data.website || null,
    relationship_status: data.relationshipStatus,
    start_date: data.startDate || null,
    main_objective: data.mainObjective || null,
    current_challenges: data.currentChallenges || null,
    notes: data.notes || null,
  };
}

export async function createClientRecord(
  _prevState: ClientFormState,
  formData: FormData,
): Promise<ClientFormState> {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("clients")
    .insert({ ...toRow(parsed.data), owner_id: user.id, created_by: user.id })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Could not create client" };
  }

  await logAudit(supabase, {
    clientId: data.id,
    entityType: "clients",
    entityId: data.id,
    action: "created",
    newValue: toRow(parsed.data),
    changedBy: user.id,
  });

  revalidatePath("/clients");
  redirect(`/clients/${data.id}`);
}

export async function updateClientRecord(
  clientId: string,
  _prevState: ClientFormState,
  formData: FormData,
): Promise<ClientFormState> {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: before } = await supabase
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .single();

  const { error } = await supabase
    .from("clients")
    .update(toRow(parsed.data))
    .eq("id", clientId);

  if (error) {
    return { error: error.message };
  }

  await logAudit(supabase, {
    clientId,
    entityType: "clients",
    entityId: clientId,
    action: "updated",
    oldValue: before,
    newValue: toRow(parsed.data),
    changedBy: user.id,
  });

  revalidatePath(`/clients/${clientId}`);
  revalidatePath("/clients");
  redirect(`/clients/${clientId}`);
}
