import { Router } from 'express'
import { z } from 'zod'
import { configuredProvider, musicHealth, searchMusic } from '../services/music.js'

const searchSchema = z.object({ query: z.string().trim().min(1).max(200) }).or(z.object({ q: z.string().trim().min(1).max(200) }))
export const musicRouter = Router()
musicRouter.get('/health', async (_request, response, next) => {
  try { response.json({ ...(await musicHealth()), providerConfigured: configuredProvider() }) } catch (error) { next(error) }
})

musicRouter.get('/status', async (_request, response, next) => {
  try { response.json({ ...(await musicHealth()), providerConfigured: configuredProvider() }) } catch (error) { next(error) }
})
musicRouter.post('/search', async (request, response, next) => {
  try {
    const input = searchSchema.parse(request.body)
    response.json(await searchMusic('query' in input ? input.query : input.q))
  } catch (error) { next(error) }
})
