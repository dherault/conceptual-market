import type { NextFunction, Request, Response } from 'express'

function securityMiddleware(_request: Request, response: Response, next: NextFunction) {
  response.setHeader('X-Content-Type-Options', 'nosniff')
  response.setHeader('X-Frame-Options', 'DENY')
  response.setHeader('X-XSS-Protection', '1; mode=block')
  response.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  next()
}

export default securityMiddleware
