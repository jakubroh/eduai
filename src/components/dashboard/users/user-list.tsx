"use client";

import { useState } from "react";
import { User, School, Role } from "@prisma/client";
import toast from "react-hot-toast";

type UserWithSchool = User & {
  school: School | null;
};

interface UserListProps {
  users: UserWithSchool[];
  currentUserRole: Role;
}

export function UserList({ users: initialUsers, currentUserRole }: UserListProps) {
  const [users, setUsers] = useState(initialUsers);

  async function updateUserRole(userId: string, newRole: Role) {
    try {
      const response = await fetch(`/api/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) throw new Error("Akce se nezdařila");

      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, role: newRole }
          : user
      ));

      toast.success("Role uživatele byla aktualizována");
    } catch (error) {
      toast.error("Nepodařilo se aktualizovat roli uživatele");
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jméno
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Škola
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            {currentUserRole === "ADMIN" && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Akce
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.school?.name || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.role === "ADMIN" && "Administrátor"}
                {user.role === "SCHOOL_ADMIN" && "Správce školy"}
                {user.role === "USER" && "Uživatel"}
              </td>
              {currentUserRole === "ADMIN" && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value as Role)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    disabled={user.role === "ADMIN"}
                  >
                    <option value="USER">Uživatel</option>
                    <option value="SCHOOL_ADMIN">Správce školy</option>
                    <option value="ADMIN">Administrátor</option>
                  </select>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 