import crypto from 'node:crypto'
import { Router } from 'express'
import { config } from '../config.js'
import { whatsappService } from '../services/whatsapp.js'

export const whatsappWebhookRouter = Router()
whatsappWebhookRouter.get('/', (request, response) => {
  const mode = request.query['hub.mode']
  const token = request.query['hub.verify_token']
  const challenge = request.query['hub.challenge']
  if (mode === 'subscribe' && token === config.WHATSAPP_WEBHOOK_VERIFY_TOKEN && typeof challenge === 'string') return response.status(200).send(challenge)
  return response.sendStatus(403)
})
whatsappWebhookRouter.post('/', (request, response) => {
  const signature = request.header('x-hub-signature-256')
  if (!config.WHATSAPP_APP_SECRET || !signature || !Buffer.isBuffer(request.body)) return response.sendStatus(401)
  const expected = `sha256=${crypto.createHmac('sha256', config.WHATSAPP_APP_SECRET).update(request.body).digest('hex')}`
  const provided = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  if (provided.length !== expectedBuffer.length || !crypto.timingSafeEqual(provided, expectedBuffer)) return response.sendStatus(401)
  try { void whatsappService.handleWebhook(JSON.parse(request.body.toString('utf8'))) } catch { return response.sendStatus(400) }
  return response.sendStatus(200)
})
