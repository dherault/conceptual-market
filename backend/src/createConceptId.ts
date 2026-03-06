import slugify from 'slugify'

import type { Concept } from './types'

const WIKIPEDIA_SUFFIX_REGEX = /\/wiki\/([^/]+)$/
const REPLACE_ID_REGEX = /[,()&]/g

function createConceptId(concept: Concept): string {
  const wikipediaUrlSuffixMatch = concept.wikipediaUrl.match(WIKIPEDIA_SUFFIX_REGEX)
  const wikipediaUrlSuffix = wikipediaUrlSuffixMatch ? wikipediaUrlSuffixMatch[1] : null

  return slugify((wikipediaUrlSuffix ?? concept.name).replaceAll(REPLACE_ID_REGEX, '-'), { trim: true })
}

export default createConceptId
