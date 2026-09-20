import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { DnaItemForm } from "@/components/professional-dna/dna-item-form";
import { DnaStatusSelect } from "@/components/professional-dna/dna-status-select";
import { createDnaItem } from "@/app/actions/professional-dna";
import { Badge } from "@/components/ui/badge";

const CATEGORY_ORDER = [
  "education",
  "skill",
  "achievement",
  "value",
  "growth",
  "evidence",
] as const;

export default async function ClientProfessionalDnaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();

  const { data: items } = await supabase
    .from("professional_dna_items")
    .select("id, category, content, status, source, advisor_note, created_at")
    .eq("client_id", id)
    .order("created_at", { ascending: false });

  const boundCreate = createDnaItem.bind(null, id);

  return (
    <div className="flex flex-col gap-8">
      <DnaItemForm t={t} action={boundCreate} />

      {!items || items.length === 0 ? (
        <p className="font-editorial text-base text-text-secondary">
          {t.professionalDna.empty}
        </p>
      ) : (
        <div className="flex flex-col gap-8">
          {CATEGORY_ORDER.map((category) => {
            const categoryItems = items.filter(
              (item) => item.category === category,
            );
            if (categoryItems.length === 0) return null;

            return (
              <div key={category} className="flex flex-col gap-3">
                <h2 className="font-ui text-[11px] uppercase tracking-[0.06em] text-text-muted">
                  {t.professionalDna.categories[category]}
                </h2>
                <div className="flex flex-col gap-2">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-2 rounded-default border border-border bg-surface p-4"
                    >
                      <p className="font-editorial text-base text-text-primary">
                        {item.content}
                      </p>
                      {item.advisor_note && (
                        <p className="font-ui text-[12px] text-text-secondary">
                          {item.advisor_note}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-2">
                        {item.source && (
                          <Badge tone="neutral">
                            {t.source[item.source as keyof typeof t.source]}
                          </Badge>
                        )}
                        <DnaStatusSelect
                          clientId={id}
                          itemId={item.id}
                          status={item.status}
                          labels={t.status}
                        />
                      </div>
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
