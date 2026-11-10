import type { Feed, FeedItem } from "./types.js";

export type { Feed, FeedItem } from "./types.js";

export function mergeFeeds(feeds: Feed[]): FeedItem[] {
  const byId = new Map<string, FeedItem>();
  for (const feed of feeds) {
    for (const item of feed.items) {
      byId.set(item.id, item);
    }
  }
  return [...byId.values()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function since(items: FeedItem[], isoDate: string): FeedItem[] {
  return items.filter((item) => item.publishedAt >= isoDate);
}
