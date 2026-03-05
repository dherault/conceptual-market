export type NewRssFeed = {
  name: string
  url: string
}

export type NewsArticle = {
  id: string
  title: string
  url: string
  publishedAt: string // ISO
  text: string
}
