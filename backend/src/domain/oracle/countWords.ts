function countWords(text: string): number {
  return text.trim().split(/\s+/).length
}

export default countWords
