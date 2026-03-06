import { z } from 'zod'

import { GOOGLE_GEN_AI_MODEL } from './constants.ts'
import createEntityId from './createEntityId.ts'
import getGoogleGenAiClient from './getGoogleGenAiClient.ts'
import type { ArticleWithEntitiesWithScore } from './types.ts'

const SCHEMA = z.array(
  z.object({
    id: z.string().describe('The ID of the article'),
    entities: z.array(
      z.object({
        id: z.string().describe('The ID of the entity'),
        name: z.string().describe('The name of the entity').nullable(),
        wikipediaUrl: z.url().describe('The Wikipedia URL of the entity').nullable(),
      }),
    ).describe('The list of entities in the article.'),
  }),
).describe('The list of articles with their entities.')

async function generateEntitiesMetadatas(articlesWithEntitiesWithScore: ArticleWithEntitiesWithScore[]): Promise<ArticleWithEntitiesWithScore[]> {
  const googleGenAiClient = await getGoogleGenAiClient()

  const articlesWithIncompleteEntities = articlesWithEntitiesWithScore.filter(article => article.scoredEntities.some(entity => !entity.wikipediaUrl))

  if (!articlesWithIncompleteEntities.length) return articlesWithEntitiesWithScore

  const response = await googleGenAiClient.models.generateContent({
    model: GOOGLE_GEN_AI_MODEL,
    contents: `
# Goal
You are given a list of news articles along with the entities mentioned in these articles.
For every entity, you have to determine its full name with proper capitalization and its Wikipedia URL (if it exists, preferably in the English version).
If you are unsure about the name or Wikipedia URL, output null.
Do not add more entities than the ones provided.

# Data
The string after "##" is the ID of the article.

${articlesWithIncompleteEntities.map(article => `
## ${article.id}

### Content
\`\`\`
${article.title}
${article.text}
\`\`\`

### Entities
${article.scoredEntities.map(entity => `
- id: ${entity.id}
  name: ${entity.name}
  wikipediaUrl: ${entity.wikipediaUrl ?? 'N/A'}
`).join('\n')}
`)}
`,
    config: {
      responseMimeType: 'application/json',
      responseJsonSchema: z.toJSONSchema(SCHEMA),
    },
  })

  const data = response.text ? SCHEMA.parse(JSON.parse(response.text)) : []

  return articlesWithEntitiesWithScore.map(article => {
    const articleData = data.find(x => x.id === article.id)

    if (!articleData) return article

    return {
      ...article,
      scoredEntities: article.scoredEntities.map(entity => {
        const entityData = articleData.entities.find(e => e.id === entity.id)

        if (!entityData) return entity

        const nextEntity = {
          ...entity,
          name: entityData.name ?? entity.name,
          wikipediaUrl: entityData.wikipediaUrl ?? entity.wikipediaUrl,
        }

        return {
          ...nextEntity,
          id: createEntityId(nextEntity),
        }
      }),
    }
  })
}

export default generateEntitiesMetadatas
