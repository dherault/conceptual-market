import { ERROR_CODE_INTERNAL_ERROR } from 'conceptual-market-core'
import type { NextFunction, Request } from 'express'

import type { ApiResponse } from '~types'

import { IS_DEVELOPMENT } from '~constants'

import logger from '~utils/logger'
import parseErrorMessage from '~utils/parseErrorMessage'

function errorMiddleware(error: any, request: Request, response: ApiResponse, _next: NextFunction) {
  logger.error(`❌ ${request.path}: ${parseErrorMessage(error)}`)

  if (IS_DEVELOPMENT) console.error(error)

  response.status(500).json({
    status: 'error',
    code: ERROR_CODE_INTERNAL_ERROR,
    message: 'Internal Server Error',
  })
}

export default errorMiddleware
