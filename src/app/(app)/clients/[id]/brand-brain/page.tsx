import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { BrandBrainItemForm } from "@/components/brand-brain/brand-brain-item-form";
import { BrandBrainStatusSelect } from "@/components/brand-brain/brand-brain-status-select";
import { ClientSkillPanel } from "@/components/brand-brain/client-skill-panel";
import { createBrandBrainItem } from "@/app/actions/brand-brain";
import { compileClientSkill } from "@/app/actions/client-skill";
import { Badge } from "@/components/ui/badge";

const CATEGORY_ORDER = [
  "identity",
  "strategy",
  "audience",
  "differentiation",
  "communication",
  "approved_content",
  "advisor_guidance",
  "context",
] as const;

export default async function ClientBrandBrainPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();

  const [{ data: items }, { data: latestSkill }] = await Promise.all([
    supabase
      .from("brand_brain_items")
      .select("id, category, content, status, priority, advisor_note")
      .eq("client_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("client_skill_versions")
      .select("compiled_text, created_at")
      .eq("client_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const boundCreate = createBrandBrainItem.bind(null, id);
  const boundCompile = compileClientSkill.bind(null, id);

  return (
    <div className="flex flex-col gap-10">
      <BrandBrainItemForm t={t} action={boundCreate} />

      {!items || items.length === 0 ? (
        <p className="font-editorial text-base text-text-secondary">
          {t.brandBrain.empty}
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
                  {t.brandBrain.categories[category]}
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
                        <Badge tone="neutral">
                          {t.priority[item.priority as keyof typeof t.priority]}
                        </Badge>
                        <BrandBrainStatusSelect
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

      <ClientSkillPanel
        t={t}
        locale={locale}
        action={boundCompile}
        latest={latestSkill}
      />
    </div>
  );
}
