"use client";

import { useTransition } from "react";
import { updateActionStatus } from "@/app/actions/strategy";
import { Select } from "@/components/ui/select";

export function ActionStatusSelect({
  clientId,
  actionId,
  status,
  labels,
}: {
  clientId: string;
  actionId: string;
  status: string;
  labels: {
    pending: string;
    in_progress: string;
    done: string;
    blocked: string;
    cancelled: string;
  };
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      defaultValue={status}
      disabled={isPending}
      onChange={(event) => {
        const value = event.target.value;
        startTransition(() => {
          updateActionStatus(clientId, actionId, value);
        });
      }}
      className="w-auto py-1"
    >
      <option value="pending">{labels.pending}</option>
      <option value="in_progress">{labels.in_progress}</option>
      <option value="done">{labels.done}</option>
      <option value="blocked">{labels.blocked}</option>
      <option value="cancelled">{labels.cancelled}</option>
    </Select>
  );
}
