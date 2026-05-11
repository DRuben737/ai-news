"use client";

import { useEffect, useState } from "react";

export default function SourcesPage() {
  const [sources, setSources] =
    useState<any[]>([]);

  const [name, setName] =
    useState("");

  const [url, setUrl] =
    useState("");

  async function loadSources() {
    const res = await fetch(
      "/api/sources"
    );

    const data = await res.json();

    setSources(data);
  }

  async function addSource() {
    await fetch("/api/sources", {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        name,
        url,
      }),
    });

    setName("");
    setUrl("");

    loadSources();
  }

  async function deleteSource(
    id: number
  ) {
    await fetch("/api/sources", {
      method: "DELETE",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        id,
      }),
    });

    loadSources();
  }

  async function toggleSource(
    id: number,
    enabled: boolean
  ) {
    await fetch("/api/sources", {
      method: "PATCH",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        id,
        enabled,
      }),
    });

    loadSources();
  }

  useEffect(() => {
    loadSources();
  }, []);

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">
        RSS Sources
      </h1>

      <div className="space-y-2">
        <input
          className="border p-2 w-full"
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          className="border p-2 w-full"
          placeholder="RSS URL"
          value={url}
          onChange={(e) =>
            setUrl(e.target.value)
          }
        />

        <button
          className="bg-black text-white px-4 py-2"
          onClick={addSource}
        >
          Add
        </button>
      </div>

      <div className="space-y-2">
        {sources.map((s) => (
          <div
            key={s.id}
            className="border p-3 space-y-2"
          >
            <div className="font-medium">
              {s.name}
            </div>

            <div className="text-sm text-gray-500 break-all">
              {s.url}
            </div>

            <div className="text-xs text-gray-400">
              Last Fetch:{" "}
              {s.lastFetched
                ? new Date(
                    s.lastFetched
                  ).toLocaleString()
                : "Never"}
            </div>

            {s.lastError && (
              <div className="text-xs text-red-500">
                Error: {s.lastError}
              </div>
            )}

            <div className="flex gap-2">
              <button
                className="border px-2 py-1"
                onClick={() =>
                  toggleSource(
                    s.id,
                    !s.enabled
                  )
                }
              >
                {s.enabled
                  ? "Disable"
                  : "Enable"}
              </button>

              <button
                className="border px-2 py-1 text-red-500"
                onClick={() =>
                  deleteSource(s.id)
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}