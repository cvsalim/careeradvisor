"use client";

import { useActionState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { getDictionary } from "@/lib/i18n/dictionaries";
import type { StrategyFormState } from "@/app/actions/strategy";

type Dictionary = ReturnType<typeof getDictionary>;

type StrategyRecord = {
  future_vision: string | null;
  main_objective: string | null;
  current_situation: string | null;
  perceived_positioning: string | null;
  desired_situation: string | null;
  strategic_gaps: string | null;
  priorities: string | null;
  plan_90_days: string | null;
  plan_12_months: string | null;
  risks_and_obstacles: string | null;
  decision_criteria: string | null;
};

export function StrategyForm({
  t,
  action,
  defaultValues,
}: {
  t: Dictionary;
  action: (
    state: StrategyFormState,
    formData: FormData,
  ) => Promise<StrategyFormState>;
  defaultValues?: StrategyRecord;
}) {
  const [state, formAction, isPending] = useActionState(action, {});
  const d = t.strategy.detail;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="futureVision">{d.futureVision}</Label>
          <Textarea
            id="futureVision"
            name="futureVision"
            defaultValue={defaultValues?.future_vision ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="mainObjective">{d.mainObjective}</Label>
          <Textarea
            id="mainObjective"
            name="mainObjective"
            defaultValue={defaultValues?.main_objective ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="currentSituation">{d.currentSituation}</Label>
          <Textarea
            id="currentSituation"
            name="currentSituation"
            defaultValue={defaultValues?.current_situation ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="perceivedPositioning">{d.perceivedPositioning}</Label>
          <Textarea
            id="perceivedPositioning"
            name="perceivedPositioning"
            defaultValue={defaultValues?.perceived_positioning ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="desiredSituation">{d.desiredSituation}</Label>
          <Textarea
            id="desiredSituation"
            name="desiredSituation"
            defaultValue={defaultValues?.desired_situation ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="strategicGaps">{d.strategicGaps}</Label>
          <Textarea
            id="strategicGaps"
            name="strategicGaps"
            defaultValue={defaultValues?.strategic_gaps ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="priorities">{d.priorities}</Label>
          <Textarea
            id="priorities"
            name="priorities"
            defaultValue={defaultValues?.priorities ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="decisionCriteria">{d.decisionCriteria}</Label>
          <Textarea
            id="decisionCriteria"
            name="decisionCriteria"
            defaultValue={defaultValues?.decision_criteria ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="plan90Days">{d.plan90Days}</Label>
          <Textarea
            id="plan90Days"
            name="plan90Days"
            defaultValue={defaultValues?.plan_90_days ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="plan12Months">{d.plan12Months}</Label>
          <Textarea
            id="plan12Months"
            name="plan12Months"
            defaultValue={defaultValues?.plan_12_months ?? ""}
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="risksAndObstacles">{d.risksAndObstacles}</Label>
          <Textarea
            id="risksAndObstacles"
            name="risksAndObstacles"
            defaultValue={defaultValues?.risks_and_obstacles ?? ""}
          />
        </div>
      </div>

      {state.error && (
        <p className="font-ui text-[13px] text-burgundy">{state.error}</p>
      )}

      <div>
        <Button type="submit" disabled={isPending}>
          {defaultValues ? d.newVersionButton : d.submit}
        </Button>
      </div>
    </form>
  );
}
