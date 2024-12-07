import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: "Neautorizovaný přístup" },
        { status: 401 }
      );
    }

    const { chatId } = params;

    // Ověření, že chat patří přihlášenému uživateli
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: session.user.id,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!chat) {
      return NextResponse.json(
        { message: "Chat nenalezen" },
        { status: 404 }
      );
    }

    return NextResponse.json(chat.messages);
  } catch (error) {
    console.error("Chyba při načítání zpráv:", error);
    return NextResponse.json(
      { message: "Chyba při načítání zpráv" },
      { status: 500 }
    );
  }
} 