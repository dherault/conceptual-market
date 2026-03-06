import type { NewRssFeed } from './types'

export const RSS_FEEDS: NewRssFeed[] = [
  {
    name: 'Yahoo News - Most Viewed',
    url: 'https://news.yahoo.com/rss/mostviewed',
  },
  {
    name: 'CNN - Top Stories',
    url: 'http://rss.cnn.com/rss/cnn_topstories.rss',
  },
  // {
  //   name: 'The Washington Post - Politics',
  //   url: 'https://www.washingtonpost.com/arcio/rss/category/politics/',
  // },
  {
    name: 'NPR - News',
    url: 'https://feeds.npr.org/1001/rss.xml',
  },
  {
    name: 'BBC News - US & Canada',
    url: 'https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml',
  },
]

export const GOOGLE_GEN_AI_MODEL = 'gemini-2.5-flash-lite'
