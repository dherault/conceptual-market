import 'dotenv/config'

import fetchArticles from './fetchArticles.ts'
import processArticles from './processArticles.ts'

try {
  console.log('Starting oracle...')

  const newsArticles = await fetchArticles(30 * 24 * 60 * 60 * 1000, 2)

  console.log(newsArticles.length, 'articles fetched')

  const newsArticlesWithEntities = await processArticles(newsArticles)

  console.log(JSON.stringify(newsArticlesWithEntities, null, 2))
}
catch (error) {
  console.error('Error in oracle', error)

  process.exit(1)
}
