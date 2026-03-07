import { LoggingWinston } from '@google-cloud/logging-winston'
import winston, { type Logger } from 'winston'

import { IS_DEVELOPMENT, IS_LOCAL, IS_PRODUCTION } from '~constants'

const transports: Logger['transports'] = []

if (IS_PRODUCTION) {
  transports.push(new LoggingWinston())
}

if (IS_DEVELOPMENT || IS_LOCAL) {
  transports.length = 0 // IS_LOCAL and be used in conjunction with IS_PRODUCTION, for example during production migrations
  transports.push(
    new winston.transports.Console({
      format: winston.format.printf(info => info.message as string),
    }),
  )
}

const logger = winston.createLogger({
  level: 'info',
  transports,
})

export default logger
