import { createClient } from "@/lib/supabase/server";
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

  return (
    <div className="flex min-h-screen flex-col">
      <Topbar userEmail={user?.email} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-background px-10 py-8">{children}</main>
      </div>
    </div>
  );
}
