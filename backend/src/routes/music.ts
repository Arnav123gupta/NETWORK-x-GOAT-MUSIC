import { Router } from 'express'
import { z } from 'zod'
import { configuredProvider, searchMusic } from '../services/music.js'

const searchSchema = z.object({ query: z.string().trim().min(1).max(200) })
export const musicRouter = Router()
musicRouter.get('/health', (_request, response) => {
  response.json({ status: configuredProvider() ? 'online' : 'not_configured', providerConfigured: configuredProvider() })
})
musicRouter.get('/status', (_request, response) => {
  response.json({ status: configuredProvider() ? 'online' : 'not_configured', providerConfigured: configuredProvider() })
})
musicRouter.post('/search', async (request, response, next) => {
  try { response.json(await searchMusic(searchSchema.parse(request.body).query)) } catch (error) { next(error) }
})
