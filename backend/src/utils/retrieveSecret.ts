import { SecretManagerServiceClient } from '@google-cloud/secret-manager'

import { GOOGLE_CLOUD_PROJECT_ID } from '~constants'

const client = new SecretManagerServiceClient()
const cache: Record<string, string> = {}

async function retrieveSecret(secretName: string) {
  if (cache[secretName]) return cache[secretName]

  const name = `projects/${GOOGLE_CLOUD_PROJECT_ID}/secrets/${secretName}/versions/latest`

  const [version] = await client.accessSecretVersion({ name })

  if (version.payload?.data) {
    const payload = version.payload.data.toString('utf-8')

    return cache[secretName] = payload
  }

  throw new Error(`Secret payload is empty or not found for secret name: ${secretName}`)
}

export default retrieveSecret
