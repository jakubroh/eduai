import { Anthropic } from "@anthropic-ai/sdk";
import { prisma } from "./prisma";
import { decrypt } from "./crypto";

let anthropicInstance: Anthropic | null = null;

export async function getAnthropicClient() {
  if (!anthropicInstance) {
    const settings = await prisma.settings.findUnique({
      where: { key: "ANTHROPIC_API_KEY" },
    });

    if (!settings) {
      throw new Error("API klíč není nastaven");
    }

    const apiKey = await decrypt(settings.value);
    anthropicInstance = new Anthropic({ apiKey });
  }

  return anthropicInstance;
} 