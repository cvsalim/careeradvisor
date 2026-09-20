import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Badge, STATUS_TONES } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export default async function ClientsPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();

  const { data: clients } = await supabase
    .from("clients")
    .select("id, full_name, company, segment, relationship_status, start_date")
    .order("full_name");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[28px] text-charcoal">
            {t.clients.title}
          </h1>
          <p className="font-editorial text-sm text-text-secondary">
            {t.clients.subtitle}
          </p>
        </div>
        <Link href="/clients/new" className={buttonVariants("primary")}>
          {t.clients.newClient}
        </Link>
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
                {t.clients.table.name}
              </th>
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.clients.table.company}
              </th>
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.clients.table.segment}
              </th>
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.clients.table.status}
              </th>
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.clients.table.startDate}
              </th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr
                key={client.id}
                className="border-b border-border last:border-0 hover:bg-surface-secondary"
              >
                <td className="py-2 pr-4">
                  <Link
                    href={`/clients/${client.id}`}
                    className="text-text-primary hover:text-burgundy"
                  >
                    {client.full_name}
                  </Link>
                </td>
                <td className="py-2 pr-4 text-text-secondary">
                  {client.company ?? "—"}
                </td>
                <td className="py-2 pr-4 text-text-secondary">
                  {client.segment ?? "—"}
                </td>
                <td className="py-2 pr-4">
                  <Badge
                    tone={STATUS_TONES[client.relationship_status] ?? "neutral"}
                  >
                    {t.status[
                      client.relationship_status as keyof typeof t.status
                    ] ?? client.relationship_status}
                  </Badge>
                </td>
                <td className="py-2 pr-4 text-text-secondary">
                  {client.start_date
                    ? new Date(client.start_date).toLocaleDateString(
                        locale === "pt" ? "pt-BR" : "en-US",
                      )
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
