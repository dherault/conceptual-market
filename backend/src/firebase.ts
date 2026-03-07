import firebase from 'firebase-admin'

import { SECRET_FIREBASE_SERVICE_ACCOUNT_KEY } from '~constants'

import logger from '~utils/logger'
import retrieveSecret from '~utils/retrieveSecret'

async function initializeFirebase() {
  const certificate = await retrieveSecret(SECRET_FIREBASE_SERVICE_ACCOUNT_KEY)

  const app = firebase.initializeApp({
    credential: firebase.credential.cert(JSON.parse(certificate)),
  })

  logger.info('📀 Firebase initialized')

  return app
}

export default initializeFirebase
