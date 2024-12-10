import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Anthropic } from "@anthropic-ai/sdk";
import { getGeminiClient } from "@/lib/gemini";
import { AIModel } from "@/types/chat";

// Definujeme vlastní typy pro zprávy
interface MessageContent {
  type: 'text';
  text: string;
}

interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  chatId: string;
  createdAt: Date;
}

interface DBMessage {
  id: string;
  content: string;
  role: string;
  chatId: string;
  createdAt: Date;
}

async function getConversationContext(chatId: string, limit = 10) {
  const previousMessages = await prisma.message.findMany({
    where: {
      chatId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });

  return previousMessages.reverse().map((msg: DBMessage): ChatMessage => ({
    id: msg.id,
    role: msg.role as "user" | "assistant",
    content: msg.content,
    chatId: msg.chatId,
    createdAt: msg.createdAt
  }));
}

async function processWithClaude(content: string, previousMessages: ChatMessage[], settings: any) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  console.log('API Key exists:', !!apiKey);
  console.log('API Key length:', apiKey?.length);
  console.log('API Key prefix:', apiKey?.substring(0, 15));

  const anthropic = new Anthropic({
    apiKey: apiKey
  });

  console.log('Sending request to Claude with settings:', {
    model: settings.model,
    max_tokens: settings.maxTokens,
    temperature: settings.temperature,
    system: settings.systemPrompt,
    messagesCount: previousMessages.length + 1
  });

  const response = await anthropic.messages.create({
    model: settings.model as string,
    max_tokens: settings.maxTokens,
    temperature: settings.temperature,
    system: settings.systemPrompt,
    messages: [
      ...previousMessages.map((msg: ChatMessage) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      {
        role: "user",
        content: content
      }
    ]
  });

  return response.content[0]?.type === 'text' 
    ? response.content[0].text 
    : 'Nepodařilo se získat odpověď';
}

async function processWithGemini(content: string, previousMessages: ChatMessage[], settings: any) {
  const gemini = await getGeminiClient();
  const model = gemini.getGenerativeModel({ model: "gemini-pro" });

  const chat = model.startChat({
    history: previousMessages.map(msg => ({
      role: msg.role,
      parts: msg.content,
    })),
    generationConfig: {
      temperature: settings.temperature,
      maxOutputTokens: settings.maxTokens,
    },
  });

  const result = await chat.sendMessage(content);
  const response = await result.response;
  return response.text();
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: "Neautorizovaný přístup" },
        { status: 401 }
      );
    }

    const { content, chatId, settings } = await req.json();
    let currentChatId = chatId;
    let userMessage;
    let assistantMessage;

    // Kontrola kreditů
    const school = await prisma.school.findUnique({
      where: { id: session.user.schoolId! },
    });

    if (!school || school.credits <= 0) {
      return NextResponse.json(
        { message: "Nedostatek kreditů" },
        { status: 400 }
      );
    }

    // Vytvoření nebo získání chatu
    const chat = currentChatId
      ? await prisma.chat.findUnique({ where: { id: currentChatId } })
      : await prisma.chat.create({
          data: {
            userId: session.user.id,
          },
        });

    if (!chat) {
      return NextResponse.json(
        { message: "Chat nenalezen" },
        { status: 404 }
      );
    }

    currentChatId = chat.id;

    // Uložení uživatelské zprávy
    userMessage = await prisma.message.create({
      data: {
        content,
        role: "user",
        chatId: currentChatId,
      },
    });

    // Získání kontextu předchozích zpráv
    const previousMessages = await getConversationContext(currentChatId);

    // Zpracování zprávy podle vybraného modelu
    let responseText;
    if (settings.model === "claude-3-5-sonnet-20240620") {
      responseText = await processWithClaude(content, previousMessages, settings);
    } else if (settings.model === "gemini-pro") {
      responseText = await processWithGemini(content, previousMessages, settings);
    } else {
      throw new Error("Nepodporovaný model");
    }

    // Uložení odpovědi asistenta
    assistantMessage = await prisma.message.create({
      data: {
        content: responseText,
        role: "assistant",
        chatId: currentChatId,
      },
    });

    // Odečtení kreditů
    await prisma.school.update({
      where: { id: session.user.schoolId! },
      data: {
        credits: { decrement: 1 },
      },
    });

    // Záznam o použití kreditů
    await prisma.creditHistory.create({
      data: {
        schoolId: session.user.schoolId!,
        amount: 1,
        type: "SUBTRACT",
      },
    });

    return NextResponse.json({
      chatId: currentChatId,
      userMessage,
      assistantMessage,
    });
  } catch (error: any) {
    console.error("Chyba při zpracování zprávy:", {
      error: error.message,
      type: error.type,
      status: error.status,
      headers: error.headers
    });
    return NextResponse.json(
      { message: `Chyba při zpracování zprávy: ${error.message}` },
      { status: error.status || 500 }
    );
  }
} 