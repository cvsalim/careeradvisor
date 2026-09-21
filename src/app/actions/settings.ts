"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { setSetting, getSetting } from "@/lib/settings";
import { logAudit } from "@/lib/audit";

const settingsSchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
});

export type SettingsFormState = { error?: string };

export async function updateOpenAiKey(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const parsed = settingsSchema.safeParse({ apiKey: formData.get("apiKey") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  await setSetting("openai_api_key", parsed.data.apiKey, user.id);

  await logAudit(supabase, {
    entityType: "app_settings",
    entityId: user.id,
    action: "updated",
    newValue: { key: "openai_api_key" },
    changedBy: user.id,
  });

  revalidatePath("/settings");
  return {};
}

export async function getOpenAiKeyStatus(): Promise<{
  configured: boolean;
  maskedKey?: string;
}> {
  const apiKey = await getSetting("openai_api_key");
  if (!apiKey) return { configured: false };
  return { configured: true, maskedKey: `•••• ${apiKey.slice(-4)}` };
}
