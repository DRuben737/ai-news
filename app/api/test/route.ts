import { db } from "@/lib/db";

export async function GET() {
  const sources = await db.source.findMany();

  return Response.json(sources);
}