export interface FeedItem {
  id: string;
  title: string;
  link: string;
  publishedAt: string;
}

export interface Feed {
  title: string;
  items: FeedItem[];
}
