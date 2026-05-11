import Parser from "rss-parser";

const parser = new Parser();

export async function fetchFeed(url: string) {
  const feed = await parser.parseURL(url);

  return feed.items.map((item) => ({
    title: item.title || "",
    link: item.link || "",
    content: item.contentSnippet || "",
    pubDate: item.pubDate || "",
  }));
}