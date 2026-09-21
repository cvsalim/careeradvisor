"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

const marketSignalSchema = z.object({
  clientId: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  source: z.string().optional(),
  summary: z.string().optional(),
  tags: z.string().optional(),
  signalDate: z.string().min(1, "Date is required"),
});

export type MarketSignalFormState = { error?: string };

export async function createMarketSignal(
  _prevState: MarketSignalFormState,
  formData: FormData,
): Promise<MarketSignalFormState> {
  const parsed = marketSignalSchema.safeParse({
    clientId: formData.get("clientId") || undefined,
    title: formData.get("title"),
    source: formData.get("source"),
    summary: formData.get("summary"),
    tags: formData.get("tags"),
    signalDate: formData.get("signalDate"),
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
    .from("market_signals")
    .insert({
      client_id: parsed.data.clientId || null,
      title: parsed.data.title,
      source: parsed.data.source || null,
      summary: parsed.data.summary || null,
      tags,
      signal_date: parsed.data.signalDate,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  await logAudit(supabase, {
    clientId: parsed.data.clientId || null,
    entityType: "market_signal",
    entityId: data.id,
    action: "created",
  });

  revalidatePath("/market-signals");
  return {};
}
