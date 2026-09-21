import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Badge } from "@/components/ui/badge";

export default async function ReportsPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();

  const { data: reviews } = await supabase
    .from("monthly_reviews")
    .select("id, review_month, status, client_id, clients(full_name)")
    .order("review_month", { ascending: false });

  const latestByClient = new Map<
    string,
    { review_month: string; status: string; full_name: string }
  >();
  for (const review of reviews ?? []) {
    if (!latestByClient.has(review.client_id)) {
      latestByClient.set(review.client_id, {
        review_month: review.review_month,
        status: review.status,
        full_name: review.clients?.[0]?.full_name ?? "—",
      });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-[28px] text-charcoal">
          {t.monthlyReports.title}
        </h1>
        <p className="font-editorial text-sm text-text-secondary">
          {t.monthlyReports.subtitle}
        </p>
      </div>

      {latestByClient.size === 0 ? (
        <p className="font-editorial text-base text-text-secondary">
          {t.monthlyReports.empty}
        </p>
      ) : (
        <table className="w-full border-collapse font-ui text-[13px]">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.monthlyReports.table.client}
              </th>
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.monthlyReports.table.month}
              </th>
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.monthlyReports.table.status}
              </th>
              <th className="py-2 pr-4" />
            </tr>
          </thead>
          <tbody>
            {Array.from(latestByClient.entries()).map(([clientId, review]) => (
              <tr key={clientId} className="border-b border-border last:border-0">
                <td className="py-2 pr-4 text-text-primary">{review.full_name}</td>
                <td className="py-2 pr-4 text-text-secondary">
                  {new Date(review.review_month).toLocaleDateString(
                    locale === "pt" ? "pt-BR" : "en-US",
                    { year: "numeric", month: "long" },
                  )}
                </td>
                <td className="py-2 pr-4">
                  <Badge tone={review.status === "shared" ? "positive" : review.status === "approved" ? "warning" : "neutral"}>
                    {t.status[review.status as keyof typeof t.status]}
                  </Badge>
                </td>
                <td className="py-2 pr-4">
                  <Link
                    href={`/clients/${clientId}/reports`}
                    className="text-burgundy hover:underline"
                  >
                    {t.monthlyReports.viewButton}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
