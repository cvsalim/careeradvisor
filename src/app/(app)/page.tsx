import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const locale = await getLocale();
  const t = getDictionary(locale);

  // Placeholder stats until Clients / Priorities / Decisions modules exist.
  const stats = [
    { label: t.dashboard.activeClients, value: "—" },
    { label: t.dashboard.priorities, value: "—" },
    { label: t.dashboard.decisions, value: "—" },
  ];

  const today = new Date().toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-10">
      <div>
        <h1 className="font-display text-[34px] leading-tight text-charcoal">
          {t.dashboard.greeting}
          {user?.email ? `, ${user.email.split("@")[0]}` : ""}.
        </h1>
        <p className="mt-1 font-editorial text-lg text-text-secondary">
          {t.dashboard.subtitle}
        </p>
        <p className="font-ui text-[13px] text-text-muted">{today}</p>
      </div>

      <div className="grid grid-cols-3 divide-x divide-border border-y border-border py-6">
        {stats.map((stat) => (
          <div key={stat.label} className="px-6 first:pl-0">
            <div className="font-display text-3xl text-burgundy">
              {stat.value}
            </div>
            <div className="mt-1 font-ui text-[11px] uppercase tracking-[0.06em] text-text-muted">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-ui text-[11px] uppercase tracking-[0.06em] text-text-muted">
          {t.dashboard.today}
        </h2>
        <p className="font-editorial text-base text-text-secondary">
          {t.dashboard.todayEmpty}
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-ui text-[11px] uppercase tracking-[0.06em] text-text-muted">
          {t.dashboard.recentIntelligence}
        </h2>
        <p className="font-editorial text-base text-text-secondary">
          {t.dashboard.recentIntelligenceEmpty}
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-ui text-[11px] uppercase tracking-[0.06em] text-text-muted">
          {t.dashboard.thisWeek}
        </h2>
        <p className="font-editorial text-base text-text-secondary">
          {t.dashboard.thisWeekEmpty}
        </p>
      </section>
    </div>
  );
}
