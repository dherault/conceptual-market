import { GoogleGenAI } from '@google/genai'

async function getGoogleGenAiClient() {
  return new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY })
}

export default getGoogleGenAiClient
