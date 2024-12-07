import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    const school = await prisma.school.findFirst({
      where: {
        registrationCode: code,
        isApproved: true,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!school) {
      return NextResponse.json(
        { message: "Neplatný nebo expirovaný registrační kód" },
        { status: 400 }
      );
    }

    return NextResponse.json({ school });
  } catch (error) {
    console.error("Chyba při ověřování kódu:", error);
    return NextResponse.json(
      { message: "Chyba při ověřování kódu" },
      { status: 500 }
    );
  }
} 