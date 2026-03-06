import { LanguageServiceClient } from '@google-cloud/language'
import slugify from 'slugify'

import { SALIENCE_THRESHOLD } from './constants.ts'
import countWords from './countWords.ts'
import type { Article, Concept, ConceptScore, ScoredConcept } from './types.ts'

const client = new LanguageServiceClient()

async function analyseArticle(article: Article): Promise<ScoredConcept[]> {
  const [result] = await client.analyzeEntities({
    document: {
      type: 'PLAIN_TEXT',
      content: article.text,
    },
  })

  const articleWordCount = countWords(article.text)
  const now = new Date().toISOString()

  return result.entities
    ?.filter(entity => (entity.salience ?? 0) >= SALIENCE_THRESHOLD)
    .flatMap(entity => {
      if (!entity.name) return []

      const mentionRegex = new RegExp(`\\b${entity.name}\\b`, 'g')
      const mentions = article.text.match(mentionRegex) ?? []

      const concept: Concept = {
        id: slugify(`${entity.type ?? 'UNKNOWN'}_${entity.name}`), // Temporary id
        name: entity.name,
        wikipediaUrl: entity.metadata?.wikipedia_url ?? '',
        userId: null,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      }
      const score: ConceptScore = {
        magnitude: mentions.length / articleWordCount,
        salience: entity.salience ?? 0,
      }
      const scoredConcept: ScoredConcept = {
        concept,
        score,
      }

      return [scoredConcept]
    }) ?? []
}

export default analyseArticle
