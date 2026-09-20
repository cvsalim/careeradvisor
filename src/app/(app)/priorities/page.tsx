import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { ActionStatusSelect } from "@/components/strategy/action-status-select";
import { TaskStatusSelect } from "@/components/tasks/task-status-select";
import { Badge } from "@/components/ui/badge";

export default async function PrioritiesPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();

  const [{ data: clients }, { data: actions }, { data: tasks }] =
    await Promise.all([
      supabase.from("clients").select("id, full_name"),
      supabase
        .from("career_actions")
        .select(
          "id, description, due_date, status, career_strategies(client_id)",
        )
        .eq("priority", "high")
        .not("status", "in", "(done,cancelled)"),
      supabase
        .from("tasks")
        .select("id, title, due_date, status, client_id")
        .eq("priority", "high")
        .not("status", "in", "(done,cancelled)"),
    ]);

  const clientNames = new Map(
    (clients ?? []).map((client) => [client.id, client.full_name]),
  );

  type PriorityItem = {
    id: string;
    label: string;
    clientId: string;
    clientName: string;
    dueDate: string | null;
    status: string;
    type: "action" | "task";
  };

  const actionItems: PriorityItem[] = (actions ?? []).map((action) => {
    const clientId = action.career_strategies?.[0]?.client_id ?? "";
    return {
      id: action.id,
      label: action.description,
      clientId,
      clientName: clientNames.get(clientId) ?? "—",
      dueDate: action.due_date,
      status: action.status,
      type: "action",
    };
  });

  const taskItems: PriorityItem[] = (tasks ?? []).map((task) => ({
    id: task.id,
    label: task.title,
    clientId: task.client_id ?? "",
    clientName: clientNames.get(task.client_id ?? "") ?? t.tasksModule.unassigned,
    dueDate: task.due_date,
    status: task.status,
    type: "task",
  }));

  const items = [...actionItems, ...taskItems].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.localeCompare(b.dueDate);
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-[28px] text-charcoal">
          {t.priorities.title}
        </h1>
        <p className="font-editorial text-sm text-text-secondary">
          {t.priorities.subtitle}
        </p>
      </div>

      {items.length === 0 ? (
        <p className="font-editorial text-base text-text-secondary">
          {t.priorities.empty}
        </p>
      ) : (
        <table className="w-full border-collapse font-ui text-[13px]">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.priorities.table.item}
              </th>
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.priorities.table.client}
              </th>
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.priorities.table.type}
              </th>
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.priorities.table.dueDate}
              </th>
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.priorities.table.status}
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={`${item.type}-${item.id}`}
                className="border-b border-border last:border-0"
              >
                <td className="py-2 pr-4 text-text-primary">{item.label}</td>
                <td className="py-2 pr-4 text-text-secondary">
                  {item.clientName}
                </td>
                <td className="py-2 pr-4">
                  <Badge tone="neutral">
                    {item.type === "action"
                      ? t.priorities.typeAction
                      : t.priorities.typeTask}
                  </Badge>
                </td>
                <td className="py-2 pr-4 text-text-secondary">
                  {item.dueDate
                    ? new Date(item.dueDate).toLocaleDateString(
                        locale === "pt" ? "pt-BR" : "en-US",
                      )
                    : "—"}
                </td>
                <td className="py-2 pr-4">
                  {item.type === "action" ? (
                    <ActionStatusSelect
                      clientId={item.clientId}
                      actionId={item.id}
                      status={item.status}
                      labels={t.status}
                    />
                  ) : (
                    <TaskStatusSelect
                      taskId={item.id}
                      status={item.status}
                      labels={t.status}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
