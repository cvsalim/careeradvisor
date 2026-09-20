import type { SupabaseClient } from "@supabase/supabase-js";

type AuditAction = "created" | "updated" | "status_changed" | "deleted";

type LogAuditParams = {
  clientId?: string | null;
  entityType: string;
  entityId: string;
  action: AuditAction;
  oldValue?: unknown;
  newValue?: unknown;
  reason?: string | null;
  changedBy?: string | null;
};

// Best-effort audit trail write; never blocks the calling mutation on failure.
export async function logAudit(
  supabase: SupabaseClient,
  params: LogAuditParams,
) {
  await supabase.from("audit_logs").insert({
    client_id: params.clientId ?? null,
    entity_type: params.entityType,
    entity_id: params.entityId,
    action: params.action,
    old_value: params.oldValue ?? null,
    new_value: params.newValue ?? null,
    reason: params.reason ?? null,
    changed_by: params.changedBy ?? null,
  });
}
