import analyseArticleEntities from './analyseArticleEntities.ts'
import generateEntitiesMetadatas from './generateEntitiesMetadatas.ts'
import type { Article, ArticleWithEntitiesWithScore } from './types.ts'

async function processArticles(articles: Article[]): Promise<ArticleWithEntitiesWithScore[]> {
  const articlesWithEntitiesWithScore: ArticleWithEntitiesWithScore[] = await Promise.all(articles.map(async article => ({
    ...article,
    scoredEntities: await analyseArticleEntities(article),
  })))

  const incompleteArticlesWithEntities = articlesWithEntitiesWithScore.filter(article => article.scoredEntities.length > 0)

  const completeArticlesWithEntities = await generateEntitiesMetadatas(incompleteArticlesWithEntities)

  return completeArticlesWithEntities
    .map(article => ({
      ...article,
      scoredEntities: article.scoredEntities.filter(entity => entity.name && entity.wikipediaUrl),
    }))
}

export default processArticles
