import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: "Neautorizovaný přístup" },
        { status: 401 }
      );
    }

    const chats = await prisma.chat.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          take: 1, // Získáme pouze první zprávu pro náhled
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(chats);
  } catch (error) {
    console.error("Chyba při načítání historie:", error);
    return NextResponse.json(
      { message: "Chyba při načítání historie" },
      { status: 500 }
    );
  }
} 