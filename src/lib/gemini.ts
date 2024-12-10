import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "./prisma";
import { decrypt } from "./crypto";

let geminiInstance: GoogleGenerativeAI | null = null;

export async function getGeminiClient() {
  if (!geminiInstance) {
    const settings = await prisma.settings.findUnique({
      where: { key: "GOOGLE_API_KEY" },
    });

    if (!settings) {
      throw new Error("Google API klíč není nastaven");
    }

    const apiKey = await decrypt(settings.value);
    geminiInstance = new GoogleGenerativeAI(apiKey);
  }

  return geminiInstance;
} 