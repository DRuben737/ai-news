import OpenAI from "openai";

export async function callLLM(
  prompt: string
) {
  const client = new OpenAI({
    apiKey:
      process.env.LLM_API_KEY ||
      "test-key",

    baseURL:
      process.env.LLM_BASE_URL,
  });

  const response =
    await client.chat.completions.create({
      model:
        process.env.LLM_MODEL ||
        "deepseek-chat",

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.3,
    });

  return (
    response.choices[0]
      ?.message?.content || ""
  );
}