import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function getSetting(key: string): Promise<string | null> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  return data?.value ?? null;
}

export async function setSetting(
  key: string,
  value: string,
  updatedBy?: string | null,
) {
  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("app_settings").upsert({
    key,
    value,
    updated_at: new Date().toISOString(),
    updated_by: updatedBy ?? null,
  });

  if (error) throw new Error(error.message);
}
