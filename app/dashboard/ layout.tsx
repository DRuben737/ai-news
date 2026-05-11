

import Link from "next/link";
import type { ReactNode } from "react";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-black text-white p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">
            ✈️ CFII Intel
          </h1>

          <p className="text-sm text-gray-400 mt-2">
            Aviation Intelligence Dashboard
          </p>
        </div>

        <nav className="space-y-2">
          <Link
            href="/dashboard/sources"
            className="block px-3 py-2 rounded hover:bg-gray-800"
          >
            RSS Sources
          </Link>

          <Link
            href="/dashboard/prompts"
            className="block px-3 py-2 rounded hover:bg-gray-800"
          >
            Prompts
          </Link>

          <Link
            href="/dashboard/settings"
            className="block px-3 py-2 rounded hover:bg-gray-800"
          >
            Settings
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}