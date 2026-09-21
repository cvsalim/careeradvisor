import OpenAI from "openai";
import type {
  AiProvider,
  GenerateCompletionParams,
  GenerateCompletionResult,
} from "@/lib/ai/provider";

const DEFAULT_MODEL = "gpt-4o-mini";

export function createOpenAiProvider(apiKey: string): AiProvider {
  const client = new OpenAI({ apiKey });

  return {
    async generateCompletion({
      systemPrompt,
      userPrompt,
      maxTokens,
    }: GenerateCompletionParams): Promise<GenerateCompletionResult> {
      const response = await client.chat.completions.create({
        model: DEFAULT_MODEL,
        max_tokens: maxTokens ?? 1500,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      });

      const text = response.choices[0]?.message?.content ?? "";
      return { text };
    },
  };
}
