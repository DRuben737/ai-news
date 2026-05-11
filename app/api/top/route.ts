import { db } from "@/lib/db";
import { callLLM } from "@/lib/ai";

export async function GET() {
  const articles = await db.article.findMany({
    where: {
      summary: null,
    },

    orderBy: {
      publishedAt: "desc",
    },

    take: 5,
  });

  for (const article of articles) {
    const promptRecord =
      await db.prompt.findUnique({
        where: {
          key: "summary",
        },
      });

    const template =
      promptRecord?.content ||
      `
请用中文总结下面航空安全新闻。

要求：
- 中文
- 简洁
- 适合 CFII / 飞行员阅读
- 提取 FAA / NTSB / 安全风险重点

标题：
{{title}}

内容：
{{content}}
`;

    const prompt = template
      .replace(
        "{{title}}",
        article.title
      )
      .replace(
        "{{content}}",
        article.content || ""
      );

    const summary =
      await callLLM(prompt);

    await db.article.update({
      where: {
        id: article.id,
      },

      data: {
        summary,
      },
    });
  }

  return Response.json({
    success: true,
  });
}