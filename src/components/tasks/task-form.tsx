"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { getDictionary } from "@/lib/i18n/dictionaries";
import type { TaskFormState } from "@/app/actions/tasks";

type Dictionary = ReturnType<typeof getDictionary>;

export function TaskForm({
  t,
  action,
  clients,
}: {
  t: Dictionary;
  action: (state: TaskFormState, formData: FormData) => Promise<TaskFormState>;
  clients?: { id: string; full_name: string }[];
}) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form
      action={formAction}
      className="flex max-w-xl flex-col gap-4 rounded-default border border-border bg-surface p-5"
    >
      <div>
        <Label htmlFor="title">{t.tasksModule.form.title}</Label>
        <Input id="title" name="title" required />
      </div>
      <div>
        <Label htmlFor="description">{t.tasksModule.form.description}</Label>
        <Textarea id="description" name="description" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dueDate">{t.tasksModule.form.dueDate}</Label>
          <Input id="dueDate" name="dueDate" type="date" />
        </div>
        <div>
          <Label htmlFor="priority">{t.tasksModule.form.priority}</Label>
          <Select id="priority" name="priority" defaultValue="medium">
            <option value="low">{t.priority.low}</option>
            <option value="medium">{t.priority.medium}</option>
            <option value="high">{t.priority.high}</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="status">{t.tasksModule.form.status}</Label>
          <Select id="status" name="status" defaultValue="pending">
            <option value="pending">{t.status.pending}</option>
            <option value="in_progress">{t.status.in_progress}</option>
            <option value="done">{t.status.done}</option>
            <option value="cancelled">{t.status.cancelled}</option>
          </Select>
        </div>
        {clients && (
          <div>
            <Label htmlFor="clientId">{t.tasksModule.form.client}</Label>
            <Select id="clientId" name="clientId" defaultValue="">
              <option value="">{t.tasksModule.unassigned}</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.full_name}
                </option>
              ))}
            </Select>
          </div>
        )}
      </div>

      {state.error && (
        <p className="font-ui text-[13px] text-burgundy">{state.error}</p>
      )}

      <div>
        <Button type="submit" disabled={isPending}>
          {t.tasksModule.form.submit}
        </Button>
      </div>
    </form>
  );
}
