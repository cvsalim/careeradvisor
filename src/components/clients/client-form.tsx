"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { getDictionary } from "@/lib/i18n/dictionaries";
import type { ClientFormState } from "@/app/actions/clients";

type Dictionary = ReturnType<typeof getDictionary>;

type ClientRecord = {
  full_name: string;
  email: string | null;
  phone: string | null;
  role_title: string | null;
  company: string | null;
  segment: string | null;
  city: string | null;
  website: string | null;
  relationship_status: string;
  start_date: string | null;
  main_objective: string | null;
  current_challenges: string | null;
  notes: string | null;
};

export function ClientForm({
  t,
  action,
  defaultValues,
}: {
  t: Dictionary;
  action: (
    state: ClientFormState,
    formData: FormData,
  ) => Promise<ClientFormState>;
  defaultValues?: ClientRecord;
}) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">{t.clients.form.fullName}</Label>
          <Input
            id="fullName"
            name="fullName"
            required
            defaultValue={defaultValues?.full_name}
          />
        </div>
        <div>
          <Label htmlFor="relationshipStatus">
            {t.clients.form.relationshipStatus}
          </Label>
          <Select
            id="relationshipStatus"
            name="relationshipStatus"
            defaultValue={defaultValues?.relationship_status ?? "onboarding"}
          >
            <option value="onboarding">{t.status.onboarding}</option>
            <option value="active">{t.status.active}</option>
            <option value="paused">{t.status.paused}</option>
            <option value="ended">{t.status.ended}</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="email">{t.clients.form.email}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={defaultValues?.email ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="phone">{t.clients.form.phone}</Label>
          <Input id="phone" name="phone" defaultValue={defaultValues?.phone ?? ""} />
        </div>
        <div>
          <Label htmlFor="roleTitle">{t.clients.form.roleTitle}</Label>
          <Input
            id="roleTitle"
            name="roleTitle"
            defaultValue={defaultValues?.role_title ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="company">{t.clients.form.company}</Label>
          <Input
            id="company"
            name="company"
            defaultValue={defaultValues?.company ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="segment">{t.clients.form.segment}</Label>
          <Input
            id="segment"
            name="segment"
            defaultValue={defaultValues?.segment ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="city">{t.clients.form.city}</Label>
          <Input id="city" name="city" defaultValue={defaultValues?.city ?? ""} />
        </div>
        <div>
          <Label htmlFor="website">{t.clients.form.website}</Label>
          <Input
            id="website"
            name="website"
            defaultValue={defaultValues?.website ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="startDate">{t.clients.form.startDate}</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            defaultValue={defaultValues?.start_date ?? ""}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="mainObjective">{t.clients.form.mainObjective}</Label>
        <Textarea
          id="mainObjective"
          name="mainObjective"
          defaultValue={defaultValues?.main_objective ?? ""}
        />
      </div>
      <div>
        <Label htmlFor="currentChallenges">
          {t.clients.form.currentChallenges}
        </Label>
        <Textarea
          id="currentChallenges"
          name="currentChallenges"
          defaultValue={defaultValues?.current_challenges ?? ""}
        />
      </div>
      <div>
        <Label htmlFor="notes">{t.clients.form.notes}</Label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={defaultValues?.notes ?? ""}
        />
      </div>

      {state.error && (
        <p className="font-ui text-[13px] text-burgundy">{state.error}</p>
      )}

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? t.clients.form.submitting : t.clients.form.submit}
        </Button>
      </div>
    </form>
  );
}
