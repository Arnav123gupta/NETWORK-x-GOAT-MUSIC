import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(8787),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_PATH: z.string().default('./data/music-bot.sqlite'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  API_KEY: z.string().optional(),
  WHATSAPP_SESSION_DIR: z.string().default('./data/whatsapp-sessions'),
  MUSIC_PROVIDER_URL: z.string().url().optional(),
})

export const config = envSchema.parse(process.env)
