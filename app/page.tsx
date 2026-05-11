import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold">AI News Dashboard</h1>
          <p className="text-zinc-400 mt-2">
            RSS + LLM + Digest
          </p>
        </div>

        <div className="flex gap-2">
          <Input placeholder="Search news..." />
          <Button>Search</Button>
        </div>

        <div className="grid gap-4">
          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardContent className="p-6 space-y-2">
              <h2 className="text-xl font-semibold">
                OpenAI released GPT-5
              </h2>

              <p className="text-zinc-400 text-sm">
                Multiple sources are discussing benchmark improvements,
                agent capabilities, and pricing changes.
              </p>

              <div className="text-xs text-zinc-500">
                OpenAI · Twitter · HackerNews
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}