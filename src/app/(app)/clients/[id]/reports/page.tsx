import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { MonthlyReviewForm } from "@/components/monthly-reports/monthly-review-form";
import { MonthlyReviewStatusSelect } from "@/components/monthly-reports/monthly-review-status-select";
import { createMonthlyReview } from "@/app/actions/monthly-reports";

export default async function ClientReportsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ draft?: string }>;
}) {
  const { id } = await params;
  const { draft } = await searchParams;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();

  const [{ data: reviews }, draftExecution] = await Promise.all([
    supabase
      .from("monthly_reviews")
      .select("id, review_month, summary_text, status")
      .eq("client_id", id)
      .order("review_month", { ascending: false }),
    draft
      ? supabase
          .from("ai_executions")
          .select("result")
          .eq("id", draft)
          .eq("client_id", id)
          .maybeSingle()
          .then((res) => res.data)
      : Promise.resolve(null),
  ]);

  const boundCreate = createMonthlyReview.bind(null, id);
  const currentMonth = new Date().toISOString().slice(0, 7);

  return (
    <div className="flex flex-col gap-8">
      <MonthlyReviewForm
        t={t}
        action={boundCreate}
        defaultMonth={currentMonth}
        defaultSummary={draftExecution?.result ?? undefined}
      />

      {!reviews || reviews.length === 0 ? (
        <p className="font-editorial text-base text-text-secondary">
          {t.monthlyReports.empty}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex flex-col gap-2 rounded-default border border-border bg-surface p-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg text-charcoal">
                  {new Date(review.review_month).toLocaleDateString(
                    locale === "pt" ? "pt-BR" : "en-US",
                    { year: "numeric", month: "long" },
                  )}
                </h3>
                <MonthlyReviewStatusSelect
                  clientId={id}
                  reviewId={review.id}
                  status={review.status}
                  labels={{
                    draft: t.status.draft,
                    approved: t.status.approved,
                    shared: t.status.shared,
                  }}
                />
              </div>
              {review.summary_text && (
                <pre className="whitespace-pre-wrap font-editorial text-base text-text-primary">
                  {review.summary_text}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
