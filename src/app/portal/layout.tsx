import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { LogoutButton } from "@/components/logout-button";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: client } = await supabase
    .from("clients")
    .select("id, full_name")
    .eq("portal_user_id", user.id)
    .single();

  if (!client) notFound();

  const navItems = [
    { label: t.portal.nav.overview, href: "/portal" },
    { label: t.portal.nav.careerScore, href: "/portal/career-score" },
    { label: t.portal.nav.reports, href: "/portal/reports" },
    { label: t.portal.nav.decisions, href: "/portal/decisions" },
    { label: t.portal.nav.content, href: "/portal/content" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-border bg-surface px-8 py-4">
        <div>
          <p className="font-ui text-[11px] uppercase tracking-[0.06em] text-text-muted">
            {t.portal.welcome}
          </p>
          <h1 className="font-display text-xl text-charcoal">
            {client.full_name}
          </h1>
        </div>
        <LogoutButton label={t.portal.logout} />
      </header>
      <div className="flex flex-1">
        <nav className="flex w-[200px] shrink-0 flex-col gap-1 border-r border-border bg-surface-secondary px-4 py-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-sm px-2 py-1.5 font-ui text-[13px] text-text-primary transition-colors hover:bg-surface"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="flex-1 bg-background px-10 py-8">{children}</main>
      </div>
    </div>
  );
}
