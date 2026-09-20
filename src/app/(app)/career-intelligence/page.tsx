import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function CareerIntelligenceIndexPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();

  const [
    { data: clients },
    { data: dnaItems },
    { data: positioningVersions },
    { data: brandBrainItems },
    { data: skillVersions },
  ] = await Promise.all([
    supabase.from("clients").select("id, full_name").order("full_name"),
    supabase
      .from("professional_dna_items")
      .select("client_id, status")
      .eq("status", "validated"),
    supabase
      .from("positioning_versions")
      .select("client_id, status, created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false }),
    supabase
      .from("brand_brain_items")
      .select("client_id, status")
      .eq("status", "approved"),
    supabase
      .from("client_skill_versions")
      .select("client_id, created_at")
      .order("created_at", { ascending: false }),
  ]);

  const dnaCounts = new Map<string, number>();
  for (const item of dnaItems ?? []) {
    dnaCounts.set(item.client_id, (dnaCounts.get(item.client_id) ?? 0) + 1);
  }

  const approvedPositioning = new Set(
    (positioningVersions ?? []).map((version) => version.client_id),
  );

  const brandBrainCounts = new Map<string, number>();
  for (const item of brandBrainItems ?? []) {
    brandBrainCounts.set(
      item.client_id,
      (brandBrainCounts.get(item.client_id) ?? 0) + 1,
    );
  }

  const lastSkillByClient = new Map<string, string>();
  for (const version of skillVersions ?? []) {
    if (!lastSkillByClient.has(version.client_id)) {
      lastSkillByClient.set(version.client_id, version.created_at);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-[28px] text-charcoal">
          {t.careerIntelligence.title}
        </h1>
        <p className="font-editorial text-sm text-text-secondary">
          {t.careerIntelligence.subtitle}
        </p>
      </div>

      {!clients || clients.length === 0 ? (
        <p className="font-editorial text-base text-text-secondary">
          {t.clients.empty}
        </p>
      ) : (
        <table className="w-full border-collapse font-ui text-[13px]">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.careerIntelligence.table.client}
              </th>
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.careerIntelligence.table.dna}
              </th>
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.careerIntelligence.table.positioning}
              </th>
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.careerIntelligence.table.brandBrain}
              </th>
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.careerIntelligence.table.clientSkill}
              </th>
              <th className="py-2 pr-4" />
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => {
              const lastSkill = lastSkillByClient.get(client.id);
              return (
                <tr
                  key={client.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="py-2 pr-4 text-text-primary">
                    {client.full_name}
                  </td>
                  <td className="py-2 pr-4 text-text-secondary">
                    {dnaCounts.get(client.id) ?? 0}
                  </td>
                  <td className="py-2 pr-4 text-text-secondary">
                    {approvedPositioning.has(client.id) ? "✓" : "—"}
                  </td>
                  <td className="py-2 pr-4 text-text-secondary">
                    {brandBrainCounts.get(client.id) ?? 0}
                  </td>
                  <td className="py-2 pr-4 text-text-secondary">
                    {lastSkill
                      ? new Date(lastSkill).toLocaleDateString(
                          locale === "pt" ? "pt-BR" : "en-US",
                        )
                      : "—"}
                  </td>
                  <td className="py-2 pr-4">
                    <Link
                      href={`/clients/${client.id}/brand-brain`}
                      className="text-burgundy hover:underline"
                    >
                      {t.careerIntelligence.viewButton}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
