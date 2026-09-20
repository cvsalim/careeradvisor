"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-sm border border-border px-3 py-1.5 font-ui text-[13px] text-text-secondary transition-colors hover:bg-surface-secondary"
    >
      Sair
    </button>
  );
}
