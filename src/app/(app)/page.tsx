import { createClient } from "@/lib/supabase/server";

// Placeholder stats until Clients / Priorities / Decisions modules exist.
const stats = [
  { label: "Active Clients", value: "—" },
  { label: "Priorities", value: "—" },
  { label: "Decisions", value: "—" },
];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-10">
      <div>
        <h1 className="font-display text-[34px] leading-tight text-charcoal">
          Good morning{user?.email ? `, ${user.email.split("@")[0]}` : ""}.
        </h1>
        <p className="mt-1 font-editorial text-lg text-text-secondary">
          Your advisory office
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
          Today
        </h2>
        <p className="font-editorial text-base text-text-secondary">
          No priorities scheduled yet. Once clients and tasks are registered,
          today&apos;s agenda will appear here.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-ui text-[11px] uppercase tracking-[0.06em] text-text-muted">
          Recent Intelligence
        </h2>
        <p className="font-editorial text-base text-text-secondary">
          Insights, decisions and opportunities will be summarized here as
          they are recorded.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-ui text-[11px] uppercase tracking-[0.06em] text-text-muted">
          This Week
        </h2>
        <p className="font-editorial text-base text-text-secondary">
          Meetings, tasks, reviews and reports for the week will be listed
          here.
        </p>
      </section>
    </div>
  );
}
