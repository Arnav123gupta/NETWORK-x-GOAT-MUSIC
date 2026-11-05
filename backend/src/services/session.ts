import { whatsappService } from './whatsapp.js'

export function getSessionInfo() {
  return { directoryConfigured: Boolean(whatsappService.getSessionDirectory()), persistence: 'filesystem', note: 'Session credentials are never returned by the API.' }
}
