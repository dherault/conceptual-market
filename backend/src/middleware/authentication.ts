import { ERROR_CODE_UNAUTHORIZED, ERROR_CODE_USER_NOT_FOUND } from 'conceptual-market-core'
import type { NextFunction, Request } from 'express'
import firebase from 'firebase-admin'

import type { ApiResponse } from '~types'

import logger from '~utils/logger'

import readUser from '~database/readUser'

async function authenticationMiddleware<T>(request: Request, response: ApiResponse<T>, next: NextFunction) {
  const authenticationHeader = request.header('Authorization')

  if (!authenticationHeader?.startsWith('Bearer ')) {
    logger.error('❌ Authentication: No token provided')

    response.status(401).json({
      status: 'error',
      code: ERROR_CODE_UNAUTHORIZED,
      message: 'No token provided',
    })

    return
  }

  let decodedTokenUserId: string

  try {
    const idToken = authenticationHeader.split(' ')[1]
    const decodedToken = await firebase.auth().verifyIdToken(idToken)

    decodedTokenUserId = decodedToken.uid
  }
  catch (error) {
    logger.error('❌ Authentication: Cannot verify token')
    logger.error(error)

    response.status(401).json({
      status: 'error',
      code: ERROR_CODE_UNAUTHORIZED,
      message: 'Invalid token',
    })

    return
  }

  const user = await readUser(decodedTokenUserId!)

  if (!user) {
    logger.error('❌ Authentication: User not found')

    response.status(404).json({
      status: 'error',
      code: ERROR_CODE_USER_NOT_FOUND,
      message: 'User not found',
    })

    return
  }

  request.user = user

  logger.info(`🧑 ${request.user.email}`)

  next()
}

export default authenticationMiddleware
