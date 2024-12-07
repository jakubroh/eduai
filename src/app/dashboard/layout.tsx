import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="flex h-screen">
      <DashboardNav user={session.user} />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
} 