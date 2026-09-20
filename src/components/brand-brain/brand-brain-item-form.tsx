"use client";

import { useActionState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { getDictionary } from "@/lib/i18n/dictionaries";
import type { BrandBrainFormState } from "@/app/actions/brand-brain";

type Dictionary = ReturnType<typeof getDictionary>;

export function BrandBrainItemForm({
  t,
  action,
}: {
  t: Dictionary;
  action: (
    state: BrandBrainFormState,
    formData: FormData,
  ) => Promise<BrandBrainFormState>;
}) {
  const [state, formAction, isPending] = useActionState(action, {});
  const categories = t.brandBrain.categories;

  return (
    <form
      action={formAction}
      className="flex max-w-xl flex-col gap-4 rounded-default border border-border bg-surface p-5"
    >
      <div>
        <Label htmlFor="category">{t.brandBrain.form.category}</Label>
        <Select id="category" name="category" defaultValue="identity">
          <option value="identity">{categories.identity}</option>
          <option value="strategy">{categories.strategy}</option>
          <option value="audience">{categories.audience}</option>
          <option value="differentiation">{categories.differentiation}</option>
          <option value="communication">{categories.communication}</option>
          <option value="approved_content">
            {categories.approved_content}
          </option>
          <option value="advisor_guidance">
            {categories.advisor_guidance}
          </option>
          <option value="context">{categories.context}</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="content">{t.brandBrain.form.content}</Label>
        <Textarea id="content" name="content" required />
      </div>
      <div>
        <Label htmlFor="priority">{t.brandBrain.form.priority}</Label>
        <Select id="priority" name="priority" defaultValue="medium">
          <option value="low">{t.priority.low}</option>
          <option value="medium">{t.priority.medium}</option>
          <option value="high">{t.priority.high}</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="advisorNote">{t.brandBrain.form.advisorNote}</Label>
        <Textarea id="advisorNote" name="advisorNote" />
      </div>

      {state.error && (
        <p className="font-ui text-[13px] text-burgundy">{state.error}</p>
      )}

      <div>
        <Button type="submit" disabled={isPending}>
          {t.brandBrain.form.submit}
        </Button>
      </div>
    </form>
  );
}
