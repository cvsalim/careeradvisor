"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { getDictionary } from "@/lib/i18n/dictionaries";

type Dictionary = ReturnType<typeof getDictionary>;

export function LoginForm({ t }: { t: Dictionary }) {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-default border border-border bg-surface p-8"
      style={{ boxShadow: "var(--shadow-subtle)" }}
    >
      <h1 className="mb-1 font-display text-2xl text-charcoal">{t.login.title}</h1>
      <p className="mb-6 font-editorial text-sm text-text-secondary">
        {t.login.subtitle}
      </p>

      <label className="mb-1 block font-ui text-[13px] font-medium text-text-secondary">
        {t.login.email}
      </label>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 w-full rounded-sm border border-border bg-surface px-3 py-2 font-ui text-[13px] text-text-primary focus:border-border-strong focus:outline-none"
      />

      <label className="mb-1 block font-ui text-[13px] font-medium text-text-secondary">
        {t.login.password}
      </label>
      <input
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 w-full rounded-sm border border-border bg-surface px-3 py-2 font-ui text-[13px] text-text-primary focus:border-border-strong focus:outline-none"
      />

      {error && <p className="mb-4 font-ui text-[13px] text-burgundy">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-sm bg-burgundy px-3 py-2 font-ui text-[13px] font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? t.login.submitting : t.login.submit}
      </button>
    </form>
  );
}
