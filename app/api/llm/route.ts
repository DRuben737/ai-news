import { callLLM } from "@/lib/ai";

export async function GET() {
  const result = await callLLM(
    "Reply only with OK"
  );

  return Response.json({
    result,
  });
}