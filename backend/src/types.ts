import type { Article, Concept, User } from 'conceptual-market-core'

import type { MODELS } from '~constants'

/* ---
  EXPRESS REQUEST AUGMENTATION
--- */

declare module 'express-serve-static-core' {
  interface Request {
    user?: User
  }
}

/* ---
  API RESPONSES
--- */

export interface SuccessResponse<T = void> {
  status: 'success'
  data?: T
}

export interface ErrorResponse {
  status: 'error'
  code: string
  message: string
}

export type ApiResponsePayload<T = void> = SuccessResponse<T> | ErrorResponse

export type ApiResponse<T = void> = {
  status(code: number): ApiResponse<T>
  json(body: ApiResponsePayload<T>): void
  send(body: ApiResponsePayload<T>): void
}

/* ---
  AI
--- */

export type Model = typeof MODELS[number]

/* ---
  ORACLE
--- */

export type ConceptScore = {
  magnitude: number
  salience: number
}

export type ScoredConcept = {
  concept: Concept
  score: ConceptScore
}

export type ScoredArticle = {
  article: Article
  scoredConcepts: ScoredConcept[]
}
