import type { Entity } from './types'

function createEntityId(entity: Entity): string {
  const wikipediaUrlLanguageMatch = entity.wikipediaUrl.match(/\/([a-z]{2})\.wikipedia\.org\//)
  const wikipediaUrlLanguage = wikipediaUrlLanguageMatch ? wikipediaUrlLanguageMatch[1] : 'en'
  const wikipediaUrlSuffixMatch = entity.wikipediaUrl.match(/\/wiki\/([^/]+)$/)
  const wikipediaUrlSuffix = wikipediaUrlSuffixMatch ? wikipediaUrlSuffixMatch[1] : null

  return `${wikipediaUrlLanguage}_${wikipediaUrlSuffix ?? entity.name}`
}

export default createEntityId
