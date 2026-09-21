import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function PortalDecisionsPage() {
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

  const { data: decisions } = await supabase
    .from("decisions")
    .select("id, title, decision_date, description, rationale")
    .eq("client_id", client?.id ?? "")
    .order("decision_date", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-[28px] text-charcoal">
        {t.portal.nav.decisions}
      </h1>

      {!decisions || decisions.length === 0 ? (
        <p className="font-editorial text-base text-text-secondary">
          {t.portal.decisions.empty}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {decisions.map((decision) => (
            <div
              key={decision.id}
              className="flex flex-col gap-2 rounded-default border border-border bg-surface p-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg text-charcoal">
                  {decision.title}
                </h3>
                <span className="font-ui text-[12px] text-text-muted">
                  {new Date(decision.decision_date).toLocaleDateString(
                    locale === "pt" ? "pt-BR" : "en-US",
                  )}
                </span>
              </div>
              {decision.description && (
                <p className="font-editorial text-base text-text-primary">
                  {decision.description}
                </p>
              )}
              {decision.rationale && (
                <p className="font-editorial text-sm text-text-secondary">
                  {decision.rationale}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
