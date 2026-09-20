"use client";

import { useTransition } from "react";
import { updateTaskStatus } from "@/app/actions/tasks";
import { Select } from "@/components/ui/select";

export function TaskStatusSelect({
  taskId,
  status,
  labels,
}: {
  taskId: string;
  status: string;
  labels: { pending: string; in_progress: string; done: string; cancelled: string };
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      defaultValue={status}
      disabled={isPending}
      onChange={(event) => {
        const value = event.target.value;
        startTransition(() => {
          updateTaskStatus(taskId, value);
        });
      }}
      className="w-auto py-1"
    >
      <option value="pending">{labels.pending}</option>
      <option value="in_progress">{labels.in_progress}</option>
      <option value="done">{labels.done}</option>
      <option value="cancelled">{labels.cancelled}</option>
    </Select>
  );
}
