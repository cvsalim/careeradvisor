"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { getDictionary } from "@/lib/i18n/dictionaries";
import type { JournalFormState } from "@/app/actions/journal";

type Dictionary = ReturnType<typeof getDictionary>;

export function JournalEntryForm({
  t,
  action,
}: {
  t: Dictionary;
  action: (
    state: JournalFormState,
    formData: FormData,
  ) => Promise<JournalFormState>;
}) {
  const [state, formAction, isPending] = useActionState(action, {});
  const types = t.journal.types;

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-default border border-border bg-surface p-5"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">{t.journal.form.title}</Label>
          <Input id="title" name="title" required />
        </div>
        <div>
          <Label htmlFor="entryDate">{t.journal.form.entryDate}</Label>
          <Input
            id="entryDate"
            name="entryDate"
            type="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            required
          />
        </div>
        <div>
          <Label htmlFor="entryType">{t.journal.form.entryType}</Label>
          <Select id="entryType" name="entryType" defaultValue="event">
            <option value="achievement">{types.achievement}</option>
            <option value="feedback">{types.feedback}</option>
            <option value="decision">{types.decision}</option>
            <option value="difficulty">{types.difficulty}</option>
            <option value="learning">{types.learning}</option>
            <option value="objective_change">{types.objective_change}</option>
            <option value="positioning_change">
              {types.positioning_change}
            </option>
            <option value="event">{types.event}</option>
            <option value="other">{types.other}</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="visibility">{t.journal.form.visibility}</Label>
          <Select id="visibility" name="visibility" defaultValue="advisor_only">
            <option value="advisor_only">
              {t.journal.visibilityLabel.advisor_only}
            </option>
            <option value="client_visible">
              {t.journal.visibilityLabel.client_visible}
            </option>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">{t.journal.form.description}</Label>
        <Textarea id="description" name="description" />
      </div>
      <div>
        <Label htmlFor="impact">{t.journal.form.impact}</Label>
        <Textarea id="impact" name="impact" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tags">{t.journal.form.tags}</Label>
          <Input id="tags" name="tags" />
        </div>
        <div>
          <Label htmlFor="relatedTo">{t.journal.form.relatedTo}</Label>
          <Input id="relatedTo" name="relatedTo" />
        </div>
      </div>

      {state.error && (
        <p className="font-ui text-[13px] text-burgundy">{state.error}</p>
      )}

      <div>
        <Button type="submit" disabled={isPending}>
          {t.journal.form.submit}
        </Button>
      </div>
    </form>
  );
}
