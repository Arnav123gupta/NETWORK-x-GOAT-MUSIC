import type { ErrorRequestHandler } from 'express'
import pino from 'pino'
import { ZodError } from 'zod'

const logger = pino({ name: 'error-handler' })
export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ZodError) return response.status(400).json({ error: 'Invalid request', code: 'VALIDATION_ERROR', details: error.flatten() })
  logger.error({ name: error instanceof Error ? error.name : 'unknown', message: error instanceof Error ? error.message : 'unknown' }, 'Unhandled request error')
  response.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' })
}
