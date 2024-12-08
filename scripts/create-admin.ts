import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // Vytvoření školy
    const school = await prisma.school.create({
      data: {
        name: "Administrace systému",
        address: "Systémová 1",
        isApproved: true,
        credits: 1000,
      },
    });

    console.log("Škola vytvořena:", school);

    // Vytvoření admin uživatele
    const admin = await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@eduai.cz",
        password: "$2a$12$HByxzyRGlkhvTsPPuhzNcOdnUeGG1yR4pn1Zlma/hi04jl6c1Cwgq", // heslo: admin123
        role: "ADMIN",
        schoolId: school.id,
      },
    });

    console.log("Admin uživatel vytvořen:", admin);
  } catch (error) {
    console.error("Chyba při vytváření záznamů:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 