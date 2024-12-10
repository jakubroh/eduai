"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [anthropicApiKey, setAnthropicApiKey] = useState("");
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [loading, setLoading] = useState(false);

  if (session?.user.role !== "ADMIN") {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Nastavení</h1>
        <p className="text-red-600">Nemáte oprávnění k přístupu na tuto stránku.</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // Uložení Anthropic API klíče
      if (anthropicApiKey) {
        const anthropicResponse = await fetch("/api/settings/api-key", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            key: "ANTHROPIC_API_KEY",
            value: anthropicApiKey 
          }),
        });

        if (!anthropicResponse.ok) throw new Error("Aktualizace Anthropic API klíče se nezdařila");
      }

      // Uložení Google API klíče
      if (googleApiKey) {
        const googleResponse = await fetch("/api/settings/api-key", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            key: "GOOGLE_API_KEY",
            value: googleApiKey 
          }),
        });

        if (!googleResponse.ok) throw new Error("Aktualizace Google API klíče se nezdařila");
      }

      toast.success("API klíče byly úspěšně aktualizovány");
      setAnthropicApiKey("");
      setGoogleApiKey("");
    } catch (error) {
      toast.error("Nepodařilo se aktualizovat API klíče");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Nastavení API</h1>
      
      <div className="max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="anthropicApiKey" className="block text-sm font-medium text-gray-700 mb-1">
              Anthropic API Klíč
            </label>
            <input
              id="anthropicApiKey"
              type="password"
              value={anthropicApiKey}
              onChange={(e) => setAnthropicApiKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="sk-ant-api03-..."
            />
            <p className="mt-1 text-sm text-gray-500">
              API klíč získáte na stránkách Anthropic v sekci API Keys.
            </p>
          </div>

          <div>
            <label htmlFor="googleApiKey" className="block text-sm font-medium text-gray-700 mb-1">
              Google API Klíč
            </label>
            <input
              id="googleApiKey"
              type="password"
              value={googleApiKey}
              onChange={(e) => setGoogleApiKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="AIzaSyC..."
            />
            <p className="mt-1 text-sm text-gray-500">
              API klíč získáte v Google Cloud Console.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || (!anthropicApiKey && !googleApiKey)}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
          >
            {loading ? "Ukládám..." : "Uložit API klíče"}
          </button>
        </form>
      </div>
    </div>
  );
} 