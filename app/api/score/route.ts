import { db } from "@/lib/db";
import { scoreTitle } from "@/lib/local-ai";

export async function GET() {
  const articles = await db.article.findMany({
    take: 20,

    orderBy: {
      publishedAt: "desc",
    },
  });

  const results = [];

  for (const article of articles) {
    const score = await scoreTitle(
      article.title,
      {
        blacklist: [
          "politics",
          "sports",
        ],
      }
    );

    results.push({
      title: article.title,
      score,
    });
  }

  return Response.json(results);
}