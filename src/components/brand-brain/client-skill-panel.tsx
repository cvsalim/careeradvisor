"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import type { getDictionary } from "@/lib/i18n/dictionaries";
import type { ClientSkillFormState } from "@/app/actions/client-skill";

type Dictionary = ReturnType<typeof getDictionary>;

export function ClientSkillPanel({
  t,
  locale,
  action,
  latest,
}: {
  t: Dictionary;
  locale: string;
  action: (
    state: ClientSkillFormState,
    formData: FormData,
  ) => Promise<ClientSkillFormState>;
  latest?: { compiled_text: string; created_at: string } | null;
}) {
  const [state, formAction, isPending] = useActionState(action, {});
  const cs = t.brandBrain.clientSkill;

  return (
    <div className="flex flex-col gap-3 rounded-default border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-charcoal">{cs.title}</h2>
        <form action={formAction}>
          <Button type="submit" variant="secondary" disabled={isPending}>
            {cs.recompile}
          </Button>
        </form>
      </div>
      <p className="font-editorial text-sm text-text-secondary">
        {cs.subtitle}
      </p>

      {state.error && (
        <p className="font-ui text-[13px] text-burgundy">{state.error}</p>
      )}

      {latest ? (
        <div className="flex flex-col gap-1">
          <p className="font-ui text-[11px] uppercase tracking-[0.06em] text-text-muted">
            {cs.lastCompiled}:{" "}
            {new Date(latest.created_at).toLocaleString(
              locale === "pt" ? "pt-BR" : "en-US",
            )}
          </p>
          <pre className="whitespace-pre-wrap rounded-default bg-surface-secondary p-4 font-ui text-[12px] text-text-primary">
            {latest.compiled_text}
          </pre>
        </div>
      ) : (
        <p className="font-editorial text-base text-text-secondary">
          {cs.empty}
        </p>
      )}
    </div>
  );
}
