import { z } from 'zod'

import getGoogleGenAiClient from './getGoogleGenAiClient.ts'
import type { NewsArticle } from './types.ts'

async function invokeEntities(newsArticles: NewsArticle[]) {
  const schema = z.array(
    z.object({
      articleId: z.string().describe('The id of the article the entities were extracted from'),
      entities: z.array(
        z.object({
          wikipediaUrl: z.url().describe('The Wikipedia URL of the entity'),
          magnitude: z.number().describe('The magnitude of the entity in the article, between 0 and 1'),
          salience: z.number().describe('The salience of the entity in the article, between 0 and 1'),
        }),
      ).describe('The most important entities in the article, with their wikipedia URL, magnitude, and salience.'),
    }),
  ).describe('The list of articles with their most important entities.')

  const googleGenAiClient = await getGoogleGenAiClient()
  const GOOGLE_GEN_AI_MODEL = 'gemini-2.5-flash-lite'

  const response = await googleGenAiClient.models.generateContent({
    model: GOOGLE_GEN_AI_MODEL,
    contents: `# Goal
Extract the most important entities from the following articles and provide their Wikipedia URL, magnitude (between 0 and 1) and salience (between 0 and 1).
The magnitude represents how much the entity is talked about in the article, while the salience represents how important the entity is in the context of the article.
Only provide entities that have a magnitude and salience higher than 0.1.
If you are uncertain about the Wikipedia URL of an entity, do not include it in the results.

# Articles
The id of the article is after "##", use it in the results.

${newsArticles.map(article => `
## ${article.id}
\`\`\`
${article.title}
${article.text}
\`\`\`
`).join('\n')}
`,
    config: {
      responseMimeType: 'application/json',
      responseJsonSchema: z.toJSONSchema(schema),
    },
  })

  return response.text ? schema.parse(JSON.parse(response.text)) : []
}

export default invokeEntities
