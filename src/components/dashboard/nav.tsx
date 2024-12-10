"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "next-auth";
import { cn } from "@/lib/utils";

interface NavProps {
  user: User;
}

export function DashboardNav({ user }: NavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      title: "Přehled",
      href: "/dashboard",
      show: true,
    },
    {
      title: "Správa škol",
      href: "/dashboard/schools",
      show: user.role === "ADMIN",
    },
    {
      title: "Správa uživatelů",
      href: "/dashboard/users",
      show: user.role === "ADMIN" || user.role === "SCHOOL_ADMIN",
    },
    {
      title: "Kredity",
      href: "/dashboard/credits",
      show: user.role === "ADMIN" || user.role === "SCHOOL_ADMIN",
    },
    {
      title: "Chat",
      href: "/dashboard/chat",
      show: true,
    },
    {
      title: "Nastavení API",
      href: "/dashboard/settings",
      show: user.role === "ADMIN",
    },
  ];

  return (
    <nav className="w-64 bg-gray-800 text-white p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold">EduAI Dashboard</h2>
        <p className="text-sm text-gray-400">{user.name}</p>
        <p className="text-xs text-gray-500">{user.email}</p>
      </div>
      <ul className="space-y-2">
        {navItems
          .filter((item) => item.show)
          .map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "block px-4 py-2 rounded-md hover:bg-gray-700 transition-colors",
                  pathname === item.href && "bg-gray-700"
                )}
              >
                {item.title}
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  );
} 