import { getSetting } from "@/lib/settings";
import { createOpenAiProvider } from "@/lib/ai/openai";
import { AiNotConfiguredError, type AiProvider } from "@/lib/ai/provider";

export { AiNotConfiguredError } from "@/lib/ai/provider";
export type { AiProvider } from "@/lib/ai/provider";

export async function getAiProvider(): Promise<AiProvider> {
  const apiKey = await getSetting("openai_api_key");
  if (!apiKey) {
    throw new AiNotConfiguredError();
  }
  return createOpenAiProvider(apiKey);
}
