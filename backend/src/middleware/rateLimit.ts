import type { NextFunction, Request, Response } from 'express'

const windows = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 60_000
const MAX_REQUESTS = 120

export function rateLimit(request: Request, response: Response, next: NextFunction) {
  const key = request.ip ?? 'unknown'
  const now = Date.now()
  const current = windows.get(key)
  if (!current || current.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return next()
  }
  current.count += 1
  if (current.count > MAX_REQUESTS) return response.status(429).json({ error: 'Too many requests', code: 'RATE_LIMITED' })
  next()
}
