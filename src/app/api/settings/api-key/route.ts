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

    const { key, value } = await req.json();
    
    // Kontrola, zda je klíč validní
    if (!["ANTHROPIC_API_KEY", "GOOGLE_API_KEY"].includes(key)) {
      return NextResponse.json(
        { message: "Neplatný typ API klíče" },
        { status: 400 }
      );
    }

    // Zašifrování API klíče před uložením
    const encryptedKey = await encrypt(value);

    // Uložení do databáze
    await prisma.settings.upsert({
      where: { key },
      update: { value: encryptedKey },
      create: {
        key,
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