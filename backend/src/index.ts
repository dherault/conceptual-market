import 'dotenv/config'

import fetchNewsArticles from './fetchNewsArticles.ts'
// import invokeEntities from './invokeEntities.ts'

console.log('Starting oracle...')

const newsArticles = await fetchNewsArticles(30 * 24 * 60 * 60 * 1000, 25)

console.log(`Fetched ${newsArticles.length} news articles.`)

// const entities = await invokeEntities(newsArticles)

// console.log('entities', JSON.stringify(entities, null, 2))
