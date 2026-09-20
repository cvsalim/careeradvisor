import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { TaskForm } from "@/components/tasks/task-form";
import { TaskStatusSelect } from "@/components/tasks/task-status-select";
import { createTask } from "@/app/actions/tasks";
import { Badge, STATUS_TONES } from "@/components/ui/badge";

export default async function ClientTasksPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();

  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, title, due_date, status, priority")
    .eq("client_id", id)
    .order("due_date", { ascending: true, nullsFirst: false });

  const boundCreate = createTask.bind(null, id);

  return (
    <div className="flex flex-col gap-8">
      <TaskForm t={t} action={boundCreate} />

      {!tasks || tasks.length === 0 ? (
        <p className="font-editorial text-base text-text-secondary">
          {t.tasksModule.empty}
        </p>
      ) : (
        <table className="w-full border-collapse font-ui text-[13px]">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.tasksModule.table.title}
              </th>
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.tasksModule.table.dueDate}
              </th>
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.tasksModule.table.priority}
              </th>
              <th className="py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.06em] text-text-muted">
                {t.tasksModule.table.status}
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="border-b border-border last:border-0"
              >
                <td className="py-2 pr-4 text-text-primary">{task.title}</td>
                <td className="py-2 pr-4 text-text-secondary">
                  {task.due_date
                    ? new Date(task.due_date).toLocaleDateString(
                        locale === "pt" ? "pt-BR" : "en-US",
                      )
                    : "—"}
                </td>
                <td className="py-2 pr-4">
                  <Badge tone={STATUS_TONES[task.priority] ?? "neutral"}>
                    {t.priority[task.priority as keyof typeof t.priority]}
                  </Badge>
                </td>
                <td className="py-2 pr-4">
                  <TaskStatusSelect
                    taskId={task.id}
                    status={task.status}
                    labels={t.status}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
