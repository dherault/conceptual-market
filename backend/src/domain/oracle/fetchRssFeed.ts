import type { Article, RssFeed } from 'conceptual-market-core'
import slugify from 'slugify'

async function fetchRssFeed(rssFeed: RssFeed): Promise<Article[]> {
  try {
    const response = await fetch(rssFeed.url)

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

    const now = new Date().toISOString()

    return items.flatMap<Article>(match => {
      const itemXml = match[1]
      const articleTitle = extractTextFromXml(itemXml, 'title')
      const articleUrl = extractTextFromXml(itemXml, 'link')
      const articlePublishedAt = extractTextFromXml(itemXml, 'pubDate') || extractTextFromXml(itemXml, 'published')

      if (!(articleTitle && articleUrl && articlePublishedAt)) return []

      const id = slugify(articleUrl, { lower: true, strict: true })

      return [
        {
          id,
          rssFeedId: rssFeed.id,
          title: articleTitle,
          url: articleUrl,
          publishedAt: new Date(articlePublishedAt).toISOString(),
          text: '',
          userId: null,
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
        },
      ]
    })
  }
  catch (error) {
    console.error(`Error parsing RSS feed from ${rssFeed.url}:`, error)

    return []
  }
}

function extractTextFromXml(xml: string, tag: string): string | null {
  // Match CDATA content
  const cdataMatch = xml.match(new RegExp(`<${tag}[^>]*><\\!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, 's'))

  if (cdataMatch) return cdataMatch[1].trim()

  // Fallback to plain text
  const plainMatch = xml.match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, 's'))

  if (plainMatch) return plainMatch[1].trim()

  return null
}

export default fetchRssFeed
