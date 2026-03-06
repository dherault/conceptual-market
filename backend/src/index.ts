import 'dotenv/config'

import fetchArticles from './fetchArticles.ts'
import scoreArticles from './scoreArticles.ts'

try {
  console.log('Starting oracle...')

  const articles = await fetchArticles(30 * 24 * 60 * 60 * 1000, 3)

  console.log(articles.length, 'articles fetched')

  const scoredArticles = await scoreArticles(articles)

  console.log(JSON.stringify(scoredArticles, null, 2))
}
catch (error) {
  console.error('Error in oracle', error)

  process.exit(1)
}
