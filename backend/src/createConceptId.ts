import slugify from 'slugify'

import type { Concept } from './types'

function createConceptId(concept: Concept): string {
  const wikipediaUrlSuffixMatch = concept.wikipediaUrl.match(/\/wiki\/([^/]+)$/)
  const wikipediaUrlSuffix = wikipediaUrlSuffixMatch ? wikipediaUrlSuffixMatch[1] : null

  return slugify(wikipediaUrlSuffix ?? concept.name, { strict: true })
}

export default createConceptId
