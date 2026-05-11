import { db } from "@/lib/db";
import { callLLM } from "@/lib/ai";

export async function GET() {
  const articles = await db.article.findMany({
    where: {
      summary: {
        not: null,
      },
    },

    orderBy: {
      publishedAt: "desc",
    },

    take: 10,
  });

  const content = articles
    .map((a: typeof articles[number]) => {
      return `
标题：
${a.title}

摘要：
${a.summary}
`;
    })
    .join("\n\n");

  const promptRecord =
    await db.prompt.findUnique({
      where: {
        key: "digest",
      },
    });

  const template =
    promptRecord?.content ||
    `
请整理成一份航空安全简报。

面向对象：
- CFII
- 飞行教员
- 通航飞行员
- 美国飞行员

要求：
- 中文
- 简洁
- 按安全重要性排序
- 标出 FAA/NTSB/事故/训练风险相关内容
- markdown格式

内容：
{{content}}
`;

  const prompt = template.replace(
    "{{content}}",
    content
  );

  const digest = await callLLM(
    prompt
  );

  return Response.json({
    digest,
  });
}