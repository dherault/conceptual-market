import { LanguageServiceClient } from '@google-cloud/language'
import slugify from 'slugify'

import type { Entity, NewsArticle } from './types.ts'

const client = new LanguageServiceClient()

const SALIENCE_THRESHOLD = 0.05

async function analyseNewsArticleEntities(newArticle: NewsArticle): Promise<Entity[]> {
  const [result] = await client.analyzeEntities({
    document: {
      type: 'PLAIN_TEXT',
      content: newArticle.text,
    },
  })

  return result.entities
    ?.filter(entity => (entity.salience ?? 0) >= SALIENCE_THRESHOLD)
    .flatMap(entity => {
      if (!entity.name) return []

      const mentionRegex = new RegExp(`\\b${entity.name}\\b`, 'g')
      const mentions = newArticle.text.match(mentionRegex) ?? []

      return [
        {
          // Temporary ID
          id: slugify(`${entity.type ?? 'UNKNOWN'}_${entity.name}`, { lower: true, strict: true }),
          name: entity.name,
          wikipediaUrl: entity.metadata?.wikipedia_url ?? '',
          magnitude: mentions.length,
          salience: entity.salience ?? 0,
        },
      ]
    }) ?? []
}

export default analyseNewsArticleEntities
