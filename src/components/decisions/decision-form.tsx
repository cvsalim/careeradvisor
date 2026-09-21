"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { getDictionary } from "@/lib/i18n/dictionaries";
import type { DecisionFormState } from "@/app/actions/decisions";

type Dictionary = ReturnType<typeof getDictionary>;

export function DecisionForm({
  t,
  action,
  meetings,
}: {
  t: Dictionary;
  action: (
    state: DecisionFormState,
    formData: FormData,
  ) => Promise<DecisionFormState>;
  meetings: { id: string; title: string }[];
}) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-default border border-border bg-surface p-5"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">{t.decisions.form.title}</Label>
          <Input id="title" name="title" required />
        </div>
        <div>
          <Label htmlFor="decisionDate">{t.decisions.form.decisionDate}</Label>
          <Input
            id="decisionDate"
            name="decisionDate"
            type="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="description">{t.decisions.form.description}</Label>
        <Textarea id="description" name="description" />
      </div>
      <div>
        <Label htmlFor="rationale">{t.decisions.form.rationale}</Label>
        <Textarea id="rationale" name="rationale" />
      </div>
      <div>
        <Label htmlFor="relatedMeetingId">
          {t.decisions.form.relatedMeeting}
        </Label>
        <Select id="relatedMeetingId" name="relatedMeetingId" defaultValue="">
          <option value="">{t.decisions.form.none}</option>
          {meetings.map((meeting) => (
            <option key={meeting.id} value={meeting.id}>
              {meeting.title}
            </option>
          ))}
        </Select>
      </div>

      {state.error && (
        <p className="font-ui text-[13px] text-burgundy">{state.error}</p>
      )}

      <div>
        <Button type="submit" disabled={isPending}>
          {t.decisions.form.submit}
        </Button>
      </div>
    </form>
  );
}
