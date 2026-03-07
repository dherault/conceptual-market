import express, { type Request, type Response, Router } from 'express'

import type { ApiResponsePayload } from '~types'

import internalAuthenticationMiddleware from '~middleware/internalAuthentication'

function createOracleRoutes() {
  const router = Router()

  /* ---
    RUN ORACLE
  --- */

  router.post(
    '/run',
    internalAuthenticationMiddleware,
    express.json(),
    async (_request: Request, response: Response<ApiResponsePayload>) => {
      response.json({ status: 'success' })
    },
  )

  return router
}

export default createOracleRoutes
