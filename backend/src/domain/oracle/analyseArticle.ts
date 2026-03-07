import type { Article, Concept } from 'conceptual-market-core'
import slugify from 'slugify'

import type { ConceptScore, ScoredConcept } from '~types'

import { SALIENCE_THRESHOLD } from '~constants'

import getGoogleLanguageClient from '~domain/clients/getGoogleLanguageClient'
import countWords from '~domain/oracle/countWords'

async function analyseArticle(article: Article): Promise<ScoredConcept[]> {
  const [result] = await getGoogleLanguageClient().analyzeEntities({
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
