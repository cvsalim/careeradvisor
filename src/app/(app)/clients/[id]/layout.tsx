import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Badge, STATUS_TONES } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";

export default async function ClientProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();

  const { data: client } = await supabase
    .from("clients")
    .select("id, full_name, company, role_title, relationship_status")
    .eq("id", id)
    .single();

  if (!client) notFound();

  const base = `/clients/${id}`;
  const tabs = [
    { label: t.clients.tabs.basic, href: base },
    { label: t.clients.tabs.professionalDna, href: `${base}/professional-dna` },
    { label: t.clients.tabs.strategy, href: `${base}/strategy` },
    { label: t.clients.tabs.positioning, href: `${base}/positioning` },
    { label: t.clients.tabs.brandBrain, href: `${base}/brand-brain` },
    { label: t.clients.tabs.aiWorkspace, href: `${base}/ai-workspace` },
    { label: t.clients.tabs.tasks, href: `${base}/tasks` },
    { label: t.clients.tabs.audit, href: `${base}/audit` },
    { label: t.clients.tabs.journal, href: `${base}/journal` },
    { label: t.clients.tabs.content, href: `${base}/content` },
    { label: t.clients.tabs.careerScore, href: `${base}/career-score` },
    { label: t.clients.tabs.reports, href: `${base}/reports` },
    { label: t.clients.tabs.documents, href: `${base}/documents`, disabled: true },
    { label: t.clients.tabs.meetings, href: `${base}/meetings` },
    { label: t.clients.tabs.decisions, href: `${base}/decisions` },
    { label: t.clients.tabs.resources, href: `${base}/resources` },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-display text-[28px] text-charcoal">
            {client.full_name}
          </h1>
          <Badge tone={STATUS_TONES[client.relationship_status] ?? "neutral"}>
            {t.status[client.relationship_status as keyof typeof t.status] ??
              client.relationship_status}
          </Badge>
        </div>
        <p className="font-editorial text-sm text-text-secondary">
          {[client.role_title, client.company].filter(Boolean).join(" · ") ||
            "—"}
        </p>
      </div>
      <Tabs items={tabs} />
      {children}
    </div>
  );
}
