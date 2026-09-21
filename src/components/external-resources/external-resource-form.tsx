"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { getDictionary } from "@/lib/i18n/dictionaries";
import type { ExternalResourceFormState } from "@/app/actions/external-resources";

type Dictionary = ReturnType<typeof getDictionary>;

export function ExternalResourceForm({
  t,
  action,
}: {
  t: Dictionary;
  action: (
    state: ExternalResourceFormState,
    formData: FormData,
  ) => Promise<ExternalResourceFormState>;
}) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-default border border-border bg-surface p-5"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="toolName">{t.externalResources.form.toolName}</Label>
          <Input id="toolName" name="toolName" required />
        </div>
        <div>
          <Label htmlFor="link">{t.externalResources.form.link}</Label>
          <Input id="link" name="link" type="url" />
        </div>
      </div>
      <div>
        <Label htmlFor="summary">{t.externalResources.form.summary}</Label>
        <Textarea id="summary" name="summary" rows={4} />
      </div>

      {state.error && (
        <p className="font-ui text-[13px] text-burgundy">{state.error}</p>
      )}

      <div>
        <Button type="submit" disabled={isPending}>
          {t.externalResources.form.submit}
        </Button>
      </div>
    </form>
  );
}
