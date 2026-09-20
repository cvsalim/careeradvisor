"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { getDictionary } from "@/lib/i18n/dictionaries";
import type { ActionFormState } from "@/app/actions/strategy";

type Dictionary = ReturnType<typeof getDictionary>;

export function ActionForm({
  t,
  action,
}: {
  t: Dictionary;
  action: (
    state: ActionFormState,
    formData: FormData,
  ) => Promise<ActionFormState>;
}) {
  const [state, formAction, isPending] = useActionState(action, {});
  const f = t.strategy.actionForm;

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-default border border-border bg-surface p-5"
    >
      <div>
        <Label htmlFor="description">{f.description}</Label>
        <Textarea id="description" name="description" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="responsible">{f.responsible}</Label>
          <Input id="responsible" name="responsible" />
        </div>
        <div>
          <Label htmlFor="dueDate">{f.dueDate}</Label>
          <Input id="dueDate" name="dueDate" type="date" />
        </div>
        <div>
          <Label htmlFor="status">{f.status}</Label>
          <Select id="status" name="status" defaultValue="pending">
            <option value="pending">{t.status.pending}</option>
            <option value="in_progress">{t.status.in_progress}</option>
            <option value="done">{t.status.done}</option>
            <option value="blocked">{t.status.blocked}</option>
            <option value="cancelled">{t.status.cancelled}</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="priority">{f.priority}</Label>
          <Select id="priority" name="priority" defaultValue="medium">
            <option value="low">{t.priority.low}</option>
            <option value="medium">{t.priority.medium}</option>
            <option value="high">{t.priority.high}</option>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="expectedResult">{f.expectedResult}</Label>
        <Textarea id="expectedResult" name="expectedResult" />
      </div>
      <div>
        <Label htmlFor="notes">{f.notes}</Label>
        <Textarea id="notes" name="notes" />
      </div>

      {state.error && (
        <p className="font-ui text-[13px] text-burgundy">{state.error}</p>
      )}

      <div>
        <Button type="submit" disabled={isPending}>
          {f.submit}
        </Button>
      </div>
    </form>
  );
}
