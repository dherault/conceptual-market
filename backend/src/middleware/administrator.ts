import { ERROR_CODE_FORBIDDEN } from 'conceptual-market-core'
import type { NextFunction, Request } from 'express'

import type { ApiResponse } from '~types'

import logger from '~utils/logger'

async function administratorMiddleware<T>(request: Request, response: ApiResponse<T>, next: NextFunction) {
  if (!request.user?.isAdministrator) {
    logger.error('❌ User is not administrator')

    response.status(403).json({
      status: 'error',
      code: ERROR_CODE_FORBIDDEN,
      message: 'User is not administrator',
    })

    return
  }

  next()
}

export default administratorMiddleware
