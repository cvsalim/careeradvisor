"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { getDictionary } from "@/lib/i18n/dictionaries";
import type { MarketSignalFormState } from "@/app/actions/market-signals";
import { createMarketSignal } from "@/app/actions/market-signals";

type Dictionary = ReturnType<typeof getDictionary>;

export function MarketSignalForm({
  t,
  clients,
}: {
  t: Dictionary;
  clients: { id: string; full_name: string }[];
}) {
  const [state, formAction, isPending] = useActionState<
    MarketSignalFormState,
    FormData
  >(createMarketSignal, {});

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-default border border-border bg-surface p-5"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="clientId">{t.marketSignals.form.client}</Label>
          <Select id="clientId" name="clientId" defaultValue="">
            <option value="">{t.marketSignals.form.noClient}</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.full_name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="signalDate">{t.marketSignals.form.signalDate}</Label>
          <Input
            id="signalDate"
            name="signalDate"
            type="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            required
          />
        </div>
        <div>
          <Label htmlFor="title">{t.marketSignals.form.title}</Label>
          <Input id="title" name="title" required />
        </div>
        <div>
          <Label htmlFor="source">{t.marketSignals.form.source}</Label>
          <Input id="source" name="source" />
        </div>
      </div>
      <div>
        <Label htmlFor="summary">{t.marketSignals.form.summary}</Label>
        <Textarea id="summary" name="summary" rows={4} />
      </div>
      <div>
        <Label htmlFor="tags">{t.marketSignals.form.tags}</Label>
        <Input id="tags" name="tags" />
      </div>

      {state.error && (
        <p className="font-ui text-[13px] text-burgundy">{state.error}</p>
      )}

      <div>
        <Button type="submit" disabled={isPending}>
          {t.marketSignals.form.submit}
        </Button>
      </div>
    </form>
  );
}
