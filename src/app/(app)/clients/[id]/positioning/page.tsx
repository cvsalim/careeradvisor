import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { PositioningForm } from "@/components/positioning/positioning-form";
import { PositioningStatusSelect } from "@/components/positioning/positioning-status-select";
import { createPositioningVersion } from "@/app/actions/positioning";
import { Badge, STATUS_TONES } from "@/components/ui/badge";

export default async function ClientPositioningPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();

  const { data: versions } = await supabase
    .from("positioning_versions")
    .select(
      "id, name, description, status, positioning_statement, professional_bio, created_at",
    )
    .eq("client_id", id)
    .order("created_at", { ascending: false });

  const boundCreate = createPositioningVersion.bind(null, id);
  const d = t.positioning.detail;

  return (
    <div className="flex flex-col gap-8">
      {!versions || versions.length === 0 ? (
        <p className="font-editorial text-base text-text-secondary">
          {t.positioning.empty}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          <h2 className="font-ui text-[11px] uppercase tracking-[0.06em] text-text-muted">
            {d.versions}
          </h2>
          {versions.map((version) => (
            <div
              key={version.id}
              className="flex flex-col gap-2 rounded-default border border-border bg-surface p-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg text-charcoal">
                  {version.name}
                </h3>
                <Badge tone={STATUS_TONES[version.status] ?? "neutral"}>
                  {t.status[version.status as keyof typeof t.status]}
                </Badge>
              </div>
              {version.description && (
                <p className="font-editorial text-base text-text-secondary">
                  {version.description}
                </p>
              )}
              {version.positioning_statement && (
                <p className="font-ui text-[13px] italic text-text-primary">
                  “{version.positioning_statement}”
                </p>
              )}
              <PositioningStatusSelect
                clientId={id}
                versionId={version.id}
                status={version.status}
                labels={t.status}
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h2 className="font-ui text-[11px] uppercase tracking-[0.06em] text-text-muted">
          {d.newVersionButton}
        </h2>
        <PositioningForm t={t} action={boundCreate} />
      </div>
    </div>
  );
}
