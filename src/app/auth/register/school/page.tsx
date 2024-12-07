"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SchoolRegistration() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      adminEmail: formData.get("adminEmail") as string,
      adminPassword: formData.get("adminPassword") as string,
      adminName: formData.get("adminName") as string,
    };

    try {
      const response = await fetch("/api/auth/register/school", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      toast.success("Registrace byla úspěšná. Čeká na schválení.");
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
            Registrace školy
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Název školy
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Název školy"
              />
            </div>
            <div>
              <label htmlFor="address" className="sr-only">
                Adresa
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Adresa školy"
              />
            </div>
            <div>
              <label htmlFor="adminName" className="sr-only">
                Jméno administrátora
              </label>
              <input
                id="adminName"
                name="adminName"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Jméno administrátora"
              />
            </div>
            <div>
              <label htmlFor="adminEmail" className="sr-only">
                Email administrátora
              </label>
              <input
                id="adminEmail"
                name="adminEmail"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email administrátora"
              />
            </div>
            <div>
              <label htmlFor="adminPassword" className="sr-only">
                Heslo
              </label>
              <input
                id="adminPassword"
                name="adminPassword"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Heslo"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {loading ? "Registruji..." : "Registrovat školu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 