import type { ContextBlockKey } from "@/lib/ai/context";

export type TaskKey =
  | "content_ideas"
  | "script"
  | "positioning_review"
  | "professional_bio"
  | "opportunity_analysis"
  | "meeting_prep"
  | "interview_organization"
  | "monthly_report"
  | "next_steps"
  | "brand_review";

export type TaskTemplate = {
  key: TaskKey;
  blocks: ContextBlockKey[];
  outputFormat: "list" | "text" | "briefing" | "report";
  requiresInput: boolean;
  systemInstructions: string;
};

export const AI_TASK_TEMPLATES: TaskTemplate[] = [
  {
    key: "content_ideas",
    blocks: ["profile", "clientSkill"],
    outputFormat: "list",
    requiresInput: false,
    systemInstructions:
      "Suggest content ideas aligned with the client's approved positioning and Brand Brain rules.",
  },
  {
    key: "script",
    blocks: ["profile", "clientSkill"],
    outputFormat: "briefing",
    requiresInput: true,
    systemInstructions:
      "Write a short-form script or outline for the content idea/topic provided by the advisor, respecting the Brand Brain tone and rules.",
  },
  {
    key: "positioning_review",
    blocks: ["profile", "professionalDna", "strategy", "clientSkill"],
    outputFormat: "list",
    requiresInput: false,
    systemInstructions:
      "Review the client's current positioning for consistency with their Professional DNA and strategy. Point out gaps or contradictions.",
  },
  {
    key: "professional_bio",
    blocks: ["profile", "professionalDna", "clientSkill"],
    outputFormat: "text",
    requiresInput: false,
    systemInstructions:
      "Draft a professional bio consistent with the approved positioning and Brand Brain tone of voice.",
  },
  {
    key: "opportunity_analysis",
    blocks: ["profile", "professionalDna", "strategy"],
    outputFormat: "report",
    requiresInput: true,
    systemInstructions:
      "Analyze the opportunity described by the advisor against the client's goals, skills and decision criteria. State fit, risks and open questions.",
  },
  {
    key: "meeting_prep",
    blocks: ["profile", "strategy", "clientSkill"],
    outputFormat: "briefing",
    requiresInput: false,
    systemInstructions:
      "Prepare a short briefing for the advisor's next meeting with this client: current priorities, open actions, and suggested talking points.",
  },
  {
    key: "interview_organization",
    blocks: ["profile", "professionalDna"],
    outputFormat: "list",
    requiresInput: true,
    systemInstructions:
      "Organize interview notes or a discovery agenda for the topic provided by the advisor, mapping to Professional DNA categories.",
  },
  {
    key: "monthly_report",
    blocks: ["profile", "strategy", "clientSkill"],
    outputFormat: "report",
    requiresInput: false,
    systemInstructions:
      "Draft a monthly career report covering progress, executed actions, and recommendations for next month.",
  },
  {
    key: "next_steps",
    blocks: ["profile", "professionalDna", "strategy", "clientSkill"],
    outputFormat: "list",
    requiresInput: false,
    systemInstructions:
      "Suggest the client's next career steps based on their goals, open actions and current strategy gaps.",
  },
  {
    key: "brand_review",
    blocks: ["clientSkill"],
    outputFormat: "list",
    requiresInput: true,
    systemInstructions:
      "Review the text provided by the advisor against the client's Brand Brain rules (tone, forbidden topics/words, approved messaging). Flag any violations.",
  },
];

export function getTaskTemplate(key: string): TaskTemplate | undefined {
  return AI_TASK_TEMPLATES.find((template) => template.key === key);
}

// Maps a task key to its dictionary key under `t.aiWorkspace.tasks`.
export const TASK_LABEL_KEYS: Record<TaskKey, string> = {
  content_ideas: "contentIdeas",
  script: "script",
  positioning_review: "positioningReview",
  professional_bio: "professionalBio",
  opportunity_analysis: "opportunityAnalysis",
  meeting_prep: "meetingPrep",
  interview_organization: "interviewOrganization",
  monthly_report: "monthlyReport",
  next_steps: "nextSteps",
  brand_review: "brandReview",
};

