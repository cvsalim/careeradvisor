import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function PortalOverviewPage() {
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

  const [{ data: scores }, { data: reports }] = await Promise.all([
    supabase
      .from("career_score_entries")
      .select("dimension, score, evaluated_at")
      .eq("client_id", client?.id ?? "")
      .order("evaluated_at", { ascending: false }),
    supabase
      .from("monthly_reviews")
      .select("id, review_month")
      .eq("client_id", client?.id ?? "")
      .order("review_month", { ascending: false })
      .limit(1),
  ]);

  const latestByDimension = new Map<string, number>();
  for (const entry of scores ?? []) {
    if (!latestByDimension.has(entry.dimension)) {
      latestByDimension.set(entry.dimension, entry.score);
    }
  }
  const average = latestByDimension.size
    ? Math.round(
        Array.from(latestByDimension.values()).reduce((a, b) => a + b, 0) /
          latestByDimension.size,
      )
    : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-[28px] text-charcoal">
          {t.portal.title}
        </h1>
        <p className="font-editorial text-sm text-text-secondary">
          {t.portal.overview.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-default border border-border bg-surface p-5">
          <p className="font-ui text-[11px] uppercase tracking-[0.06em] text-text-muted">
            {t.portal.nav.careerScore}
          </p>
          <p className="font-display text-3xl text-charcoal">
            {average ?? "—"}
          </p>
        </div>
        <div className="rounded-default border border-border bg-surface p-5">
          <p className="font-ui text-[11px] uppercase tracking-[0.06em] text-text-muted">
            {t.portal.nav.reports}
          </p>
          <p className="font-display text-lg text-charcoal">
            {reports?.[0]
              ? new Date(reports[0].review_month).toLocaleDateString(
                  locale === "pt" ? "pt-BR" : "en-US",
                  { year: "numeric", month: "long" },
                )
              : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
