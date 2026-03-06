export type RssFeed = {
  name: string
  url: string
}

export type Article = {
  id: string
  title: string
  url: string
  publishedAt: string // ISO
  rssFeedName: string
  rssFeedUrl: string
  text: string
}

export type Entity = {
  id: string
  name: string
  wikipediaUrl: string
}

export type ScoredEntity = Entity & {
  magnitude: number
  salience: number
}

export type ArticleWithEntitiesWithScore = Article & {
  scoredEntities: ScoredEntity[]
}
