import { db } from "@/lib/db";

const defaultConfigs = [
  {
    key: "min_score",
    value: "60",
  },

  {
    key: "hot_threshold",
    value: "90",
  },

  {
    key: "context_days",
    value: "3",
  },

  {
    key: "keep_days",
    value: "7",
  },

  {
    key: "push_context_days",
    value: "5",
  },

  {
    key: "fetch_interval_minutes",
    value: "30",
  },

  {
    key: "fetch_lookback_minutes",
    value: "120",
  },

  {
    key: "llm_model",
    value: "deepseek-chat",
  },

  {
    key: "llm_provider",
    value: "openrouter",
  },

  {
    key: "max_prompt_chars",
    value: "128000",
  },

  {
    key: "max_concurrent_batches",
    value: "3",
  },
];

export async function GET() {
  const settings =
    await db.config.findMany({
      orderBy: {
        key: "asc",
      },
    });

  if (settings.length === 0) {
    await db.config.createMany({
      data: defaultConfigs,
    });

    const newSettings =
      await db.config.findMany({
        orderBy: {
          key: "asc",
        },
      });

    return Response.json(
      newSettings
    );
  }

  return Response.json(settings);
}

export async function PATCH(
  req: Request
) {
  const body = await req.json();

  const config =
    await db.config.update({
      where: {
        id: body.id,
      },

      data: {
        value: body.value,
      },
    });

  return Response.json(config);
}