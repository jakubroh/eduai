"use client";

import { ModelSettings as ModelSettingsType } from "@/types/chat";

interface ModelSettingsProps {
  settings: ModelSettingsType;
  onSettingsChange: (settings: ModelSettingsType) => void;
}

export function ModelSettings({ settings, onSettingsChange }: ModelSettingsProps) {
  function handleTemperatureChange(value: string) {
    const temperature = parseFloat(value);
    if (temperature >= 0 && temperature <= 1) {
      onSettingsChange({
        ...settings,
        temperature
      });
    }
  }

  function handleMaxTokensChange(value: string) {
    const maxTokens = parseInt(value);
    if (maxTokens >= 512 && maxTokens <= 2048) {
      onSettingsChange({
        ...settings,
        maxTokens
      });
    }
  }

  return (
    <div className="p-4 border-b">
      <h3 className="font-medium mb-2">Nastavení modelu</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm">Kreativita (Temperature)</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.temperature}
            onChange={(e) => handleTemperatureChange(e.target.value)}
            className="w-full"
          />
          <div className="text-xs text-gray-500 mt-1">
            Hodnota: {settings.temperature}
          </div>
        </div>
        
        <div>
          <label className="block text-sm">Max. délka odpovědi</label>
          <select
            value={settings.maxTokens}
            onChange={(e) => handleMaxTokensChange(e.target.value)}
            className="w-full border rounded p-1"
          >
            <option value="512">Krátká (512 tokenů)</option>
            <option value="1024">Střední (1024 tokenů)</option>
            <option value="2048">Dlouhá (2048 tokenů)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm">Role asistenta</label>
          <select
            value={settings.systemPrompt}
            onChange={(e) => onSettingsChange({
              ...settings,
              systemPrompt: e.target.value
            })}
            className="w-full border rounded p-1"
          >
            <option value="teacher">Učitel</option>
            <option value="essayHelper">Pomocník s psaním</option>
            <option value="mathTutor">Matematický tutor</option>
          </select>
        </div>
      </div>
    </div>
  );
} 