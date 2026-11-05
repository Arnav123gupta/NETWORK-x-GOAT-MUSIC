import { Router } from 'express'
import { whatsappService } from '../services/whatsapp.js'

export const botRouter = Router()
botRouter.get('/status', (_request, response) => response.json(whatsappService.getStatus()))
