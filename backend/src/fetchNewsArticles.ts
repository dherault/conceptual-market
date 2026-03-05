// @ts-ignore
import extractor from 'unfluff'

import { RSS_FEEDS } from './constants.ts'
import fetchRssFeed from './fetchRssFeed.ts'
import type { NewsArticle } from './types.ts'

const FETCH_BATCH_SIZE = 25

async function fetchNewsArticles(inPeriod = 5 * 60 * 1000, maxCount = 100) {
  const newsArticles: NewsArticle[] = []

  for (const { name, url } of RSS_FEEDS) {
    try {
      const candidates = await fetchRssFeed(url)

      console.log(name, candidates.length)

      for (const candidate of candidates) {
        if (Date.now() - new Date(candidate.publishedAt).getTime() > inPeriod) continue

        newsArticles.push(candidate)
      }
    }
    catch (error) {
      console.error(`Failed to fetch RSS feed from ${url}:`, (error as Error).message)
    }
  }

  newsArticles.sort(() => Math.random() - 0.5)
  newsArticles.splice(maxCount)

  for (let i = 0; i < newsArticles.length; i += FETCH_BATCH_SIZE) {
    const batch = newsArticles.slice(i, i + FETCH_BATCH_SIZE)

    await Promise.all(batch.map(async newsArticle => {
      try {
        console.log('Fetching', newsArticle.url)

        const articleHtml = await fetch(newsArticle.url).then(res => res.text())
        // @ts-ignore
        const articleText = extractor(articleHtml).text?.trim()

        if (!articleText) return

        newsArticle.text = articleText
      }
      catch (error) {
        console.error(`Failed to fetch or extract content from article ${newsArticle.url}:`, (error as Error).message)
      }
    }))
  }

  return newsArticles
}

export default fetchNewsArticles
