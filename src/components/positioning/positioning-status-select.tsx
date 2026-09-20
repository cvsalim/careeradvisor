"use client";

import { useTransition } from "react";
import { updatePositioningStatus } from "@/app/actions/positioning";
import { Select } from "@/components/ui/select";

export function PositioningStatusSelect({
  clientId,
  versionId,
  status,
  labels,
}: {
  clientId: string;
  versionId: string;
  status: string;
  labels: {
    in_review: string;
    approved: string;
    rejected: string;
    archived: string;
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
          updatePositioningStatus(clientId, versionId, value);
        });
      }}
      className="w-auto py-1"
    >
      <option value="in_review">{labels.in_review}</option>
      <option value="approved">{labels.approved}</option>
      <option value="rejected">{labels.rejected}</option>
      <option value="archived">{labels.archived}</option>
    </Select>
  );
}
