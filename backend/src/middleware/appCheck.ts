import { ERROR_CODE_UNAUTHORIZED, HEADER_APP_CHECK_TOKEN } from 'conceptual-market-core'
import type { NextFunction, Request } from 'express'
import { getAppCheck } from 'firebase-admin/app-check'

import type { ApiResponse } from '~types'

import logger from '~utils/logger'
import parseErrorMessage from '~utils/parseErrorMessage'

async function appCheckMiddleware<T>(request: Request, response: ApiResponse<T>, next: NextFunction) {
  try {
    const appCheckToken = request.header(HEADER_APP_CHECK_TOKEN)

    if (!appCheckToken) throw new Error('Missing App Check token')

    await getAppCheck().verifyToken(appCheckToken)

    next()
  }
  catch (error) {
    logger.error(`❌ App Check token verification error: ${parseErrorMessage(error)}`)

    response.status(401).send({
      status: 'error',
      code: ERROR_CODE_UNAUTHORIZED,
      message: 'Invalid App Check token',
    })
  }
}

export default appCheckMiddleware
