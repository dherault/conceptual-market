import type { Concept } from 'conceptual-market-core'
import { z } from 'zod'

import type { ScoredArticle } from '~types'

import { GOOGLE_GEN_AI_TEXT_MODELS } from '~constants'

import { generateContentWithAiGateway } from '~domain/ai/invokeWithAiGateway'
import createConceptId from '~domain/oracle/createConceptId'

const SCHEMA = z.array(
  z.object({
    id: z.string().describe('The ID of the article'),
    concepts: z.array(
      z.object({
        id: z.string().describe('The ID of the concept'),
        name: z.string().describe('The full name of the concept with proper capitalization').nullable(),
        wikipediaUrl: z.url().describe('The Wikipedia URL of the concept').nullable(),
      }),
    ).describe('The list of concepts in the article.'),
  }),
).describe('The list of articles with their concepts.')

async function enrichArticlesConcepts(scoredArticles: ScoredArticle[]): Promise<ScoredArticle[]> {
  const incompleteScoredArticles = scoredArticles.filter(scoredArticle => scoredArticle.scoredConcepts.some(scoredConcept => !scoredConcept.concept.wikipediaUrl))

  if (!incompleteScoredArticles.length) return scoredArticles

  const { response } = await generateContentWithAiGateway(
    GOOGLE_GEN_AI_TEXT_MODELS,
    model => ({
      model,
      contents: `
# Goal
You are given a list of news articles along with the concepts mentioned in these articles.
For every concept, you have to determine its full name with proper capitalization and its English Wikipedia URL.
If you are unsure about the name or Wikipedia URL, output null.
Do not add more concepts than the ones provided.

# Data
The string after "##" is the ID of the article.

${incompleteScoredArticles.map(({ article, scoredConcepts }) => `
## ${article.id}

### Content
\`\`\`
${article.title}
${article.text}
\`\`\`

### Concepts
${scoredConcepts.map(({ concept }) => `
- id: ${concept.id}
  name: ${concept.name}
  wikipediaUrl: ${concept.wikipediaUrl ?? '-'}
`).join('\n')}
`)}
`,
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: z.toJSONSchema(SCHEMA),
      },
    }),
  )

  const data = response.text ? SCHEMA.parse(JSON.parse(response.text)) : []

  return scoredArticles.map(scoredArticle => {
    const articleData = data.find(x => x.id === scoredArticle.article.id)

    if (!articleData) return scoredArticle

    return {
      ...scoredArticle,
      scoredConcepts: scoredArticle.scoredConcepts.map(scoredConcept => {
        const conceptData = articleData.concepts.find(e => e.id === scoredConcept.concept.id)

        if (!conceptData) return scoredConcept

        const nextConcept: Concept = {
          ...scoredConcept.concept,
          name: conceptData.name ?? scoredConcept.concept.name,
          wikipediaUrl: conceptData.wikipediaUrl ?? scoredConcept.concept.wikipediaUrl,
        }

        return {
          ...scoredConcept,
          concept: {
            ...nextConcept,
            id: createConceptId(nextConcept),
          },
        }
      }),
    }
  })
}

export default enrichArticlesConcepts
