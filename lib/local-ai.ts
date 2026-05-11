import { db } from "@/lib/db";
const OLLAMA_URL =
  process.env.OLLAMA_URL ||
  "http://192.168.1.20:11434/api/generate";

const PRIMARY_MODEL =
  process.env.LOCAL_LLM_MODEL ||
  "qwen2.5:1.5b";

const FALLBACK_MODEL =
  process.env.LOCAL_LLM_FALLBACK ||
  "tinyllama:latest";

function containsKeyword(
  text: string,
  keywords: string[]
) {
  const lower = text.toLowerCase();

  return keywords.some((k) =>
    lower.includes(k.toLowerCase())
  );
}

export function parseScore(
  text: string
) {
  const match = text.match(
    /([01](?:\.\d+)?)/
  );

  if (!match) return 0;

  const score = parseFloat(match[1]);

  return Math.max(
    0,
    Math.min(1, score)
  );
}

async function callModel(
  prompt: string,
  model: string
) {
  const response = await fetch(
    OLLAMA_URL,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        model,
        prompt,
        stream: false,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Model request failed: ${model}`
    );
  }

  const data = await response.json();

  return data.response || "";
}

export async function tryModels(
  prompt: string
) {
  try {
    return await callModel(
      prompt,
      PRIMARY_MODEL
    );
  } catch {
    return await callModel(
      prompt,
      FALLBACK_MODEL
    );
  }
}

export async function scoreTitle(
  title: string,
  options?: {
    blacklist?: string[];
    whitelist?: string[];
    requireWhitelist?: boolean;
  }
) {
  const blacklist =
    options?.blacklist || [];

  const whitelist =
    options?.whitelist || [];

  if (
    containsKeyword(
      title,
      blacklist
    )
  ) {
    return 0;
  }

  if (
    options?.requireWhitelist &&
    !containsKeyword(
      title,
      whitelist
    )
  ) {
    return 0;
  }
  const promptRecord =
    await db.prompt.findUnique({
      where: {
        key: "score",
      },
    });

  const template =
    promptRecord?.content ||
    `
请为这条航空相关信息的重要性打分。

评分标准：
- FAA、NTSB、航空事故、事故调查、安全报告、适航指令、飞行训练风险：高分
- 娱乐、商业宣传、无关新闻：0分

只返回 0.0-1.0 数字。

标题：
{{title}}
`;

  const prompt = template.replace(
    "{{title}}",
    title
  );

  const response =
    await tryModels(prompt);

  return parseScore(response);
}