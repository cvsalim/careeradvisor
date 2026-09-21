import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function PortalContentPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: client } = await supabase
    .from("clients")
    .select("id")
    .eq("portal_user_id", user!.id)
    .single();

  const { data: items } = await supabase
    .from("content_items")
    .select("id, title, theme, format, channel, external_link, published_date")
    .eq("client_id", client?.id ?? "")
    .order("published_date", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-[28px] text-charcoal">
        {t.portal.nav.content}
      </h1>

      {!items || items.length === 0 ? (
        <p className="font-editorial text-base text-text-secondary">
          {t.portal.content.empty}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 rounded-default border border-border bg-surface p-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg text-charcoal">
                  {item.title}
                </h3>
                {item.published_date && (
                  <span className="font-ui text-[12px] text-text-muted">
                    {new Date(item.published_date).toLocaleDateString(
                      locale === "pt" ? "pt-BR" : "en-US",
                    )}
                  </span>
                )}
              </div>
              <p className="font-ui text-[13px] text-text-secondary">
                {[item.theme, item.format, item.channel]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              {item.external_link && (
                <a
                  href={item.external_link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-ui text-[13px] text-burgundy hover:underline"
                >
                  {item.external_link}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
