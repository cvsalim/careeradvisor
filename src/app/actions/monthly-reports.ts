"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

const reviewSchema = z.object({
  reviewMonth: z.string().min(1, "Month is required"),
  summaryText: z.string().optional(),
});

export type MonthlyReviewFormState = { error?: string };

export async function createMonthlyReview(
  clientId: string,
  _prevState: MonthlyReviewFormState,
  formData: FormData,
): Promise<MonthlyReviewFormState> {
  const parsed = reviewSchema.safeParse({
    reviewMonth: formData.get("reviewMonth"),
    summaryText: formData.get("summaryText"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const reviewMonth = `${parsed.data.reviewMonth}-01`;

  const { data, error } = await supabase
    .from("monthly_reviews")
    .upsert(
      {
        client_id: clientId,
        review_month: reviewMonth,
        summary_text: parsed.data.summaryText || null,
        created_by: user.id,
      },
      { onConflict: "client_id,review_month" },
    )
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Could not save report" };
  }

  await logAudit(supabase, {
    clientId,
    entityType: "monthly_reviews",
    entityId: data.id,
    action: "updated",
    newValue: parsed.data,
    changedBy: user.id,
  });

  revalidatePath(`/clients/${clientId}/reports`);
  revalidatePath("/reports");

  return {};
}

export async function updateMonthlyReviewStatus(
  clientId: string,
  reviewId: string,
  status: string,
) {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: before } = await supabase
    .from("monthly_reviews")
    .select("status")
    .eq("id", reviewId)
    .single();

  const { error } = await supabase
    .from("monthly_reviews")
    .update({ status })
    .eq("id", reviewId);

  if (error) return;

  await logAudit(supabase, {
    clientId,
    entityType: "monthly_reviews",
    entityId: reviewId,
    action: "status_changed",
    oldValue: { status: before?.status },
    newValue: { status },
    changedBy: user.id,
  });

  revalidatePath(`/clients/${clientId}/reports`);
  revalidatePath("/reports");
}
