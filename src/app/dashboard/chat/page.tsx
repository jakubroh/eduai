"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { CreditDisplay } from "@/components/chat/credit-display";
import { ModelSettings } from "@/components/chat/model-settings";
import { ChatTools } from "@/components/chat/tools";
import { processContent } from "@/lib/claude-tools";
import { getSystemPrompt, systemPrompts } from "@/lib/claude-prompts";
import { ChatHistory } from "@/components/chat/chat-history";
import { ChatInput } from "@/components/chat/chat-input";
import toast from "react-hot-toast";
import { Message, ModelSettings as ModelSettingsType, ContentType } from "@/types/chat";
import { debounce } from "lodash";

const STORAGE_KEY = "eduai_chat_settings";

const defaultSettings: ModelSettingsType = {
  temperature: 0.7,
  maxTokens: 1024,
  systemPrompt: "teacher",
  model: "claude-3-5-sonnet-20240620"
};

export default function ChatPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [contentType, setContentType] = useState<ContentType>("text");
  const [modelSettings, setModelSettings] = useState<ModelSettingsType>(() => {
    if (typeof window === "undefined") return defaultSettings;
    
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  // Perzistence nastavení
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(modelSettings));
  }, [modelSettings]);

  // Debounced nastavení
  const debouncedSettingsChange = debounce((newSettings: ModelSettingsType) => {
    setModelSettings(newSettings);
  }, 300);

  async function handleSendMessage(content: string) {
    if (!session?.user) {
      toast.error("Nejste přihlášen");
      return;
    }

    if (!content.trim()) {
      toast.error("Zpráva nemůže být prázdná");
      return;
    }

    setLoading(true);
    setIsTyping(true);

    try {
      // Zpracování obsahu podle typu
      const processedContent = await processContent(content, contentType);

      const systemPromptKey = modelSettings.systemPrompt as keyof typeof systemPrompts;
      if (!Object.keys(systemPrompts).includes(systemPromptKey)) {
        throw new Error("Neplatný systémový prompt");
      }

      const response = await fetch("/api/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: processedContent,
          settings: {
            ...modelSettings,
            systemPrompt: getSystemPrompt(systemPromptKey),
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json() as APIError;
        throw new Error(error.message || "Chyba při odesílání zprávy");
      }

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        data.userMessage,
        data.assistantMessage,
      ]);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Neočekávaná chyba při komunikaci se serverem");
      }
      console.error("Chat error:", error);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col h-[calc(100vh-2rem)] gap-4">
        <div className="flex justify-between items-center">
          <CreditDisplay />
          <ModelSettings
            settings={modelSettings}
            onSettingsChange={debouncedSettingsChange}
          />
        </div>
        <ChatHistory messages={messages} isTyping={isTyping} />
        <div className="flex gap-4 items-start">
          <ChatInput
            onSendMessage={handleSendMessage}
            loading={loading}
            type={contentType}
          />
          <ChatTools
            currentType={contentType}
            onTypeChange={setContentType}
          />
        </div>
      </div>
    </div>
  );
} 