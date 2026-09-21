"use client";

import { useTransition } from "react";
import { updateDecisionStatus } from "@/app/actions/decisions";
import { Select } from "@/components/ui/select";

export function DecisionStatusSelect({
  clientId,
  decisionId,
  status,
  labels,
}: {
  clientId: string;
  decisionId: string;
  status: string;
  labels: { proposed: string; approved: string; rejected: string };
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      defaultValue={status}
      disabled={isPending}
      onChange={(event) => {
        const value = event.target.value;
        startTransition(() => {
          updateDecisionStatus(clientId, decisionId, value);
        });
      }}
      className="w-auto py-1"
    >
      <option value="proposed">{labels.proposed}</option>
      <option value="approved">{labels.approved}</option>
      <option value="rejected">{labels.rejected}</option>
    </Select>
  );
}
