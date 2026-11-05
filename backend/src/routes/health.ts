import { Router } from 'express'
import { whatsappService } from '../services/whatsapp.js'

export const healthRouter = Router()
healthRouter.get('/', (_request, response) => response.json({ status: 'ok', service: 'network-x-goat-music-backend', bot: whatsappService.getStatus(), checkedAt: new Date().toISOString() }))
