"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { getDictionary } from "@/lib/i18n/dictionaries";
import type { GoalFormState } from "@/app/actions/strategy";

type Dictionary = ReturnType<typeof getDictionary>;

export function GoalForm({
  t,
  action,
}: {
  t: Dictionary;
  action: (state: GoalFormState, formData: FormData) => Promise<GoalFormState>;
}) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex items-end gap-2">
      <div className="flex-1">
        <Input
          name="description"
          placeholder={t.strategy.goalForm.description}
          required
        />
      </div>
      <label className="flex items-center gap-1 font-ui text-[12px] text-text-secondary">
        <input type="checkbox" name="isPrimary" />
        {t.strategy.goalForm.isPrimary}
      </label>
      <Button type="submit" variant="secondary" disabled={isPending}>
        {t.strategy.goalForm.submit}
      </Button>
      {state.error && (
        <p className="font-ui text-[12px] text-burgundy">{state.error}</p>
      )}
    </form>
  );
}
