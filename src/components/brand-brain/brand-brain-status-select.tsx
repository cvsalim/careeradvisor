"use client";

import { useTransition } from "react";
import { updateBrandBrainItemStatus } from "@/app/actions/brand-brain";
import { Select } from "@/components/ui/select";

export function BrandBrainStatusSelect({
  clientId,
  itemId,
  status,
  labels,
}: {
  clientId: string;
  itemId: string;
  status: string;
  labels: { draft: string; approved: string; rejected: string; archived: string };
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      defaultValue={status}
      disabled={isPending}
      onChange={(event) => {
        const value = event.target.value;
        startTransition(() => {
          updateBrandBrainItemStatus(clientId, itemId, value);
        });
      }}
      className="w-auto py-1"
    >
      <option value="draft">{labels.draft}</option>
      <option value="approved">{labels.approved}</option>
      <option value="rejected">{labels.rejected}</option>
      <option value="archived">{labels.archived}</option>
    </Select>
  );
}
