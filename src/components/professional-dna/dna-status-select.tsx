"use client";

import { useTransition } from "react";
import { updateDnaItemStatus } from "@/app/actions/professional-dna";
import { Select } from "@/components/ui/select";

export function DnaStatusSelect({
  clientId,
  itemId,
  status,
  labels,
}: {
  clientId: string;
  itemId: string;
  status: string;
  labels: { draft: string; validated: string; rejected: string; archived: string };
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      defaultValue={status}
      disabled={isPending}
      onChange={(event) => {
        const value = event.target.value;
        startTransition(() => {
          updateDnaItemStatus(clientId, itemId, value);
        });
      }}
      className="w-auto py-1"
    >
      <option value="draft">{labels.draft}</option>
      <option value="validated">{labels.validated}</option>
      <option value="rejected">{labels.rejected}</option>
      <option value="archived">{labels.archived}</option>
    </Select>
  );
}
