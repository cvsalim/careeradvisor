import type { TaskTemplate } from "@/lib/ai/task-templates";

const SYSTEM_INSTRUCTIONS = `You are an assistant supporting a Career & Branding Advisor.
Rules:
- Do not invent facts about the client; only use the context provided.
- Clearly distinguish facts, hypotheses and recommendations.
- Respect information marked as approved; do not contradict it.
- If data needed to complete the task is missing from the context, say so explicitly.
- You support the Advisor's judgment; you do not replace their final decision.`;

const OUTPUT_FORMAT_INSTRUCTIONS: Record<TaskTemplate["outputFormat"], string> = {
  list: "Respond as a concise bulleted list.",
  text: "Respond as a single well-written passage of prose.",
  briefing: "Respond as a short briefing with clear section headers.",
  report: "Respond as a structured report with section headers.",
};

export function buildPrompt({
  template,
  contextText,
  advisorInput,
}: {
  template: TaskTemplate;
  contextText: string;
  advisorInput: string;
}): { systemPrompt: string; userPrompt: string } {
  const userPrompt = [
    `## Client context\n${contextText}`,
    `## Task\n${template.systemInstructions}`,
    advisorInput ? `## Advisor input\n${advisorInput}` : null,
    `## Output format\n${OUTPUT_FORMAT_INSTRUCTIONS[template.outputFormat]}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  return { systemPrompt: SYSTEM_INSTRUCTIONS, userPrompt };
}
