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

    if (session?.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Nemáte oprávnění k této akci" },
        { status: 403 }
      );
    }

    const { isApproved } = await req.json();
    const { schoolId } = params;

    const school = await prisma.school.update({
      where: { id: schoolId },
      data: { isApproved },
    });

    return NextResponse.json(school);
  } catch (error) {
    console.error("Chyba při aktualizaci školy:", error);
    return NextResponse.json(
      { message: "Chyba při aktualizaci školy" },
      { status: 500 }
    );
  }
} 