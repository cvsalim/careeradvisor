import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { ExternalResourceForm } from "@/components/external-resources/external-resource-form";
import { createExternalResource } from "@/app/actions/external-resources";

export default async function ClientResourcesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();

  const { data: resources } = await supabase
    .from("external_resources")
    .select("id, tool_name, link, summary, created_at")
    .eq("client_id", id)
    .order("created_at", { ascending: false });

  const boundCreate = createExternalResource.bind(null, id);

  return (
    <div className="flex flex-col gap-8">
      <ExternalResourceForm t={t} action={boundCreate} />

      {!resources || resources.length === 0 ? (
        <p className="font-editorial text-base text-text-secondary">
          {t.externalResources.empty}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="flex flex-col gap-2 rounded-default border border-border bg-surface p-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg text-charcoal">
                  {resource.tool_name}
                </h3>
                <span className="font-ui text-[12px] text-text-muted">
                  {new Date(resource.created_at).toLocaleDateString(
                    locale === "pt" ? "pt-BR" : "en-US",
                  )}
                </span>
              </div>
              {resource.link && (
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-ui text-[13px] text-burgundy hover:underline"
                >
                  {resource.link}
                </a>
              )}
              {resource.summary && (
                <p className="font-editorial text-base text-text-primary">
                  {resource.summary}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
