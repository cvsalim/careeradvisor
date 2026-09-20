import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function ProfessionalDnaIndexPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();

  const [{ data: clients }, { data: items }] = await Promise.all([
    supabase.from("clients").select("id, full_name").order("full_name"),
    supabase.from("professional_dna_items").select("client_id, status"),
  ]);

  const counts = new Map<
    string,
    { draft: number; validated: number; rejected: number; archived: number }
  >();
  for (const item of items ?? []) {
    const entry = counts.get(item.client_id) ?? {
      draft: 0,
      validated: 0,
      rejected: 0,
      archived: 0,
    };
    if (item.status in entry) {
      entry[item.status as keyof typeof entry] += 1;
    }
    counts.set(item.client_id, entry);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-[28px] text-charcoal">
          {t.professionalDna.title}
        </h1>
        <p className="font-editorial text-sm text-text-secondary">
          {t.professionalDna.subtitle}
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
                {t.professionalDna.table.client}
              </th>
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.professionalDna.table.draft}
              </th>
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.professionalDna.table.validated}
              </th>
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.professionalDna.table.rejected}
              </th>
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.professionalDna.table.archived}
              </th>
              <th className="py-2 pr-4" />
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => {
              const entry = counts.get(client.id) ?? {
                draft: 0,
                validated: 0,
                rejected: 0,
                archived: 0,
              };
              return (
                <tr
                  key={client.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="py-2 pr-4 text-text-primary">
                    {client.full_name}
                  </td>
                  <td className="py-2 pr-4 text-text-secondary">
                    {entry.draft}
                  </td>
                  <td className="py-2 pr-4 text-text-secondary">
                    {entry.validated}
                  </td>
                  <td className="py-2 pr-4 text-text-secondary">
                    {entry.rejected}
                  </td>
                  <td className="py-2 pr-4 text-text-secondary">
                    {entry.archived}
                  </td>
                  <td className="py-2 pr-4">
                    <Link
                      href={`/clients/${client.id}/professional-dna`}
                      className="text-burgundy hover:underline"
                    >
                      {t.professionalDna.viewButton}
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
