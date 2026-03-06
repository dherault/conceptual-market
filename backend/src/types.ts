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

export type Entity = {
  id: string
  name: string
  wikipediaUrl: string
  magnitude: number
  salience: number
}

export type NewsArticleWithEntities = NewsArticle & {
  entities: Entity[]
}
