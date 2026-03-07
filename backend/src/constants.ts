/* ---
  MODE
--- */

export const IS_LOCAL = !!process.env.IS_LOCAL

export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'

export const IS_PRODUCTION = process.env.NODE_ENV === 'production'

/* ---
  ARCHITECTURE
--- */

export const GOOGLE_CLOUD_PROJECT_ID = 'conceptual-market'

export const GOOGLE_CLOUD_LOCATION = 'us-central1'

export const INTERNAL_AUTHENTICATION_HEADER = 'X-Internal-Api-Key'

/* ---
  SECRETS
--- */

export const SECRET_FIREBASE_SERVICE_ACCOUNT_KEY = 'firebase-service-account-key'

export const SECRET_INTERNAL_AUTHENTICATION_API_KEY = 'internal-authentication-api-key'

export const SECRET_GOOGLE_AI_API_KEY = 'google-ai-api-key'

/* ---
  AI
--- */

export const GOOGLE_GEN_AI_MODEL = 'gemini-2.5-flash-lite'

// The first array item is the default model
export const GOOGLE_GEN_AI_TEXT_MODELS = ['gemini-2.5-flash-lite', 'gemini-2.5-pro', 'gemini-3-flash-preview', 'gemini-3.1-pro-preview'] as const

export const MODELS = [
  ...GOOGLE_GEN_AI_TEXT_MODELS,
] as const

/* ---
  ORACLE
--- */

export const SALIENCE_THRESHOLD = 0.01
