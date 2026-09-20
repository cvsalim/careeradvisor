import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Badge, STATUS_TONES } from "@/components/ui/badge";

export default async function PositioningIndexPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();

  const [{ data: clients }, { data: versions }] = await Promise.all([
    supabase.from("clients").select("id, full_name").order("full_name"),
    supabase
      .from("positioning_versions")
      .select("client_id, name, status, created_at")
      .order("created_at", { ascending: false }),
  ]);

  const latestByClient = new Map<
    string,
    NonNullable<typeof versions>[number]
  >();
  for (const version of versions ?? []) {
    if (!latestByClient.has(version.client_id)) {
      latestByClient.set(version.client_id, version);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-[28px] text-charcoal">
          {t.positioning.title}
        </h1>
        <p className="font-editorial text-sm text-text-secondary">
          {t.positioning.subtitle}
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
                {t.positioning.table.client}
              </th>
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.positioning.table.activeVersion}
              </th>
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.positioning.table.status}
              </th>
              <th className="py-2 pr-4" />
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => {
              const version = latestByClient.get(client.id);
              return (
                <tr
                  key={client.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="py-2 pr-4 text-text-primary">
                    {client.full_name}
                  </td>
                  <td className="py-2 pr-4 text-text-secondary">
                    {version?.name ?? t.positioning.empty}
                  </td>
                  <td className="py-2 pr-4">
                    {version && (
                      <Badge tone={STATUS_TONES[version.status] ?? "neutral"}>
                        {t.status[version.status as keyof typeof t.status]}
                      </Badge>
                    )}
                  </td>
                  <td className="py-2 pr-4">
                    <Link
                      href={`/clients/${client.id}/positioning`}
                      className="text-burgundy hover:underline"
                    >
                      {t.positioning.viewButton}
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
