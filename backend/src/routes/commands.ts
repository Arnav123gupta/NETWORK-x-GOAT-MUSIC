import { Router } from 'express'

export const commandsRouter = Router()
commandsRouter.get('/', (_request, response) => response.json({ commands: [
  { name: 'play', description: 'Play a track or search result' },
  { name: 'pause', description: 'Pause the current track' },
  { name: 'skip', description: 'Skip to the next track' },
  { name: 'queue', description: 'Show the current queue' },
  { name: 'help', description: 'Show available commands' },
], source: 'backend' }))
