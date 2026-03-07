import { ERROR_CODE_BAD_REQUEST } from 'conceptual-market-core'
import type { NextFunction, Request } from 'express'
import type { z } from 'zod'

import type { ApiResponse } from '~types'

import logger from '~utils/logger'
import parseError from '~utils/parseError'

type ValidateOptions = {
  query?: z.ZodSchema
  body?: z.ZodSchema
}

function validate<T>({ query: querySchema, body: bodySchema }: ValidateOptions) {
  return (request: Request, response: ApiResponse<T>, next: NextFunction) => {
    try {
      if (querySchema) querySchema.parse(request.query)
      if (bodySchema) bodySchema.parse(request.body)

      next()
    }
    catch (error: any) {
      logger.error(`❌ Validation error: ${error.message}`)

      response.status(400).json({
        status: 'error',
        code: ERROR_CODE_BAD_REQUEST,
        message: parseError(error),
      })
    }
  }
}

export default validate
