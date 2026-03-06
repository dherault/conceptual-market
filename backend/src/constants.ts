import type { RssFeed } from './types'

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

export const GOOGLE_GEN_AI_MODEL = 'gemini-2.5-flash-lite'

export const SALIENCE_THRESHOLD = 0.025
