import express from 'express'
import cors from 'cors'
import pino from 'pino'
import { config } from './config.js'
import { errorHandler } from './middleware/errorHandler.js'
import { requireApiKey } from './middleware/auth.js'
import { healthRouter } from './routes/health.js'
import { serversRouter } from './routes/servers.js'
import { pairingRouter } from './routes/pairing.js'
import { commandsRouter } from './routes/commands.js'
import { dashboardRouter } from './routes/dashboard.js'
import { musicRouter } from './routes/music.js'
import { botRouter } from './routes/bot.js'
import { whatsappService } from './services/whatsapp.js'
import { rateLimit } from './middleware/rateLimit.js'

export const logger = pino({ level: config.NODE_ENV === 'development' ? 'debug' : 'info', redact: ['req.headers.authorization', 'req.headers.x-api-key', 'phoneNumber'] })
export const app = express()
app.disable('x-powered-by')
app.use(cors({ origin: config.CORS_ORIGIN.split(',').map((value) => value.trim()), credentials: false, methods: ['GET', 'POST'], allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'] }))
app.use(rateLimit)
app.use(express.json({ limit: '32kb', strict: true }))
app.use('/api/health', healthRouter)
app.use('/api/servers', requireApiKey, serversRouter)
app.use('/api/pairing', requireApiKey, pairingRouter)
app.use('/api/commands', requireApiKey, commandsRouter)
app.use('/api/dashboard', requireApiKey, dashboardRouter)
app.use('/api/music', requireApiKey, musicRouter)
app.use('/api/bot', requireApiKey, botRouter)
app.use(errorHandler)

const server = app.listen(config.PORT, config.HOST, async () => {
  await whatsappService.initialize()
  logger.info({ port: config.PORT, host: config.HOST }, 'Music bot backend listening')
})

const shutdown = async (signal: string) => {
  logger.info({ signal }, 'Shutting down')
  await whatsappService.shutdown()
  server.close(() => process.exit(0))
}
process.once('SIGINT', () => void shutdown('SIGINT'))
process.once('SIGTERM', () => void shutdown('SIGTERM'))
