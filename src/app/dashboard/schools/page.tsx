import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SchoolList } from "@/components/dashboard/schools/school-list";

export default async function SchoolsPage() {
  const session = await getServerSession(authOptions);

  if (session?.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const schools = await prisma.school.findMany({
    include: {
      _count: {
        select: { users: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Správa škol</h1>
      <SchoolList schools={schools} />
    </div>
  );
} 