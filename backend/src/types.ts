export type DatabaseResource<T = unknown> = T & {
  id: string
  userId: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export type RssFeed = {
  id: string
  name: string
  url: string
}

export type Article = DatabaseResource<{
  id: string
  title: string
  url: string
  publishedAt: string // ISO
  rssFeedId: string
  text: string
}>

export type Concept = DatabaseResource<{
  id: string
  name: string
  wikipediaUrl: string
}>

export type ConceptScore = {
  magnitude: number
  salience: number
}

export type ScoredConcept = {
  concept: Concept
  score: ConceptScore
}

export type ScoredArticle = {
  article: Article
  scoredConcepts: ScoredConcept[]
}
