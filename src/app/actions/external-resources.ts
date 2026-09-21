"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

const externalResourceSchema = z.object({
  toolName: z.string().min(1, "Tool is required"),
  link: z.string().optional(),
  summary: z.string().optional(),
});

export type ExternalResourceFormState = { error?: string };

export async function createExternalResource(
  clientId: string,
  _prevState: ExternalResourceFormState,
  formData: FormData,
): Promise<ExternalResourceFormState> {
  const parsed = externalResourceSchema.safeParse({
    toolName: formData.get("toolName"),
    link: formData.get("link"),
    summary: formData.get("summary"),
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
    .from("external_resources")
    .insert({
      client_id: clientId,
      tool_name: parsed.data.toolName,
      link: parsed.data.link || null,
      summary: parsed.data.summary || null,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  await logAudit(supabase, {
    clientId,
    entityType: "external_resource",
    entityId: data.id,
    action: "created",
  });

  revalidatePath(`/clients/${clientId}/resources`);
  return {};
}
