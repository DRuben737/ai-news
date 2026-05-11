
"use client";

import { useEffect, useState } from "react";

export default function PromptsPage() {
  const [prompts, setPrompts] =
    useState<any[]>([]);

  async function loadPrompts() {
    const res = await fetch(
      "/api/prompts"
    );

    const data = await res.json();

    setPrompts(data);
  }

  async function updatePrompt(
    id: number,
    content: string
  ) {
    await fetch("/api/prompts", {
      method: "PATCH",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        id,
        content,
      }),
    });
  }

  useEffect(() => {
    loadPrompts();
  }, []);

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">
        Prompt Management
      </h1>

      <div className="space-y-6">
        {prompts.map((p) => (
          <div
            key={p.id}
            className="border p-4 space-y-3"
          >
            <div className="font-bold">
              {p.key}
            </div>

            <textarea
              className="border w-full p-3 min-h-[300px]"
              defaultValue={p.content}
              onBlur={(e) =>
                updatePrompt(
                  p.id,
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