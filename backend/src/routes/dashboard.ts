import { Router } from 'express'
import { listServers } from '../database/db.js'
import { getSessionInfo } from '../services/session.js'
import { whatsappService } from '../services/whatsapp.js'

export const dashboardRouter = Router()
dashboardRouter.get('/stats', (_request, response) => {
  const servers = listServers()
  response.json({ bot: whatsappService.getStatus(), servers: { total: servers.length, online: servers.filter((server) => server.status === 'online').length }, sessions: getSessionInfo(), generatedAt: new Date().toISOString() })
})
