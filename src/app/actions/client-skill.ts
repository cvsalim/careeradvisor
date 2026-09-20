"use server";

import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export type ClientSkillFormState = { error?: string };

const CATEGORY_ORDER = [
  "identity",
  "strategy",
  "audience",
  "differentiation",
  "communication",
  "approved_content",
  "advisor_guidance",
  "context",
] as const;

const CATEGORY_LABELS: Record<(typeof CATEGORY_ORDER)[number], string> = {
  identity: "Identity & Positioning",
  strategy: "Strategy",
  audience: "Audience & Market",
  differentiation: "Differentiation",
  communication: "Communication DNA",
  approved_content: "Approved Content",
  advisor_guidance: "Advisor Guidance",
  context: "Context",
};

export async function compileClientSkill(
  clientId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- required by useActionState's (state, formData) signature
  _prevState: ClientSkillFormState,
): Promise<ClientSkillFormState> {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const [{ data: client }, { data: positioning }, { data: brandBrainItems }, { data: strategy }] =
    await Promise.all([
      supabase.from("clients").select("full_name").eq("id", clientId).single(),
      supabase
        .from("positioning_versions")
        .select(
          "name, positioning_statement, professional_bio, target_audience, niche, value_proposition, key_messages",
        )
        .eq("client_id", clientId)
        .eq("status", "approved")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("brand_brain_items")
        .select("category, content, priority")
        .eq("client_id", clientId)
        .eq("status", "approved"),
      supabase
        .from("career_strategies")
        .select("main_objective, priorities")
        .eq("client_id", clientId)
        .eq("is_current", true)
        .maybeSingle(),
    ]);

  const sections: string[] = [];
  sections.push(`Client Skill — ${client?.full_name ?? clientId}`);

  if (positioning) {
    sections.push(
      [
        "## Approved Positioning",
        `Name: ${positioning.name}`,
        positioning.positioning_statement
          ? `Statement: ${positioning.positioning_statement}`
          : null,
        positioning.target_audience
          ? `Target audience: ${positioning.target_audience}`
          : null,
        positioning.niche ? `Niche: ${positioning.niche}` : null,
        positioning.value_proposition
          ? `Value proposition: ${positioning.value_proposition}`
          : null,
        positioning.key_messages
          ? `Key messages: ${positioning.key_messages}`
          : null,
      ]
        .filter(Boolean)
        .join("\n"),
    );
  } else {
    sections.push("## Approved Positioning\n(none approved yet)");
  }

  if (strategy) {
    sections.push(
      [
        "## Strategy",
        strategy.main_objective
          ? `Main objective: ${strategy.main_objective}`
          : null,
        strategy.priorities ? `Priorities: ${strategy.priorities}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }

  for (const category of CATEGORY_ORDER) {
    const items = (brandBrainItems ?? []).filter(
      (item) => item.category === category,
    );
    if (items.length === 0) continue;
    sections.push(
      [
        `## ${CATEGORY_LABELS[category]}`,
        ...items.map((item) => `- (${item.priority}) ${item.content}`),
      ].join("\n"),
    );
  }

  const compiledText = sections.join("\n\n");

  const { data, error } = await supabase
    .from("client_skill_versions")
    .insert({
      client_id: clientId,
      compiled_text: compiledText,
      generated_by: user.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Could not compile Client Skill" };
  }

  await logAudit(supabase, {
    clientId,
    entityType: "client_skill_versions",
    entityId: data.id,
    action: "created",
    changedBy: user.id,
  });

  revalidatePath(`/clients/${clientId}/brand-brain`);
  revalidatePath("/career-intelligence");

  return {};
}
