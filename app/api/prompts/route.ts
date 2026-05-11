

import { db } from "@/lib/db";

export async function GET() {
  const prompts =
    await db.prompt.findMany({
      orderBy: {
        key: "asc",
      },
    });

  if (prompts.length === 0) {
    await db.prompt.createMany({
      data: [
        {
          key: "summary",
          content: `
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
`,
          updatedAt: new Date(),
        },
        {
          key: "digest",
          content: `
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
`,
          updatedAt: new Date(),
        },
        {
          key: "push",
          content: `
请整理成一份适合飞书推送的航空安全快讯。

要求：
- 中文
- 简洁
- markdown格式
- 强调 FAA / NTSB / 事故重点

内容：
{{content}}
`,
          updatedAt: new Date(),
        },
        {
          key: "score",
          content: `
请为这条航空相关信息的重要性打分。

评分标准：
- FAA、NTSB、航空事故、事故调查、安全报告、适航指令、飞行训练风险：高分
- 娱乐、商业宣传、无关新闻：0分

只返回 0.0-1.0 数字。

标题：
{{title}}
`,
          updatedAt: new Date(),
        },
      ],
    });

    const newPrompts =
      await db.prompt.findMany({
        orderBy: {
          key: "asc",
        },
      });

    return Response.json(newPrompts);
  }

  return Response.json(prompts);
}

export async function PATCH(
  req: Request
) {
  const body = await req.json();

  const prompt =
    await db.prompt.update({
      where: {
        id: body.id,
      },

      data: {
        content: body.content,
      },
    });

  return Response.json(prompt);
}