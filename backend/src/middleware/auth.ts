import { timingSafeEqual } from 'node:crypto'
import type { NextFunction, Request, Response } from 'express'
import { config } from '../config.js'

export function requireApiKey(request: Request, response: Response, next: NextFunction) {
  if (!config.API_KEY) {
    if (config.NODE_ENV === 'production') return response.status(503).json({ error: 'Backend API authentication is not configured.', code: 'AUTH_NOT_CONFIGURED' })
    return next()
  }
  const provided = request.header('authorization')?.replace(/^Bearer\s+/i, '') ?? request.header('x-api-key')
  if (!provided) return response.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' })
  const expectedBuffer = Buffer.from(config.API_KEY)
  const providedBuffer = Buffer.from(provided)
  if (providedBuffer.length !== expectedBuffer.length || !timingSafeEqual(providedBuffer, expectedBuffer)) {
    return response.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' })
  }
  return next()
}
