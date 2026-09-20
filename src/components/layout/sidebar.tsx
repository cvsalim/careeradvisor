import Link from "next/link";

type NavItem = {
  label: string;
  href?: string;
};

type NavGroup = {
  title?: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  { items: [{ label: "Overview", href: "/" }] },
  {
    title: "Clients",
    items: [
      { label: "Clients" },
      { label: "Career Intelligence" },
      { label: "Professional DNA" },
    ],
  },
  {
    title: "Strategy",
    items: [
      { label: "Objectives" },
      { label: "Positioning" },
      { label: "Decisions" },
      { label: "Priorities" },
    ],
  },
  {
    title: "Execution",
    items: [{ label: "Tasks" }, { label: "Content" }, { label: "Meetings" }],
  },
  {
    title: "Intelligence",
    items: [{ label: "Opportunities" }, { label: "Market" }, { label: "Reports" }],
  },
];

export function Sidebar() {
  return (
    <nav className="flex w-[230px] shrink-0 flex-col gap-6 border-r border-border bg-surface-secondary px-4 py-6">
      {navGroups.map((group) => (
        <div key={group.title ?? "root"} className="flex flex-col gap-1">
          {group.title && (
            <span className="mb-1 px-2 font-ui text-[11px] uppercase tracking-[0.06em] text-text-muted">
              {group.title}
            </span>
          )}
          {group.items.map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-sm px-2 py-1.5 font-ui text-[13px] text-text-primary transition-colors hover:bg-surface"
              >
                {item.label}
              </Link>
            ) : (
              // Module not built yet — shown for structure, not yet navigable.
              <span
                key={item.label}
                aria-disabled="true"
                className="cursor-not-allowed rounded-sm px-2 py-1.5 font-ui text-[13px] text-text-muted"
              >
                {item.label}
              </span>
            ),
          )}
        </div>
      ))}

      <div className="mt-auto flex flex-col gap-1 border-t border-border pt-4">
        <span
          aria-disabled="true"
          className="cursor-not-allowed rounded-sm px-2 py-1.5 font-ui text-[13px] text-text-muted"
        >
          Settings
        </span>
      </div>
    </nav>
  );
}
