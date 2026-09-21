import { createClient } from "@/lib/supabase/server";

export type ContextBlockKey =
  | "profile"
  | "professionalDna"
  | "strategy"
  | "clientSkill";

type ContextBlock = { label: string; text: string };

async function getProfileBlock(clientId: string): Promise<ContextBlock | null> {
  const supabase = await createClient();
  const { data: client } = await supabase
    .from("clients")
    .select(
      "full_name, role_title, company, segment, city, relationship_status, main_objective, current_challenges",
    )
    .eq("id", clientId)
    .single();

  if (!client) return null;

  const lines = [
    `Name: ${client.full_name}`,
    client.role_title ? `Role: ${client.role_title}` : null,
    client.company ? `Company: ${client.company}` : null,
    client.segment ? `Segment: ${client.segment}` : null,
    client.city ? `Location: ${client.city}` : null,
    `Relationship status: ${client.relationship_status}`,
    client.main_objective ? `Main objective: ${client.main_objective}` : null,
    client.current_challenges
      ? `Current challenges: ${client.current_challenges}`
      : null,
  ].filter(Boolean);

  return { label: "Client profile", text: lines.join("\n") };
}

async function getProfessionalDnaBlock(
  clientId: string,
): Promise<ContextBlock | null> {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("professional_dna_items")
    .select("category, content")
    .eq("client_id", clientId)
    .eq("status", "validated");

  if (!items || items.length === 0) return null;

  const text = items
    .map((item) => `- (${item.category}) ${item.content}`)
    .join("\n");

  return { label: "Professional DNA (validated)", text };
}

async function getStrategyBlock(clientId: string): Promise<ContextBlock | null> {
  const supabase = await createClient();
  const { data: strategy } = await supabase
    .from("career_strategies")
    .select(
      "id, future_vision, main_objective, current_situation, desired_situation, strategic_gaps, priorities, plan_90_days, plan_12_months, risks_and_obstacles",
    )
    .eq("client_id", clientId)
    .eq("is_current", true)
    .maybeSingle();

  if (!strategy) return null;

  const [{ data: goals }, { data: actions }] = await Promise.all([
    supabase
      .from("career_goals")
      .select("description, is_primary")
      .eq("career_strategy_id", strategy.id),
    supabase
      .from("career_actions")
      .select("description, status, priority, due_date")
      .eq("career_strategy_id", strategy.id)
      .not("status", "in", "(done,cancelled)"),
  ]);

  const lines = [
    strategy.future_vision ? `Future vision: ${strategy.future_vision}` : null,
    strategy.main_objective
      ? `Main objective: ${strategy.main_objective}`
      : null,
    strategy.current_situation
      ? `Current situation: ${strategy.current_situation}`
      : null,
    strategy.desired_situation
      ? `Desired situation: ${strategy.desired_situation}`
      : null,
    strategy.strategic_gaps
      ? `Strategic gaps: ${strategy.strategic_gaps}`
      : null,
    strategy.priorities ? `Priorities: ${strategy.priorities}` : null,
    strategy.plan_90_days ? `90-day plan: ${strategy.plan_90_days}` : null,
    strategy.plan_12_months
      ? `12-month plan: ${strategy.plan_12_months}`
      : null,
    strategy.risks_and_obstacles
      ? `Risks and obstacles: ${strategy.risks_and_obstacles}`
      : null,
    goals && goals.length > 0
      ? `Goals:\n${goals.map((g) => `- ${g.is_primary ? "(primary) " : ""}${g.description}`).join("\n")}`
      : null,
    actions && actions.length > 0
      ? `Open actions:\n${actions.map((a) => `- [${a.priority}/${a.status}] ${a.description}${a.due_date ? ` (due ${a.due_date})` : ""}`).join("\n")}`
      : null,
  ].filter(Boolean);

  if (lines.length === 0) return null;

  return { label: "Current career strategy", text: lines.join("\n") };
}

async function getClientSkillBlock(
  clientId: string,
): Promise<ContextBlock | null> {
  const supabase = await createClient();
  const { data: skill } = await supabase
    .from("client_skill_versions")
    .select("compiled_text")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!skill?.compiled_text) return null;

  return { label: "Client Skill (compiled)", text: skill.compiled_text };
}

const BLOCK_BUILDERS: Record<
  ContextBlockKey,
  (clientId: string) => Promise<ContextBlock | null>
> = {
  profile: getProfileBlock,
  professionalDna: getProfessionalDnaBlock,
  strategy: getStrategyBlock,
  clientSkill: getClientSkillBlock,
};

export async function assembleContext(
  clientId: string,
  blockKeys: ContextBlockKey[],
): Promise<{ blocksUsed: string[]; contextText: string }> {
  const results = await Promise.all(
    blockKeys.map((key) => BLOCK_BUILDERS[key](clientId)),
  );

  const blocks = results.filter((block): block is ContextBlock => block !== null);

  const contextText = blocks.length
    ? blocks.map((block) => `## ${block.label}\n${block.text}`).join("\n\n")
    : "(No data available yet for this client.)";

  return { blocksUsed: blocks.map((block) => block.label), contextText };
}
