export type ContentType = "text" | "code" | "math" | "translate" | "summary";

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
} 