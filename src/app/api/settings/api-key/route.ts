import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { encrypt } from "@/lib/crypto";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Nemáte oprávnění k této akci" },
        { status: 403 }
      );
    }

    const { apiKey } = await req.json();
    
    // Zašifrování API klíče před uložením
    const encryptedKey = await encrypt(apiKey);

    // Uložení do databáze
    await prisma.settings.upsert({
      where: { key: "ANTHROPIC_API_KEY" },
      update: { value: encryptedKey },
      create: {
        key: "ANTHROPIC_API_KEY",
        value: encryptedKey,
      },
    });

    return NextResponse.json({ message: "API klíč byl úspěšně uložen" });
  } catch (error) {
    console.error("Chyba při ukládání API klíče:", error);
    return NextResponse.json(
      { message: "Chyba při ukládání API klíče" },
      { status: 500 }
    );
  }
} 