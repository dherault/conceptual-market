import type { NextFunction, Request, Response } from 'express'

import logger from '~utils/logger'

function loggerMiddleware(request: Request, _response: Response, next: NextFunction) {
  logger.info(`\n🏹 ${request.method} ${request.url}`)

  next()
}

export default loggerMiddleware
