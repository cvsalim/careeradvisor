"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { getDictionary } from "@/lib/i18n/dictionaries";
import type { MeetingFormState } from "@/app/actions/meetings";

type Dictionary = ReturnType<typeof getDictionary>;

export function MeetingForm({
  t,
  action,
}: {
  t: Dictionary;
  action: (
    state: MeetingFormState,
    formData: FormData,
  ) => Promise<MeetingFormState>;
}) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-default border border-border bg-surface p-5"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">{t.meetings.form.title}</Label>
          <Input id="title" name="title" required />
        </div>
        <div>
          <Label htmlFor="meetingDate">{t.meetings.form.meetingDate}</Label>
          <Input
            id="meetingDate"
            name="meetingDate"
            type="datetime-local"
            defaultValue={new Date().toISOString().slice(0, 16)}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="notes">{t.meetings.form.notes}</Label>
        <Textarea id="notes" name="notes" />
      </div>
      <div>
        <Label htmlFor="summary">{t.meetings.form.summary}</Label>
        <Textarea id="summary" name="summary" />
      </div>
      <div>
        <Label htmlFor="nextSteps">{t.meetings.form.nextSteps}</Label>
        <Textarea id="nextSteps" name="nextSteps" />
      </div>

      {state.error && (
        <p className="font-ui text-[13px] text-burgundy">{state.error}</p>
      )}

      <div>
        <Button type="submit" disabled={isPending}>
          {t.meetings.form.submit}
        </Button>
      </div>
    </form>
  );
}
