import analyseArticle from './analyseArticle.ts'
import enrichArticlesConcepts from './enrichArticlesConcepts.ts'
import type { Article, ScoredArticle, ScoredConcept } from './types.ts'

async function scoreArticles(articles: Article[]): Promise<ScoredArticle[]> {
  // Analyse Concepts for every Article
  const scoredArticles: ScoredArticle[] = await Promise.all(
    articles.map(async article => ({
      article,
      scoredConcepts: await analyseArticle(article),
    })),
  )

  // Add missing metadatas on Concepts
  const enrichedArticles = await enrichArticlesConcepts(scoredArticles.filter(article => article.scoredConcepts.length > 0))

  return scoredArticles.map(scoredArticle => {
    const enrichedArticle = enrichedArticles.find(a => a.article.id === scoredArticle.article.id) ?? scoredArticle

    return {
      ...enrichedArticle,
      scoredConcepts: filterValidScoredConcepts(enrichedArticle.scoredConcepts),
    }
  })
}

function filterValidScoredConcepts(scoredConcepts: ScoredConcept[]): ScoredConcept[] {
  return scoredConcepts.filter(({ concept, score }) =>
    concept.id
    && concept.name
    && concept.wikipediaUrl
    && score.magnitude > 0
    && score.salience > 0,
  )
}

export default scoreArticles
