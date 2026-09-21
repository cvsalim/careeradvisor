import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { MeetingForm } from "@/components/meetings/meeting-form";
import { createMeeting } from "@/app/actions/meetings";

export default async function ClientMeetingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();

  const { data: meetings } = await supabase
    .from("meetings")
    .select("id, title, meeting_date, notes, summary, next_steps")
    .eq("client_id", id)
    .order("meeting_date", { ascending: false });

  const boundCreate = createMeeting.bind(null, id);

  return (
    <div className="flex flex-col gap-8">
      <MeetingForm t={t} action={boundCreate} />

      {!meetings || meetings.length === 0 ? (
        <p className="font-editorial text-base text-text-secondary">
          {t.meetings.empty}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="flex flex-col gap-2 rounded-default border border-border bg-surface p-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg text-charcoal">
                  {meeting.title}
                </h3>
                <span className="font-ui text-[12px] text-text-muted">
                  {new Date(meeting.meeting_date).toLocaleString(
                    locale === "pt" ? "pt-BR" : "en-US",
                  )}
                </span>
              </div>
              {meeting.summary && (
                <p className="font-editorial text-base text-text-primary">
                  {meeting.summary}
                </p>
              )}
              {meeting.notes && (
                <p className="font-ui text-[13px] text-text-secondary">
                  {meeting.notes}
                </p>
              )}
              {meeting.next_steps && (
                <p className="font-ui text-[13px] text-text-secondary">
                  {t.meetings.form.nextSteps}: {meeting.next_steps}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
