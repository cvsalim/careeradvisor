"use client";

import { useTransition } from "react";
import { updateMonthlyReviewStatus } from "@/app/actions/monthly-reports";
import { Select } from "@/components/ui/select";

export function MonthlyReviewStatusSelect({
  clientId,
  reviewId,
  status,
  labels,
}: {
  clientId: string;
  reviewId: string;
  status: string;
  labels: { draft: string; approved: string; shared: string };
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      defaultValue={status}
      disabled={isPending}
      onChange={(event) => {
        const value = event.target.value;
        startTransition(() => {
          updateMonthlyReviewStatus(clientId, reviewId, value);
        });
      }}
      className="w-auto py-1"
    >
      <option value="draft">{labels.draft}</option>
      <option value="approved">{labels.approved}</option>
      <option value="shared">{labels.shared}</option>
    </Select>
  );
}
