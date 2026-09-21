"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { getDictionary } from "@/lib/i18n/dictionaries";
import type { ScoreEntryFormState } from "@/app/actions/career-score";
import { CAREER_SCORE_DIMENSIONS } from "@/lib/career-score";

type Dictionary = ReturnType<typeof getDictionary>;

export function ScoreEntryForm({
  t,
  action,
}: {
  t: Dictionary;
  action: (
    state: ScoreEntryFormState,
    formData: FormData,
  ) => Promise<ScoreEntryFormState>;
}) {
  const [state, formAction, isPending] = useActionState(action, {});
  const f = t.careerScore.form;

  return (
    <form
      action={formAction}
      className="flex max-w-xl flex-col gap-4 rounded-default border border-border bg-surface p-5"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dimension">{f.dimension}</Label>
          <Select id="dimension" name="dimension" defaultValue="positioning">
            {CAREER_SCORE_DIMENSIONS.map((dimension) => (
              <option key={dimension} value={dimension}>
                {t.careerScore.dimensions[dimension]}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="score">{f.score}</Label>
          <Input id="score" name="score" type="number" min={0} max={100} required />
        </div>
      </div>
      <div>
        <Label htmlFor="evidence">{f.evidence}</Label>
        <Textarea id="evidence" name="evidence" />
      </div>
      <div>
        <Label htmlFor="justification">{f.justification}</Label>
        <Textarea id="justification" name="justification" />
      </div>
      <div>
        <Label htmlFor="nextAction">{f.nextAction}</Label>
        <Textarea id="nextAction" name="nextAction" />
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
