"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export function CreditDisplay() {
  const { data: session } = useSession();
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCredits() {
      if (session?.user.schoolId) {
        const response = await fetch(`/api/schools/${session.user.schoolId}/credits`);
        if (response.ok) {
          const data = await response.json();
          setCredits(data.credits);
        }
      }
    }

    fetchCredits();
  }, [session]);

  if (credits === null) return null;

  return (
    <div className="text-sm text-gray-600">
      Dostupné kredity: <span className="font-bold">{credits}</span>
    </div>
  );
} 