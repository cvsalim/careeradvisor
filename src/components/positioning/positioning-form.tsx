"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { getDictionary } from "@/lib/i18n/dictionaries";
import type { PositioningFormState } from "@/app/actions/positioning";

type Dictionary = ReturnType<typeof getDictionary>;

export function PositioningForm({
  t,
  action,
}: {
  t: Dictionary;
  action: (
    state: PositioningFormState,
    formData: FormData,
  ) => Promise<PositioningFormState>;
}) {
  const [state, formAction, isPending] = useActionState(action, {});
  const d = t.positioning.detail;

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-default border border-border bg-surface p-5"
    >
      <div>
        <Label htmlFor="name">{d.name}</Label>
        <Input id="name" name="name" required />
      </div>
      <div>
        <Label htmlFor="description">{d.description}</Label>
        <Textarea id="description" name="description" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="targetAudience">{d.targetAudience}</Label>
          <Textarea id="targetAudience" name="targetAudience" />
        </div>
        <div>
          <Label htmlFor="niche">{d.niche}</Label>
          <Textarea id="niche" name="niche" />
        </div>
        <div>
          <Label htmlFor="authorityTerritory">{d.authorityTerritory}</Label>
          <Textarea id="authorityTerritory" name="authorityTerritory" />
        </div>
        <div>
          <Label htmlFor="problemsSolved">{d.problemsSolved}</Label>
          <Textarea id="problemsSolved" name="problemsSolved" />
        </div>
        <div>
          <Label htmlFor="differentiators">{d.differentiators}</Label>
          <Textarea id="differentiators" name="differentiators" />
        </div>
        <div>
          <Label htmlFor="valueProposition">{d.valueProposition}</Label>
          <Textarea id="valueProposition" name="valueProposition" />
        </div>
      </div>
      <div>
        <Label htmlFor="positioningStatement">{d.positioningStatement}</Label>
        <Textarea id="positioningStatement" name="positioningStatement" />
      </div>
      <div>
        <Label htmlFor="presentationSpeech">{d.presentationSpeech}</Label>
        <Textarea id="presentationSpeech" name="presentationSpeech" />
      </div>
      <div>
        <Label htmlFor="professionalBio">{d.professionalBio}</Label>
        <Textarea id="professionalBio" name="professionalBio" />
      </div>
      <div>
        <Label htmlFor="keyMessages">{d.keyMessages}</Label>
        <Textarea id="keyMessages" name="keyMessages" />
      </div>
      <div>
        <Label htmlFor="justification">{d.justification}</Label>
        <Textarea id="justification" name="justification" />
      </div>

      {state.error && (
        <p className="font-ui text-[13px] text-burgundy">{state.error}</p>
      )}

      <div>
        <Button type="submit" disabled={isPending}>
          {d.submit}
        </Button>
      </div>
    </form>
  );
}
