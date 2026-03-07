import { GoogleGenAI } from '@google/genai'

import { SECRET_GOOGLE_AI_API_KEY } from '~constants'

import retrieveSecret from '~utils/retrieveSecret'

async function getGoogleGenAiClient() {
  const apiKey = await retrieveSecret(SECRET_GOOGLE_AI_API_KEY)

  return new GoogleGenAI({ apiKey })
}

export default getGoogleGenAiClient
