import analyseNewsArticleEntities from './analyseNewsArticleEntities.ts'
import generateEntitiesMetadatas from './generateEntitiesMetadatas.ts'
import type { NewsArticle, NewsArticleWithEntities } from './types.ts'

async function processNewsArticles(newsArticles: NewsArticle[]): Promise<NewsArticleWithEntities[]> {
  const newsArticlesWithEntities: NewsArticleWithEntities[] = await Promise.all(newsArticles.map(async newsArticle => ({
    ...newsArticle,
    entities: await analyseNewsArticleEntities(newsArticle),
  })))

  const incompleteNewsArticlesWithEntities = newsArticlesWithEntities.filter(article => article.entities.length > 0)

  const completeNewsArticlesWithEntities = await generateEntitiesMetadatas(incompleteNewsArticlesWithEntities)

  return completeNewsArticlesWithEntities
    .map(article => ({
      ...article,
      entities: article.entities.filter(entity => entity.name && entity.wikipediaUrl),
    }))
    .filter(article => article.entities.length > 0)
}

export default processNewsArticles
