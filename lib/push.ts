import axios from "axios";

export async function pushToFeishu(
  content: string
) {
  const webhook =
    process.env.FEISHU_WEBHOOK_URL;

  if (!webhook) {
    throw new Error(
      "Missing FEISHU_WEBHOOK_URL"
    );
  }

  await axios.post(webhook, {
    msg_type: "interactive",

    card: {
      config: {
        wide_screen_mode: true,
      },

      header: {
        template: "blue",

        title: {
          tag: "plain_text",

          content:
            "✈️ 航空安全简报",
        },
      },

      elements: [
        {
          tag: "markdown",

          content,
        },

        {
          tag: "hr",
        },

        {
          tag: "note",

          elements: [
            {
              tag: "plain_text",

              content:
                "CFII Intelligence System",
            },
          ],
        },
      ],
    },
  });
}