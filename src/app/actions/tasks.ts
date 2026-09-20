"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.enum(["pending", "in_progress", "done", "cancelled"]),
  priority: z.enum(["low", "medium", "high"]),
  clientId: z.string().optional(),
});

export type TaskFormState = {
  error?: string;
};

export async function createTask(
  fixedClientId: string | null,
  _prevState: TaskFormState,
  formData: FormData,
): Promise<TaskFormState> {
  const parsed = taskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    dueDate: formData.get("dueDate"),
    status: formData.get("status") || "pending",
    priority: formData.get("priority") || "medium",
    clientId: fixedClientId ?? (formData.get("clientId") as string) ?? undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      title: parsed.data.title,
      description: parsed.data.description || null,
      due_date: parsed.data.dueDate || null,
      status: parsed.data.status,
      priority: parsed.data.priority,
      client_id: parsed.data.clientId || null,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Could not create task" };
  }

  await logAudit(supabase, {
    clientId: parsed.data.clientId || null,
    entityType: "tasks",
    entityId: data.id,
    action: "created",
    newValue: parsed.data,
    changedBy: user.id,
  });

  revalidatePath("/tasks");
  revalidatePath("/priorities");
  if (parsed.data.clientId) {
    revalidatePath(`/clients/${parsed.data.clientId}/tasks`);
  }

  return {};
}

export async function updateTaskStatus(taskId: string, status: string) {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: before } = await supabase
    .from("tasks")
    .select("status, client_id")
    .eq("id", taskId)
    .single();

  const { error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", taskId);

  if (error) return;

  await logAudit(supabase, {
    clientId: before?.client_id ?? null,
    entityType: "tasks",
    entityId: taskId,
    action: "status_changed",
    oldValue: { status: before?.status },
    newValue: { status },
    changedBy: user.id,
  });

  revalidatePath("/tasks");
  revalidatePath("/priorities");
  if (before?.client_id) {
    revalidatePath(`/clients/${before.client_id}/tasks`);
  }
}
