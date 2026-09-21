import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function PortalReportsPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: client } = await supabase
    .from("clients")
    .select("id")
    .eq("portal_user_id", user!.id)
    .single();

  const { data: reviews } = await supabase
    .from("monthly_reviews")
    .select("id, review_month, summary_text")
    .eq("client_id", client?.id ?? "")
    .order("review_month", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-[28px] text-charcoal">
        {t.portal.nav.reports}
      </h1>

      {!reviews || reviews.length === 0 ? (
        <p className="font-editorial text-base text-text-secondary">
          {t.portal.reports.empty}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex flex-col gap-2 rounded-default border border-border bg-surface p-4"
            >
              <h3 className="font-display text-lg text-charcoal">
                {new Date(review.review_month).toLocaleDateString(
                  locale === "pt" ? "pt-BR" : "en-US",
                  { year: "numeric", month: "long" },
                )}
              </h3>
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
