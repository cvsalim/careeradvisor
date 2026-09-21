import Link from "next/link";
import { AI_TASK_TEMPLATES, TASK_LABEL_KEYS } from "@/lib/ai/task-templates";
import type { getDictionary } from "@/lib/i18n/dictionaries";

type Dictionary = ReturnType<typeof getDictionary>;

export function TaskPicker({
  t,
  clientId,
  selectedTask,
}: {
  t: Dictionary;
  clientId: string;
  selectedTask?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-ui text-[11px] uppercase tracking-[0.06em] text-text-muted">
        {t.aiWorkspace.pickTaskLabel}
      </h2>
      <div className="flex flex-wrap gap-2">
        {AI_TASK_TEMPLATES.map((template) => {
          const isActive = template.key === selectedTask;
          const labelKey = TASK_LABEL_KEYS[
            template.key
          ] as keyof typeof t.aiWorkspace.tasks;

          return (
            <Link
              key={template.key}
              href={`/clients/${clientId}/ai-workspace?task=${template.key}`}
              className={`rounded-default border px-3 py-1.5 font-ui text-[13px] ${
                isActive
                  ? "border-burgundy bg-burgundy/10 text-burgundy"
                  : "border-border text-text-secondary hover:border-burgundy/50"
              }`}
            >
              {t.aiWorkspace.tasks[labelKey]}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
