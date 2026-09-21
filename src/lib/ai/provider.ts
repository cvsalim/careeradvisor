export type GenerateCompletionParams = {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
};

export type GenerateCompletionResult = {
  text: string;
};

export interface AiProvider {
  generateCompletion(
    params: GenerateCompletionParams,
  ): Promise<GenerateCompletionResult>;
}

export class AiNotConfiguredError extends Error {
  constructor() {
    super("AI provider is not configured");
    this.name = "AiNotConfiguredError";
  }
}
