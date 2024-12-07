import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { schoolId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Není přihlášený uživatel" },
        { status: 401 }
      );
    }

    // Kontrola oprávnění
    if (
      session.user.role !== "ADMIN" &&
      (session.user.role !== "SCHOOL_ADMIN" || session.user.schoolId !== params.schoolId)
    ) {
      return NextResponse.json(
        { message: "Nemáte oprávnění k této akci" },
        { status: 403 }
      );
    }

    const { amount, type } = await req.json();
    const { schoolId } = params;

    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { message: "Neplatný počet kreditů" },
        { status: 400 }
      );
    }

    const school = await prisma.school.findUnique({
      where: { id: schoolId },
    });

    if (!school) {
      return NextResponse.json(
        { message: "Škola nenalezena" },
        { status: 404 }
      );
    }

    // Kontrola dostatku kreditů při odebírání
    if (type === "SUBTRACT" && school.credits < amount) {
      return NextResponse.json(
        { message: "Nedostatek kreditů" },
        { status: 400 }
      );
    }

    // Aktualizace kreditů
    const updatedSchool = await prisma.$transaction([
      prisma.school.update({
        where: { id: schoolId },
        data: {
          credits: type === "ADD" 
            ? { increment: amount }
            : { decrement: amount }
        },
      }),
      prisma.creditHistory.create({
        data: {
          schoolId,
          amount,
          type,
        },
      }),
    ]);

    return NextResponse.json(updatedSchool[0]);
  } catch (error) {
    console.error("Chyba při aktualizaci kreditů:", error);
    return NextResponse.json(
      { message: "Chyba při aktualizaci kreditů" },
      { status: 500 }
    );
  }
} 