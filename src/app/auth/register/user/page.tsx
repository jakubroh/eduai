"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function UserRegistration() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [registrationCode, setRegistrationCode] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [schoolInfo, setSchoolInfo] = useState<{ id: string; name: string } | null>(null);

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: registrationCode }),
      });

      if (!response.ok) {
        throw new Error("Neplatný registrační kód");
      }

      const data = await response.json();
      setSchoolInfo(data.school);
      setShowForm(true);
      toast.success("Kód ověřen");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Něco se pokazilo");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      schoolId: schoolInfo?.id,
      registrationCode,
    };

    try {
      const response = await fetch("/api/auth/register/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      toast.success("Registrace byla úspěšná");
      router.push("/auth/signin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Něco se pokazilo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Registrace uživatele
          </h2>
        </div>

        {!showForm ? (
          <form onSubmit={verifyCode} className="mt-8 space-y-6">
            <div>
              <label htmlFor="registrationCode" className="block text-sm font-medium text-gray-700">
                Registrační kód školy
              </label>
              <input
                id="registrationCode"
                name="registrationCode"
                type="text"
                required
                value={registrationCode}
                onChange={(e) => setRegistrationCode(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Zadejte registrační kód"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !registrationCode}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {loading ? "Ověřuji..." : "Ověřit kód"}
            </button>
          </form>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="name" className="sr-only">
                  Jméno
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Jméno"
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Heslo
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Heslo"
                />
              </div>
            </div>

            {schoolInfo && (
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-blue-700">
                  Registrujete se do školy: <strong>{schoolInfo.name}</strong>
                </p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
              >
                {loading ? "Registruji..." : "Registrovat se"}
              </button>
            </div>
          </form>
        )}

        <div className="text-center">
          <Link href="/auth/signin" className="text-blue-600 hover:text-blue-800">
            Již máte účet? Přihlaste se
          </Link>
        </div>
      </div>
    </div>
  );
} 