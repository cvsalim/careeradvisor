"use client";

import { useTransition } from "react";
import { updateContentItemStatus } from "@/app/actions/content";
import { Select } from "@/components/ui/select";

const STAGES = [
  "idea",
  "briefing",
  "script",
  "in_production",
  "advisor_review",
  "client_approval",
  "published",
  "analyzed",
] as const;

export function ContentStatusSelect({
  clientId,
  itemId,
  status,
  labels,
}: {
  clientId: string;
  itemId: string;
  status: string;
  labels: Record<(typeof STAGES)[number], string>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      defaultValue={status}
      disabled={isPending}
      onChange={(event) => {
        const value = event.target.value;
        startTransition(() => {
          updateContentItemStatus(clientId, itemId, value);
        });
      }}
      className="w-auto py-1"
    >
      {STAGES.map((stage) => (
        <option key={stage} value={stage}>
          {labels[stage]}
        </option>
      ))}
    </Select>
  );
}
