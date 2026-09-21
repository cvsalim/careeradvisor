import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { JournalEntryForm } from "@/components/journal/journal-entry-form";
import { createJournalEntry } from "@/app/actions/journal";
import { Badge } from "@/components/ui/badge";

export default async function ClientJournalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();

  const { data: entries } = await supabase
    .from("career_journal_entries")
    .select(
      "id, title, entry_date, entry_type, description, impact, tags, visibility, related_to",
    )
    .eq("client_id", id)
    .order("entry_date", { ascending: false });

  const boundCreate = createJournalEntry.bind(null, id);

  return (
    <div className="flex flex-col gap-8">
      <JournalEntryForm t={t} action={boundCreate} />

      {!entries || entries.length === 0 ? (
        <p className="font-editorial text-base text-text-secondary">
          {t.journal.empty}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((entry) => {
            const typeKey = entry.entry_type as keyof typeof t.journal.types;
            return (
              <div
                key={entry.id}
                className="flex flex-col gap-2 rounded-default border border-border bg-surface p-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg text-charcoal">
                    {entry.title}
                  </h3>
                  <span className="font-ui text-[12px] text-text-muted">
                    {new Date(entry.entry_date).toLocaleDateString(
                      locale === "pt" ? "pt-BR" : "en-US",
                    )}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone="neutral">{t.journal.types[typeKey]}</Badge>
                  <Badge tone="neutral">
                    {
                      t.journal.visibilityLabel[
                        entry.visibility as keyof typeof t.journal.visibilityLabel
                      ]
                    }
                  </Badge>
                </div>
                {entry.description && (
                  <p className="font-editorial text-base text-text-primary">
                    {entry.description}
                  </p>
                )}
                {entry.impact && (
                  <p className="font-ui text-[13px] text-text-secondary">
                    {t.journal.form.impact}: {entry.impact}
                  </p>
                )}
                {entry.related_to && (
                  <p className="font-ui text-[13px] text-text-secondary">
                    {t.journal.form.relatedTo}: {entry.related_to}
                  </p>
                )}
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 font-ui text-[12px] text-text-muted">
                    {entry.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="rounded-default bg-surface-secondary px-2 py-0.5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
