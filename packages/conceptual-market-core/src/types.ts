/* ---
  DATABASE RESOURCES
--- */

export type DatabaseResource<T = unknown> = T & {
  id: string
  userId: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

/* ---
  USER
--- */

export type User = DatabaseResource<{
  email: string
  name: string | null
  imageUrl: string | null
  signInProviders: SignInProvider[]
  hasVerifiedEmail: boolean
  hasSentVerificationEmail: boolean
  isAdministrator: boolean
}>

export type SignInProvider = 'password' | 'google.com'

/* ---
  CONCEPT
--- */

export type Concept = DatabaseResource<{
  id: string
  name: string
  wikipediaUrl: string
}>

/* ---
  ARTICLE
--- */

export type Article = DatabaseResource<{
  id: string
  title: string
  url: string
  publishedAt: string // ISO
  rssFeedId: string
  text: string
}>

export type RssFeed = {
  id: string
  name: string
  url: string
}
