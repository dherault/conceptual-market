import { ERROR_CODE_NOT_FOUND } from 'conceptual-market-core'
import type { Request, Response } from 'express'

import type { ErrorResponse } from '~types'

export function notFoundMiddleware(_request: Request, response: Response<ErrorResponse>) {
  response.status(404).json({
    status: 'error',
    code: ERROR_CODE_NOT_FOUND,
    message: 'Endpoint not found',
  })
}
