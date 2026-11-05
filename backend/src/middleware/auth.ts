import type { NextFunction, Request, Response } from 'express'
import { config } from '../config.js'

export function requireApiKey(request: Request, response: Response, next: NextFunction) {
  if (!config.API_KEY) return next()
  const provided = request.header('authorization')?.replace(/^Bearer\s+/i, '') ?? request.header('x-api-key')
  if (provided !== config.API_KEY) return response.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' })
  next()
}
