import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function POST(
  req: Request,
  { params }: { params: { schoolId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user.role !== "ADMIN" && session?.user.role !== "SCHOOL_ADMIN") {
      return NextResponse.json(
        { message: "Nemáte oprávnění k této akci" },
        { status: 403 }
      );
    }

    const { schoolId } = params;

    // Generování nového kódu
    const registrationCode = randomBytes(4).toString("hex").toUpperCase();

    const school = await prisma.school.update({
      where: { id: schoolId },
      data: { registrationCode },
    });

    return NextResponse.json({ registrationCode: school.registrationCode });
  } catch (error) {
    console.error("Chyba při generování registračního kódu:", error);
    return NextResponse.json(
      { message: "Chyba při generování registračního kódu" },
      { status: 500 }
    );
  }
} 