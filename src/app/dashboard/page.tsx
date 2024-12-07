import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  let stats = {
    totalCredits: 0,
    usedCredits: 0,
    totalChats: 0,
    totalMessages: 0,
  };

  if (session?.user.role === "ADMIN") {
    // Statistiky pro admina - všechny školy
    const [credits, chats, messages] = await Promise.all([
      prisma.school.aggregate({
        _sum: { credits: true },
      }),
      prisma.chat.count(),
      prisma.message.count(),
    ]);

    stats.totalCredits = credits._sum.credits || 0;
    stats.totalChats = chats;
    stats.totalMessages = messages;
  } else if (session?.user.role === "SCHOOL_ADMIN" && session?.user.schoolId) {
    // Statistiky pro školního admina - jen jeho škola
    const [school, chats, messages] = await Promise.all([
      prisma.school.findUnique({
        where: { id: session.user.schoolId },
      }),
      prisma.chat.count({
        where: {
          user: {
            schoolId: session.user.schoolId,
          },
        },
      }),
      prisma.message.count({
        where: {
          chat: {
            user: {
              schoolId: session.user.schoolId,
            },
          },
        },
      }),
    ]);

    stats.totalCredits = school?.credits || 0;
    stats.totalChats = chats;
    stats.totalMessages = messages;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Dostupné kredity</h3>
          <p className="text-3xl font-bold">{stats.totalCredits}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Použité kredity</h3>
          <p className="text-3xl font-bold">{stats.usedCredits}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Celkem chatů</h3>
          <p className="text-3xl font-bold">{stats.totalChats}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Celkem zpráv</h3>
          <p className="text-3xl font-bold">{stats.totalMessages}</p>
        </div>
      </div>
    </div>
  );
} 