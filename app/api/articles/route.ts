import { db } from "@/lib/db";

export async function GET() {
  const articles = await db.article.findMany({
    orderBy: {
      publishedAt: "desc",
    },

    take: 20,

    select: {
      id: true,
      title: true,
      summary: true,
      publishedAt: true,
    },
  });

  return Response.json(articles);
}