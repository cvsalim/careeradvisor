import { createClient } from "@supabase/supabase-js";

// Server-only client that bypasses RLS. Never import this from client
// components — it must only be used inside Server Actions / Server Components
// for tables like `app_settings` that have no policies for anon/authenticated.
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured. Add it to your environment variables.",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
