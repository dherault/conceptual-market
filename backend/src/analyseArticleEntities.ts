import { LanguageServiceClient } from '@google-cloud/language'
import slugify from 'slugify'

import { SALIENCE_THRESHOLD } from './constants.ts'
import countWords from './countWords.ts'
import type { Article, ScoredEntity } from './types.ts'

const client = new LanguageServiceClient()

async function analyseArticleEntities(article: Article): Promise<ScoredEntity[]> {
  const [result] = await client.analyzeEntities({
    document: {
      type: 'PLAIN_TEXT',
      content: article.text,
    },
  })

  const articleWordCount = countWords(article.text)

  return result.entities
    ?.filter(entity => (entity.salience ?? 0) >= SALIENCE_THRESHOLD)
    .flatMap(entity => {
      if (!entity.name) return []

      const mentionRegex = new RegExp(`\\b${entity.name}\\b`, 'g')
      const mentions = article.text.match(mentionRegex) ?? []

      return [
        {
          id: slugify(`${entity.type ?? 'UNKNOWN'}_${entity.name}`), // Temporary id
          name: entity.name,
          wikipediaUrl: entity.metadata?.wikipedia_url ?? '',
          magnitude: mentions.length / articleWordCount,
          salience: entity.salience ?? 0,
        },
      ]
    }) ?? []
}

export default analyseArticleEntities
