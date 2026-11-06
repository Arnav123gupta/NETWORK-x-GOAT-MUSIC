import { Router } from 'express'

export const commandsRouter = Router()

// These are the planned command names, not active WhatsApp handlers.
// Incoming-message dispatch is not implemented by the current Cloud API adapter.
commandsRouter.get('/', (_request, response) => response.json({
  commands: [
    { name: '.menu', description: 'Show the command menu', available: false },
    { name: '.ping', description: 'Check bot response time', available: false },
    { name: '.help', description: 'Show command help', available: false },
    { name: '.status', description: 'Show verified service status', available: false },
    { name: '.song', description: 'Search the authorized music catalog', available: false },
    { name: '.play', description: 'Open an authorized track or preview', available: false },
  ],
  source: 'planned-command-catalog',
  message: 'Commands are listed for reference only. WhatsApp message handling is not enabled yet.'
}))
