import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserList } from "@/components/dashboard/users/user-list";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  if (!session) return null;

  const users = await prisma.user.findMany({
    where: session.user.role === "SCHOOL_ADMIN" 
      ? { schoolId: session.user.schoolId }
      : undefined,
    include: {
      school: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Správa uživatelů</h1>
      <UserList users={users} currentUserRole={session.user.role} />
    </div>
  );
} 