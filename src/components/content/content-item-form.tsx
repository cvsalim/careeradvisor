"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { getDictionary } from "@/lib/i18n/dictionaries";
import type { ContentItemFormState } from "@/app/actions/content";

type Dictionary = ReturnType<typeof getDictionary>;

export function ContentItemForm({
  t,
  action,
}: {
  t: Dictionary;
  action: (
    state: ContentItemFormState,
    formData: FormData,
  ) => Promise<ContentItemFormState>;
}) {
  const [state, formAction, isPending] = useActionState(action, {});
  const f = t.content.form;

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-default border border-border bg-surface p-5"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">{f.title}</Label>
          <Input id="title" name="title" required />
        </div>
        <div>
          <Label htmlFor="objective">{f.objective}</Label>
          <Input id="objective" name="objective" />
        </div>
        <div>
          <Label htmlFor="pillar">{f.pillar}</Label>
          <Input id="pillar" name="pillar" />
        </div>
        <div>
          <Label htmlFor="theme">{f.theme}</Label>
          <Input id="theme" name="theme" />
        </div>
        <div>
          <Label htmlFor="format">{f.format}</Label>
          <Input id="format" name="format" />
        </div>
        <div>
          <Label htmlFor="channel">{f.channel}</Label>
          <Input id="channel" name="channel" />
        </div>
        <div>
          <Label htmlFor="plannedDate">{f.plannedDate}</Label>
          <Input id="plannedDate" name="plannedDate" type="date" />
        </div>
        <div>
          <Label htmlFor="publishedDate">{f.publishedDate}</Label>
          <Input id="publishedDate" name="publishedDate" type="date" />
        </div>
        <div className="col-span-2">
          <Label htmlFor="externalLink">{f.externalLink}</Label>
          <Input id="externalLink" name="externalLink" type="url" />
        </div>
      </div>
      <div>
        <Label htmlFor="mainMessage">{f.mainMessage}</Label>
        <Textarea id="mainMessage" name="mainMessage" />
      </div>
      <div>
        <Label htmlFor="briefing">{f.briefing}</Label>
        <Textarea id="briefing" name="briefing" />
      </div>
      <div>
        <Label htmlFor="scriptText">{f.scriptText}</Label>
        <Textarea id="scriptText" name="scriptText" />
      </div>
      <div>
        <Label htmlFor="result">{f.result}</Label>
        <Textarea id="result" name="result" />
      </div>
      <div>
        <Label htmlFor="learning">{f.learning}</Label>
        <Textarea id="learning" name="learning" />
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
