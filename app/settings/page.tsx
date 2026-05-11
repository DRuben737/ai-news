"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] =
    useState<any[]>([]);

  async function loadSettings() {
    const res = await fetch(
      "/api/settings"
    );

    const data = await res.json();

    setSettings(data);
  }

  async function updateSetting(
    id: number,
    value: string
  ) {
    await fetch("/api/settings", {
      method: "PATCH",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        id,
        value,
      }),
    });
  }

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">
        Settings
      </h1>

      <div className="space-y-4">
        {settings.map((s) => (
          <div
            key={s.id}
            className="border p-4 space-y-2"
          >
            <div className="font-bold">
              {s.key}
            </div>

            <input
              className="border p-2 w-full"
              defaultValue={s.value}
              onBlur={(e) =>
                updateSetting(
                  s.id,
                  e.target.value
                )
              }
            />
          </div>
        ))}
      </div>
    </main>
  );
}