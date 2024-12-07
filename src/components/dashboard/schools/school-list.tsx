"use client";

import { useState } from "react";
import { School, Prisma } from "@prisma/client";
import toast from "react-hot-toast";

type SchoolWithCount = Prisma.SchoolGetPayload<{
  include: { _count: { select: { users: true } } };
}>;

interface SchoolListProps {
  schools: SchoolWithCount[];
}

export function SchoolList({ schools: initialSchools }: SchoolListProps) {
  const [schools, setSchools] = useState(initialSchools);

  async function toggleApproval(schoolId: string, currentStatus: boolean) {
    try {
      const response = await fetch(`/api/schools/${schoolId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: !currentStatus }),
      });

      if (!response.ok) throw new Error("Akce se nezdařila");

      setSchools(schools.map(school => 
        school.id === schoolId 
          ? { ...school, isApproved: !currentStatus }
          : school
      ));

      toast.success(`Škola byla ${!currentStatus ? "schválena" : "zamítnuta"}`);
    } catch (error) {
      toast.error("Nepodařilo se změnit stav školy");
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Název
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Adresa
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Uživatelé
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kredity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stav
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Akce
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {schools.map((school) => (
            <tr key={school.id}>
              <td className="px-6 py-4 whitespace-nowrap">{school.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{school.address}</td>
              <td className="px-6 py-4 whitespace-nowrap">{school._count.users}</td>
              <td className="px-6 py-4 whitespace-nowrap">{school.credits}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  school.isApproved 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {school.isApproved ? "Schváleno" : "Čeká na schválení"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => toggleApproval(school.id, school.isApproved)}
                  className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                    school.isApproved
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {school.isApproved ? "Zamítnout" : "Schválit"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 