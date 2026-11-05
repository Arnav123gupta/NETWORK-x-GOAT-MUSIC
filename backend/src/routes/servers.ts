import { Router } from 'express'
import { listServers } from '../database/db.js'

export const serversRouter = Router()
serversRouter.get('/', (_request, response) => response.json({ servers: listServers(), source: 'sqlite' }))
