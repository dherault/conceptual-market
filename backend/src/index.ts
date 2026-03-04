import RssParser from 'rss-parser'
import extractor from 'unfluff'
import { z } from 'zod'
import 'dotenv/config'

import getGoogleGenAiClient from './getGoogleGenAiClient.ts'

console.log('Starting oracle...')

const RSS_URL = 'https://news.yahoo.com/rss/mostviewed'
const rssParser = new RssParser()
const feed = await rssParser.parseURL(RSS_URL)
// const article = feed.items[Math.floor(Math.random() * feed.items.length)]
const article = feed.items[0]

console.log(`Fetched ${feed.items.length} items from RSS feed.`)
console.log('Article:', article.title, article.link)

if (!article.link) {
  console.error('Article link is missing. Exiting.')
  process.exit(1)
}

const articleHtml = await fetch(article.link).then(res => res.text())
// @ts-expect-error
const articleText = extractor(articleHtml).text?.trim()

if (!articleText) {
  console.error('Failed to extract text from the article. Exiting.')
  process.exit(1)
}

// console.log('---')
// console.log(articleText)
// console.log('---')

const schema = z.array(
  z.object({
    wikipediaUrl: z.string().url().describe('The Wikipedia URL of the entity'),
    magnitude: z.number().describe('The magnitude of the entity in the article, between 0 and 1'),
    salience: z.number().describe('The salience of the entity in the article, between 0 and 1'),
  }),
).describe('The most important entities in the article, with their wikipedia URL, magnitude, and salience.')

const googleGenAiClient = await getGoogleGenAiClient()
const GOOGLE_GEN_AI_MODEL = 'gemini-2.5-flash-lite'

const response = await googleGenAiClient.models.generateContent({
  model: GOOGLE_GEN_AI_MODEL,
  contents: `# Goal
Extract the most important entities from the following article and provide their Wikipedia URL, magnitude (between 0 and 1) and salience (between 0 and 1).
The magnitude represents how much the entity is talked about in the article, while the salience represents how important the entity is in the context of the article.
Only provide entities that have a magnitude and salience higher than 0.1.
If you are uncertain about the Wikipedia URL of an entity, do not include it in the results.

# Article
\`\`\`
${articleText}
\`\`\`
`,
  config: {
    responseMimeType: 'application/json',
    responseJsonSchema: z.toJSONSchema(schema),
  },
})

const entities = response.text ? schema.parse(JSON.parse(response.text)) : []

console.log('entities', JSON.stringify(entities, null, 2))
