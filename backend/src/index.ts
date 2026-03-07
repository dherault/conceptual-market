import path from 'node:path'

import 'dotenv/config'
import { APP_URL, DEVELOPMENT_API_PORT, capitalize } from 'conceptual-market-core'
import cors from 'cors'
import { config } from 'dotenv'
import express from 'express'

import type { ApiResponse } from '~types'

import { IS_DEVELOPMENT, IS_PRODUCTION } from '~constants'

import initializeFirebase from '~firebase'

import logger from '~utils/logger'

import createOracleRoutes from '~routes/oracle'

import errorMiddleware from '~middleware/error'
import loggerMiddleware from '~middleware/logger'
import { notFoundMiddleware } from '~middleware/notFound'
import securityMiddleware from '~middleware/security'

// eslint-disable-next-line import/extensions
import packageJson from '../package.json' with { type: 'json' }

if (IS_DEVELOPMENT) {
  config({
    path: path.resolve(import.meta.dirname, '../.env.development'),
    override: true,
    quiet: true,
  })
}

async function serve() {
  await initializeFirebase()

  const app = express()
  const PORT = process.env.PORT || DEVELOPMENT_API_PORT

  app.use(cors({ origin: IS_PRODUCTION ? APP_URL : '*' }))
  app.use(securityMiddleware)
  app.use(loggerMiddleware)

  app.get('/', (_request, response: ApiResponse<{ version: string }>) => {
    response.json({
      status: 'success',
      data: {
        version: packageJson.version,
      },
    })
  })
  app.get('/health', (_request, response) => {
    response.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    })
  })

  app.use('/oracle', createOracleRoutes())

  app.use(errorMiddleware)
  app.use(notFoundMiddleware)

  app.listen(PORT, () => {
    logger.info(`🦄 ${capitalize(process.env.NODE_ENV || 'unknown')} environment`)
    logger.info(`🚀 Running server at http://localhost:${PORT}`)
  })
}

serve()
