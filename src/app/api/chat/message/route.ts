import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Anthropic } from "@anthropic-ai/sdk";

// Definujeme vlastní typy pro zprávy
interface MessageContent {
  type: 'text';
  text: string;
}

interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Použijeme API klíč přímo z prostředí
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

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

    // Získání odpovědi od Claude s upravenými parametry
    const response = await anthropic.beta.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: settings.maxTokens,
      temperature: settings.temperature,
      system: settings.systemPrompt,
      messages: previousMessages.map((msg: DBMessage): AnthropicMessage => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })).concat([{
        role: "user",
        content: content
      }])
    });

    // Uložení odpovědi asistenta
    assistantMessage = await prisma.message.create({
      data: {
        content: response.content[0]?.type === 'text' 
          ? response.content[0].text 
          : 'Nepodporovaný typ odpovědi',
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
  } catch (error) {
    console.error("Chyba při zpracování zprávy:", error);
    return NextResponse.json(
      { message: "Chyba při zpracování zprávy" },
      { status: 500 }
    );
  }
} 