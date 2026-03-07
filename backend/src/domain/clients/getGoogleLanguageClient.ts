import { LanguageServiceClient } from '@google-cloud/language'

const client = new LanguageServiceClient()

function getGoogleLanguageClient(): LanguageServiceClient {
  return client
}

export default getGoogleLanguageClient
