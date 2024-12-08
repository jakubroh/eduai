"use client";

import { useState } from "react";
import { PrismaClient, type Prisma } from "@prisma/client";
import toast from "react-hot-toast";

type SchoolWithCount = Prisma.SchoolGetPayload<{
  include: { _count: { select: { users: true } } };
}>;

interface CreditManagementProps {
  schools: SchoolWithCount[];
  isAdmin: boolean;
  currentSchoolId?: string;
}

export function CreditManagement({ schools: initialSchools, isAdmin, currentSchoolId }: CreditManagementProps) {
  const [schools, setSchools] = useState(initialSchools);
  const [selectedSchool, setSelectedSchool] = useState<string>(currentSchoolId || "");
  const [creditAmount, setCreditAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const filteredSchools = isAdmin 
    ? schools 
    : schools.filter(school => school.id === currentSchoolId);

  async function handleCreditUpdate(type: "ADD" | "SUBTRACT") {
    if (!selectedSchool || creditAmount <= 0) {
      toast.error("Vyberte školu a zadejte počet kreditů");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/schools/${selectedSchool}/credits`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: creditAmount, type }),
      });

      if (!response.ok) throw new Error("Akce se nezdařila");

      const updatedSchool = await response.json();

      setSchools(schools.map(school => 
        school.id === selectedSchool 
          ? { ...school, credits: updatedSchool.credits }
          : school
      ));

      toast.success(`Kredity byly ${type === "ADD" ? "přidány" : "odebrány"}`);
      setCreditAmount(0);
    } catch (error) {
      toast.error("Nepodařilo se aktualizovat kredity");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Škola
            </label>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={!isAdmin && currentSchoolId !== ""}
            >
              <option value="">Vyberte školu</option>
              {filteredSchools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name} (Současné kredity: {school.credits})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Počet kreditů
            </label>
            <input
              type="number"
              min="0"
              value={creditAmount}
              onChange={(e) => setCreditAmount(Math.max(0, parseInt(e.target.value) || 0))}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          <button
            onClick={() => handleCreditUpdate("ADD")}
            disabled={loading || !selectedSchool || creditAmount <= 0}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
          >
            Přidat kredity
          </button>
          <button
            onClick={() => handleCreditUpdate("SUBTRACT")}
            disabled={loading || !selectedSchool || creditAmount <= 0}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400"
          >
            Odebrat kredity
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Škola
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Počet uživatelů
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dostupné kredity
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSchools.map((school) => (
              <tr key={school.id}>
                <td className="px-6 py-4 whitespace-nowrap">{school.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{school._count.users}</td>
                <td className="px-6 py-4 whitespace-nowrap">{school.credits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 