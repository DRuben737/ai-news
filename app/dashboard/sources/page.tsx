"use client";

import { useEffect, useState } from "react";

export default function SourcesPage() {
  const [sources, setSources] =
    useState<any[]>([]);

  const [name, setName] =
    useState("");

  const [url, setUrl] =
    useState("");

  const [bulkInput, setBulkInput] =
    useState("");

  const [opmlFile, setOpmlFile] =
    useState<File | null>(null);

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

  async function addBulkSources() {
    const lines = bulkInput
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    for (const line of lines) {
      const parts = line.split(",");

      const sourceName =
        parts[0]?.trim();

      const sourceUrl =
        parts[1]?.trim();

      if (!sourceName || !sourceUrl)
        continue;

      await fetch("/api/sources", {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          name: sourceName,
          url: sourceUrl,
        }),
      });
    }

    setBulkInput("");

    loadSources();
  }

  async function importOPML() {
    if (!opmlFile) return;

    const text =
      await new Promise<string>(
        (resolve, reject) => {
          const reader =
            new FileReader();

          reader.onload = () =>
            resolve(
              reader.result as string
            );

          reader.onerror = () =>
            reject(
              new Error(
                "Failed to read file"
              )
            );

          reader.readAsText(opmlFile);
        }
      );

    const parser = new DOMParser();

    const xml = parser.parseFromString(
      text,
      "text/xml"
    );

    const outlines = Array.from(
      xml.querySelectorAll("outline")
    );

    for (const outline of outlines) {
      const title =
        outline.getAttribute("title") ||
        outline.getAttribute("text");

      const xmlUrl =
        outline.getAttribute("xmlUrl");

      if (!title || !xmlUrl)
        continue;

      await fetch("/api/sources", {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          name: title,
          url: xmlUrl,
        }),
      });
    }

    setOpmlFile(null);

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

      <div className="space-y-3 border p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition">
        <div className="text-lg font-semibold">
          Add Single RSS
        </div>

        <input
          className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 transition"
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 transition"
          placeholder="RSS URL"
          value={url}
          onChange={(e) =>
            setUrl(e.target.value)
          }
        />

        <button
          className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-80 transition cursor-pointer"
          onClick={addSource}
        >
          Add RSS
        </button>
      </div>

      <div className="space-y-3 border p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition">
        <div className="text-lg font-semibold">
          Bulk Import RSS
        </div>

        <div className="text-sm text-gray-500">
          Paste:
          Name,https://rss-url.xml
        </div>

        <textarea
          className="border p-3 w-full h-48 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
          placeholder={
            "FAA,https://www.faa.gov/rss/news_updates.xml\nNTSB,https://www.ntsb.gov/news/rss.xml"
          }
          value={bulkInput}
          onChange={(e) =>
            setBulkInput(
              e.target.value
            )
          }
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          onClick={addBulkSources}
        >
          Import RSS List
        </button>

        <div className="border-t pt-4 space-y-3">
          <div className="text-lg font-semibold">
            Import OPML
          </div>

          <input
            type="file"
            accept=".opml,.xml,text/xml"
            onChange={(e) => {
              const file =
                e.target.files?.[0];

              if (file)
                setOpmlFile(file);
            }}
          />

          <button
            className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-80 transition cursor-pointer"
            onClick={importOPML}
          >
            Import OPML File
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {sources.map((s) => (
          <div
            key={s.id}
            className="border rounded-xl p-4 space-y-3 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-200"
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
                className="border px-3 py-1 rounded-lg hover:bg-gray-100 transition cursor-pointer"
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
                className="border px-3 py-1 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
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