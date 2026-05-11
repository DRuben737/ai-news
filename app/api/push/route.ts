import { callLLM } from "@/lib/ai";
import { db } from "@/lib/db";
import { pushToFeishu } from "@/lib/push";

export async function GET() {
  const pushedIds = (
    await db.pushMemory.findMany()
  ).map((p: { articleId: number }) => p.articleId);

  const articles =
    await db.article.findMany({
      where: {
        summary: {
          not: null,
        },

        id: {
          notIn: pushedIds,
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
        key: "push",
      },
    });

  const template =
    promptRecord?.content ||
    `
请把下面航空安全信息整理为 JSON 数组。

返回格式：
[
  {
    "level": "HIGH | MEDIUM | LOW",
    "type": "FAA | NTSB | Accident | Training | Weather | Airspace",
    "title": "标题",
    "summary": "一句话总结"
  }
]

要求：
- 只返回 JSON
- 不要 markdown
- 不要代码块
- HIGH 表示重大事故/FAA/NTSB
- summary 不超过 80 字

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

  let parsed: any[] = [];

  try {
    parsed = JSON.parse(digest);
  } catch {
    parsed = [
      {
        level: "MEDIUM",
        type: "General",
        title: "AI Parse Failed",
        summary: digest,
      },
    ];
  }

  await pushToFeishu(JSON.stringify(parsed, null, 2));

  await db.pushMemory.createMany({
    data: articles.map((a) => ({
      articleId: a.id,
      title: a.title,
    })),

    skipDuplicates: true,
  });

  return Response.json({
    success: true,
    digest: parsed,
  });
}