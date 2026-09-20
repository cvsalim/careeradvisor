"use client";

import { useActionState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { getDictionary } from "@/lib/i18n/dictionaries";
import type { DnaItemFormState } from "@/app/actions/professional-dna";

type Dictionary = ReturnType<typeof getDictionary>;

export function DnaItemForm({
  t,
  action,
}: {
  t: Dictionary;
  action: (
    state: DnaItemFormState,
    formData: FormData,
  ) => Promise<DnaItemFormState>;
}) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form
      action={formAction}
      className="flex max-w-xl flex-col gap-4 rounded-default border border-border bg-surface p-5"
    >
      <div>
        <Label htmlFor="category">{t.professionalDna.form.category}</Label>
        <Select id="category" name="category" defaultValue="skill">
          <option value="education">{t.professionalDna.categories.education}</option>
          <option value="skill">{t.professionalDna.categories.skill}</option>
          <option value="achievement">
            {t.professionalDna.categories.achievement}
          </option>
          <option value="value">{t.professionalDna.categories.value}</option>
          <option value="growth">{t.professionalDna.categories.growth}</option>
          <option value="evidence">{t.professionalDna.categories.evidence}</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="content">{t.professionalDna.form.content}</Label>
        <Textarea id="content" name="content" required />
      </div>
      <div>
        <Label htmlFor="source">{t.professionalDna.form.source}</Label>
        <Select id="source" name="source" defaultValue="">
          <option value="">—</option>
          <option value="interview">{t.source.interview}</option>
          <option value="document">{t.source.document}</option>
          <option value="observation">{t.source.observation}</option>
          <option value="client_statement">{t.source.client_statement}</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="advisorNote">{t.professionalDna.form.advisorNote}</Label>
        <Textarea id="advisorNote" name="advisorNote" />
      </div>

      {state.error && (
        <p className="font-ui text-[13px] text-burgundy">{state.error}</p>
      )}

      <div>
        <Button type="submit" disabled={isPending}>
          {t.professionalDna.form.submit}
        </Button>
      </div>
    </form>
  );
}
