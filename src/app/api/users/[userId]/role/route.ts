import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Nemáte oprávnění k této akci" },
        { status: 403 }
      );
    }

    const { role } = await req.json();
    const { userId } = params;

    // Kontrola, zda je role validní
    if (!Object.values(Role).includes(role)) {
      return NextResponse.json(
        { message: "Neplatná role" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Chyba při aktualizaci role:", error);
    return NextResponse.json(
      { message: "Chyba při aktualizaci role" },
      { status: 500 }
    );
  }
} 