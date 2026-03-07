import type { GoogleGenAI } from '@google/genai'

import type { Model } from '~types'

import logger from '~utils/logger'

import getGoogleGenAiClient from '~domain/clients/getGoogleGenAiClient'

function createInvokeWithAiGateway<Request, Response>(
  createGenerate: (ai: GoogleGenAI) => (request: Request) => Promise<Response>,
  postProcess: (ai: GoogleGenAI, response: Response) => Promise<Response> = (_ai, response) => Promise.resolve(response),
) {
  async function invokeAiWithGateway(models: readonly Model[], createArgument: (model: Model) => Request): Promise<{ ai: GoogleGenAI, model: Model, response: Response }> {
    const ai = await getGoogleGenAiClient()

    for (const model of models) {
      const response = await invokeModelWithGateway(ai, model, createArgument(model))

      if (response) return { ai, model, response }

      logger.info('🎨 Using next model')
    }

    throw new Error(`All models hit rate limits or unavailable: ${models.join(', ')}`)
  }

  async function invokeModelWithGateway(ai: GoogleGenAI, model: Model, argument: Request): Promise<Response | null> {
    try {
      const response = await createGenerate(ai)(argument)

      return await postProcess(ai, response)
    }
    catch (error: any) {
      try {
        const errorData = JSON.parse(error.message)

        logger.warn(`🎨 AI Gateway error on ${model}: ${JSON.stringify(errorData.error)}`)

        const { code } = errorData.error

        // If the error is a rate limit or model overused error, return null to try the next model
        if (code === 429 || code === 503) return null
      }
      catch {
      //
      }

      throw error
    }
  }

  return invokeAiWithGateway
}

export const generateContentWithAiGateway = createInvokeWithAiGateway(ai => ai.models.generateContent)
