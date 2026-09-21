import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function MeetingsPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();

  const { data: meetings } = await supabase
    .from("meetings")
    .select("id, title, meeting_date, client_id, clients(full_name)")
    .order("meeting_date", { ascending: false })
    .limit(50);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-[28px] text-charcoal">
          {t.meetings.title}
        </h1>
        <p className="font-editorial text-sm text-text-secondary">
          {t.meetings.subtitle}
        </p>
      </div>

      {!meetings || meetings.length === 0 ? (
        <p className="font-editorial text-base text-text-secondary">
          {t.meetings.empty}
        </p>
      ) : (
        <table className="w-full border-collapse font-ui text-[13px]">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.meetings.table.date}
              </th>
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.meetings.table.client}
              </th>
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.meetings.table.title}
              </th>
              <th className="py-2 pr-4" />
            </tr>
          </thead>
          <tbody>
            {meetings.map((meeting) => (
              <tr key={meeting.id} className="border-b border-border last:border-0">
                <td className="py-2 pr-4 text-text-secondary">
                  {new Date(meeting.meeting_date).toLocaleDateString(
                    locale === "pt" ? "pt-BR" : "en-US",
                  )}
                </td>
                <td className="py-2 pr-4 text-text-primary">
                  {meeting.clients?.[0]?.full_name ?? "—"}
                </td>
                <td className="py-2 pr-4 text-text-primary">{meeting.title}</td>
                <td className="py-2 pr-4">
                  <Link
                    href={`/clients/${meeting.client_id}/meetings`}
                    className="text-burgundy hover:underline"
                  >
                    {t.meetings.viewButton}
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
