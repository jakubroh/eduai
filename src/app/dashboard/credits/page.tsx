import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreditManagement } from "@/components/dashboard/credits/credit-management";

export default async function CreditsPage() {
  const session = await getServerSession(authOptions);

  if (!session) return null;

  const schools = await prisma.school.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: { users: true },
      },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Správa kreditů</h1>
      <CreditManagement 
        schools={schools} 
        isAdmin={session.user.role === "ADMIN"}
        currentSchoolId={session.user.schoolId}
      />
    </div>
  );
} 