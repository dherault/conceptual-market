// @ts-ignore
import extractor from 'unfluff'

import { RSS_FEEDS } from './constants.ts'
import fetchRssFeed from './fetchRssFeed.ts'
import type { Article } from './types.ts'

const FETCH_BATCH_SIZE = 25

async function fetchArticles(inPeriod = 5 * 60 * 1000, maxCount = 100) {
  const articles: Article[] = []

  for (const rssFeed of RSS_FEEDS) {
    try {
      const candidates = await fetchRssFeed(rssFeed)

      for (const candidate of candidates) {
        if (Date.now() - new Date(candidate.publishedAt).getTime() > inPeriod) continue

        articles.push(candidate)
      }
    }
    catch (error) {
      console.error(`Failed to fetch RSS feed from ${rssFeed.url}:`, (error as Error).message)
    }
  }

  articles.sort(() => Math.random() - 0.5)
  articles.splice(maxCount)

  for (let i = 0; i < articles.length; i += FETCH_BATCH_SIZE) {
    const batch = articles.slice(i, i + FETCH_BATCH_SIZE)

    await Promise.all(batch.map(async article => {
      try {
        console.log('Fetching', article.url)

        const articleHtml = await fetch(article.url).then(res => res.text())
        // @ts-ignore
        const articleText = extractor(articleHtml).text?.trim()

        if (!articleText) return

        article.text = articleText
      }
      catch (error) {
        console.error(`Failed to fetch or extract content from article ${article.url}:`, (error as Error).message)
      }
    }))
  }

  return articles
}

export default fetchArticles
