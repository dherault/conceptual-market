import 'dotenv/config'

import fetchNewsArticles from './fetchNewsArticles.ts'
import processNewsArticles from './processNewsArticles.ts'

try {
  console.log('Starting oracle...')

  const newsArticles = await fetchNewsArticles(30 * 24 * 60 * 60 * 1000, 2)

  console.log(newsArticles.length, 'articles fetched')

  const newsArticlesWithEntities = await processNewsArticles(newsArticles)

  console.log(JSON.stringify(newsArticlesWithEntities, null, 2))
}
catch (error) {
  console.error('Error in oracle', error)

  process.exit(1)
}
