import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { Topbar } from "@/components/layout/topbar";
import { Sidebar } from "@/components/layout/sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const locale = await getLocale();

  return (
    <div className="flex min-h-screen flex-col">
      <Topbar userEmail={user?.email} locale={locale} />
      <div className="flex flex-1">
        <Sidebar locale={locale} />
        <main className="flex-1 bg-background px-10 py-8">{children}</main>
      </div>
    </div>
  );
}
