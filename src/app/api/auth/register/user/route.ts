import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, password, schoolId, registrationCode } = await req.json();

    // Ověření registračního kódu
    const school = await prisma.school.findFirst({
      where: {
        id: schoolId,
        registrationCode,
        isApproved: true,
      },
    });

    if (!school) {
      return NextResponse.json(
        { message: "Neplatný registrační kód nebo škola" },
        { status: 400 }
      );
    }

    // Kontrola, zda email již není použitý
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email je již používán" },
        { status: 400 }
      );
    }

    // Vytvoření uživatele
    const hashedPassword = await hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        schoolId,
        role: "USER",
      },
    });

    return NextResponse.json(
      { message: "Uživatel byl úspěšně zaregistrován" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Chyba při registraci uživatele:", error);
    return NextResponse.json(
      { message: "Chyba při registraci uživatele" },
      { status: 500 }
    );
  }
} 