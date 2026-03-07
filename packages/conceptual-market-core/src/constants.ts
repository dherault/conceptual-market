import type { RssFeed } from './types'

// ! Works only in Node.js environments, so the backend and not the frontend
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'

/* ---
  URLS
--- */

export const DEVELOPMENT_APP_PORT = 5173

export const DEVELOPEMENT_APP_URL = `http://localhost:${DEVELOPMENT_APP_PORT}`

export const PRODUCTION_APP_URL = 'https://videavideo.com'

export const DEVELOPMENT_API_PORT = 3003

export const DEVELOPEMENT_API_URL = `http://localhost:${DEVELOPMENT_API_PORT}`

export const PRODUCTION_API_URL = 'https://api.videavideo.com'

export const APP_URL = IS_PRODUCTION ? PRODUCTION_APP_URL : DEVELOPEMENT_APP_URL

export const API_URL = IS_PRODUCTION ? PRODUCTION_API_URL : DEVELOPEMENT_API_URL

export const SOCIAL_X_URL = 'https://x.com/dherault111'

/* ---
  API
--- */

export const HEADER_APP_CHECK_TOKEN = 'X-Firebase-AppCheck'

/* ---
  API ERROR CODES
--- */

export const ERROR_CODE_INTERNAL_ERROR = 'INTERNAL_ERROR' // 500

export const ERROR_CODE_BAD_REQUEST = 'BAD_REQUEST' // 400

export const ERROR_CODE_UNAUTHORIZED = 'UNAUTHORIZED' // 401

export const ERROR_CODE_FORBIDDEN = 'FORBIDDEN' // 403

export const ERROR_CODE_NOT_FOUND = 'NOT_FOUND' // 404

export const ERROR_CODE_USER_NOT_FOUND = 'USER_NOT_FOUND' // 404

export const ERROR_CODE_USER_NOT_ORGANIZATION_MEMBER = 'USER_NOT_ORGANIZATION_MEMBER' // 403

export const ERROR_CODE_USER_NOT_ORGANIZATION_ADMIN = 'USER_NOT_ORGANIZATION_ADMIN' // 403

export const ERROR_CODE_NOT_ENOUGH_CREDITS = 'NOT_ENOUGH_CREDITS' // 403

/* ---
  FIREBASE
--- */

// https://firebase.google.com/docs/firestore/query-data/queries#in_and_array-contains-any
export const FIREBASE_MAX_IN_QUERY_ITEMS = 30

/* ---
  RSS FEEDS
--- */

export const RSS_FEEDS: RssFeed[] = [
  {
    id: 'yahoo-most-viewed',
    name: 'Yahoo News - Most Viewed',
    url: 'https://news.yahoo.com/rss/mostviewed',
  },
  {
    id: 'cnn-top-stories',
    name: 'CNN - Top Stories',
    url: 'http://rss.cnn.com/rss/cnn_topstories.rss',
  },
  // {
  //   id: 'washington-post-politics',
  //   name: 'The Washington Post - Politics',
  //   url: 'https://www.washingtonpost.com/arcio/rss/category/politics',
  // },
  {
    id: 'npr-news',
    name: 'NPR - News',
    url: 'https://feeds.npr.org/1001/rss.xml',
  },
  {
    id: 'bbc-us-canada',
    name: 'BBC News - US & Canada',
    url: 'https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml',
  },
]
