import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function ClientAuditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();

  const { data: logs } = await supabase
    .from("audit_logs")
    .select("id, entity_type, action, reason, created_at")
    .eq("client_id", id)
    .order("created_at", { ascending: false });

  if (!logs || logs.length === 0) {
    return (
      <p className="font-editorial text-base text-text-secondary">
        {t.audit.empty}
      </p>
    );
  }

  return (
    <table className="w-full border-collapse font-ui text-[13px]">
      <thead>
        <tr className="border-b border-border text-left">
          <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
            {t.audit.table.date}
          </th>
          <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
            {t.audit.table.entity}
          </th>
          <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
            {t.audit.table.action}
          </th>
          <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
            {t.audit.table.reason}
          </th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => (
          <tr key={log.id} className="border-b border-border last:border-0">
            <td className="py-2 pr-4 text-text-secondary">
              {new Date(log.created_at).toLocaleString(
                locale === "pt" ? "pt-BR" : "en-US",
              )}
            </td>
            <td className="py-2 pr-4 text-text-primary">{log.entity_type}</td>
            <td className="py-2 pr-4 text-text-secondary">
              {t.audit.action[log.action as keyof typeof t.audit.action] ??
                log.action}
            </td>
            <td className="py-2 pr-4 text-text-secondary">
              {log.reason ?? "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
