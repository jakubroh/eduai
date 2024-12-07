import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, address, adminEmail, adminPassword, adminName } = await req.json();

    // Kontrola, zda email již není použitý
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email je již používán" },
        { status: 400 }
      );
    }

    // Vytvoření školy a administrátora
    const hashedPassword = await hash(adminPassword, 12);

    const school = await prisma.school.create({
      data: {
        name,
        address,
        users: {
          create: {
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: "SCHOOL_ADMIN",
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Škola byla úspěšně zaregistrována" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Chyba při registraci školy:", error);
    return NextResponse.json(
      { message: "Chyba při registraci školy" },
      { status: 500 }
    );
  }
} 