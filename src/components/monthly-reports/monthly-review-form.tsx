"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { getDictionary } from "@/lib/i18n/dictionaries";
import type { MonthlyReviewFormState } from "@/app/actions/monthly-reports";

type Dictionary = ReturnType<typeof getDictionary>;

export function MonthlyReviewForm({
  t,
  action,
  defaultMonth,
  defaultSummary,
}: {
  t: Dictionary;
  action: (
    state: MonthlyReviewFormState,
    formData: FormData,
  ) => Promise<MonthlyReviewFormState>;
  defaultMonth: string;
  defaultSummary?: string;
}) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-default border border-border bg-surface p-5"
    >
      <div>
        <Label htmlFor="reviewMonth">{t.monthlyReports.form.reviewMonth}</Label>
        <Input
          id="reviewMonth"
          name="reviewMonth"
          type="month"
          defaultValue={defaultMonth}
          required
        />
      </div>
      <div>
        <Label htmlFor="summaryText">{t.monthlyReports.form.summaryText}</Label>
        <Textarea
          id="summaryText"
          name="summaryText"
          rows={14}
          defaultValue={defaultSummary}
        />
      </div>

      {state.error && (
        <p className="font-ui text-[13px] text-burgundy">{state.error}</p>
      )}

      <div>
        <Button type="submit" disabled={isPending}>
          {t.monthlyReports.form.submit}
        </Button>
      </div>
    </form>
  );
}
