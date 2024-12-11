import { GoogleGenerativeAI } from "@google/generative-ai";

let geminiInstance: GoogleGenerativeAI | null = null;

export async function getGeminiClient() {
  if (!geminiInstance) {
    const apiKey = process.env.GOOGLE_API_KEY;
    
    if (!apiKey) {
      throw new Error("Google API klíč není nastaven v prostředí");
    }

    geminiInstance = new GoogleGenerativeAI(apiKey);
  }

  return geminiInstance;
} 