export type ContentType = "text" | "code" | "math" | "translate" | "summary";

export type AIModel = "claude-3-5-sonnet-20240620" | "gemini-pro";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: Date;
}

export interface ModelSettings {
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  model: AIModel;
} 