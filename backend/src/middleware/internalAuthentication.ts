import { ERROR_CODE_UNAUTHORIZED } from 'conceptual-market-core'
import type { NextFunction, Request } from 'express'

import type { ApiResponse } from '~types'

import { INTERNAL_AUTHENTICATION_HEADER, SECRET_INTERNAL_AUTHENTICATION_API_KEY } from '~constants'

import logger from '~utils/logger'
import retrieveSecret from '~utils/retrieveSecret'

async function internalAuthenticationMiddleware<T>(request: Request, response: ApiResponse<T>, next: NextFunction) {
  const authenticationHeader = request.header(INTERNAL_AUTHENTICATION_HEADER)

  if (!authenticationHeader?.startsWith('Bearer ')) {
    logger.error('❌ Internal authentication: No token provided')

    response.status(401).json({
      status: 'error',
      code: ERROR_CODE_UNAUTHORIZED,
      message: 'No token provided',
    })

    return
  }

  const token = authenticationHeader.split(' ')[1]
  const apiKey = await retrieveSecret(SECRET_INTERNAL_AUTHENTICATION_API_KEY)

  if (token !== apiKey) {
    logger.error('❌ Internal authentication: Invalid token')

    response.status(401).json({
      status: 'error',
      code: ERROR_CODE_UNAUTHORIZED,
      message: 'Invalid token',
    })

    return
  }

  logger.info('🧑 Internal authentication')

  next()
}

export default internalAuthenticationMiddleware
