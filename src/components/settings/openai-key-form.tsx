"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { getDictionary } from "@/lib/i18n/dictionaries";
import { updateOpenAiKey } from "@/app/actions/settings";

type Dictionary = ReturnType<typeof getDictionary>;

export function OpenAiKeyForm({ t }: { t: Dictionary }) {
  const [state, formAction, isPending] = useActionState(updateOpenAiKey, {});

  return (
    <form
      action={formAction}
      className="flex max-w-md flex-col gap-4 rounded-default border border-border bg-surface p-5"
    >
      <div>
        <Label htmlFor="apiKey">{t.settings.openaiKeyLabel}</Label>
        <Input
          id="apiKey"
          name="apiKey"
          type="password"
          placeholder={t.settings.openaiKeyPlaceholder}
          autoComplete="off"
          required
        />
      </div>

      {state.error && (
        <p className="font-ui text-[13px] text-burgundy">{state.error}</p>
      )}

      <div>
        <Button type="submit" disabled={isPending}>
          {t.settings.submit}
        </Button>
      </div>
    </form>
  );
}
