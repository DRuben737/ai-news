import { db } from "@/lib/db";
import { fetchFeed } from "@/lib/rss";

export async function GET() {
  const sources =
    await db.source.findMany({
      where: {
        enabled: true,
      },
    });

  let total = 0;

for (const source of sources) {
  try {
    const items =
      await fetchFeed(source.url);

    total += items.length;

    for (const item of items) {
      await db.article.upsert({
        where: {
          url: item.link,
        },

        update: {},

        create: {
          title: item.title,
          url: item.link,
          content: item.content,

          publishedAt:
            item.pubDate
              ? new Date(
                  item.pubDate
                )
              : null,

          sourceId: source.id,
        },
      });
    }

    await db.source.update({
      where: {
        id: source.id,
      },

      data: {
        lastFetched: new Date(),
        lastError: null,
      },
    });
  } catch (err: any) {
    await db.source.update({
      where: {
        id: source.id,
      },

      data: {
        lastError:
          err?.message ||
          "Unknown error",
      },
    });
  }
}

  return Response.json({
    success: true,
    total,
  });
}