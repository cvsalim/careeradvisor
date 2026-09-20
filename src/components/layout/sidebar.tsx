import Link from "next/link";
import type { Locale } from "@/lib/i18n/dictionaries";
import { getDictionary } from "@/lib/i18n/dictionaries";

type NavItem = {
  label: string;
  href: string;
};

type NavGroup = {
  title?: string;
  items: NavItem[];
};

export function Sidebar({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  const navGroups: NavGroup[] = [
    { items: [{ label: t.nav.overview, href: "/" }] },
    {
      title: t.nav.groups.clients,
      items: [
        { label: t.nav.clients, href: "/clients" },
        { label: t.nav.careerIntelligence, href: "/career-intelligence" },
        { label: t.nav.professionalDna, href: "/professional-dna" },
      ],
    },
    {
      title: t.nav.groups.strategy,
      items: [
        { label: t.nav.objectives, href: "/objectives" },
        { label: t.nav.positioning, href: "/positioning" },
        { label: t.nav.decisions, href: "/decisions" },
        { label: t.nav.priorities, href: "/priorities" },
      ],
    },
    {
      title: t.nav.groups.execution,
      items: [
        { label: t.nav.tasks, href: "/tasks" },
        { label: t.nav.content, href: "/content" },
        { label: t.nav.meetings, href: "/meetings" },
      ],
    },
    {
      title: t.nav.groups.intelligence,
      items: [
        { label: t.nav.opportunities, href: "/opportunities" },
        { label: t.nav.market, href: "/market" },
        { label: t.nav.reports, href: "/reports" },
      ],
    },
  ];

  return (
    <nav className="flex w-[230px] shrink-0 flex-col gap-6 border-r border-border bg-surface-secondary px-4 py-6">
      {navGroups.map((group) => (
        <div key={group.title ?? "root"} className="flex flex-col gap-1">
          {group.title && (
            <span className="mb-1 px-2 font-ui text-[11px] uppercase tracking-[0.06em] text-text-muted">
              {group.title}
            </span>
          )}
          {group.items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-sm px-2 py-1.5 font-ui text-[13px] text-text-primary transition-colors hover:bg-surface"
            >
              {item.label}
            </Link>
          ))}
        </div>
      ))}

      <div className="mt-auto flex flex-col gap-1 border-t border-border pt-4">
        <Link
          href="/settings"
          className="rounded-sm px-2 py-1.5 font-ui text-[13px] text-text-primary transition-colors hover:bg-surface"
        >
          {t.nav.settings}
        </Link>
      </div>
    </nav>
  );
}
