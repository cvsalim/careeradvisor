import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { ContentItemForm } from "@/components/content/content-item-form";
import { ContentStatusSelect } from "@/components/content/content-status-select";
import { createContentItem } from "@/app/actions/content";

const STAGE_ORDER = [
  "idea",
  "briefing",
  "script",
  "in_production",
  "advisor_review",
  "client_approval",
  "published",
  "analyzed",
] as const;

export default async function ClientContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();

  const { data: items } = await supabase
    .from("content_items")
    .select("id, title, theme, format, channel, status, main_message")
    .eq("client_id", id)
    .order("created_at", { ascending: false });

  const boundCreate = createContentItem.bind(null, id);

  return (
    <div className="flex flex-col gap-10">
      <ContentItemForm t={t} action={boundCreate} />

      {!items || items.length === 0 ? (
        <p className="font-editorial text-base text-text-secondary">
          {t.content.empty}
        </p>
      ) : (
        <div className="flex flex-col gap-8">
          {STAGE_ORDER.map((stage) => {
            const stageItems = items.filter((item) => item.status === stage);
            if (stageItems.length === 0) return null;

            return (
              <div key={stage} className="flex flex-col gap-3">
                <h2 className="font-ui text-[11px] uppercase tracking-[0.06em] text-text-muted">
                  {t.content.stages[stage]}
                </h2>
                <div className="flex flex-col gap-2">
                  {stageItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-2 rounded-default border border-border bg-surface p-4"
                    >
                      <h3 className="font-display text-lg text-charcoal">
                        {item.title}
                      </h3>
                      {item.main_message && (
                        <p className="font-editorial text-base text-text-primary">
                          {item.main_message}
                        </p>
                      )}
                      <p className="font-ui text-[12px] text-text-muted">
                        {[item.theme, item.format, item.channel]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      <ContentStatusSelect
                        clientId={id}
                        itemId={item.id}
                        status={item.status}
                        labels={t.content.stages}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
