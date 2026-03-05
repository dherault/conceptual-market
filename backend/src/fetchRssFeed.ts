import slugify from 'slugify'

import type { NewsArticle } from './types.ts'

function extractTextFromXml(xml: string, tag: string): string | null {
  // Match CDATA content
  const cdataMatch = xml.match(new RegExp(`<${tag}[^>]*><\\!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, 's'))

  if (cdataMatch) return cdataMatch[1].trim()

  // Fallback to plain text
  const plainMatch = xml.match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, 's'))

  if (plainMatch) return plainMatch[1].trim()

  return null
}

async function fetchRssFeed(url: string): Promise<NewsArticle[]> {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const xml = await response.text()

    // Validate XML structure
    if (!xml.includes('<?xml') && !xml.includes('<rss') && !xml.includes('<feed')) {
      throw new Error('Invalid RSS feed: Missing XML or RSS/Atom declaration')
    }

    // Extract items (for both RSS and Atom feeds)
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g

    const items = [...xml.matchAll(itemRegex), ...xml.matchAll(entryRegex)]

    if (items.length === 0) return []

    const newsArticles = items.flatMap<NewsArticle>(match => {
      const itemXml = match[1]
      const title = extractTextFromXml(itemXml, 'title')
      const url = extractTextFromXml(itemXml, 'link')
      const publishedAt = extractTextFromXml(itemXml, 'pubDate') || extractTextFromXml(itemXml, 'published')

      if (!(title && url && publishedAt)) return []

      const id = slugify(url, { lower: true, strict: true })

      return [
        {
          id,
          title,
          url,
          publishedAt: new Date(publishedAt).toISOString(),
          text: '',
        },
      ]
    })

    return newsArticles
  }
  catch (error) {
    console.error(`Error parsing RSS feed from ${url}:`, error)

    return []
  }
}

export default fetchRssFeed
