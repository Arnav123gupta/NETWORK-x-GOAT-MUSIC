import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(8787),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_PATH: z.string().default('./data/music-bot.sqlite'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  API_KEY: z.string().min(16).optional(),
  WHATSAPP_SESSION_DIR: z.string().default('./data/whatsapp-sessions'),
  WHATSAPP_ACCESS_TOKEN: z.string().min(20).optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
  WHATSAPP_GRAPH_API_VERSION: z.string().default('v22.0'),
  WHATSAPP_WEBHOOK_VERIFY_TOKEN: z.string().min(16).optional(),
  WHATSAPP_APP_SECRET: z.string().min(16).optional(),
  MUSIC_PROVIDER_URL: z.string().url().optional(),
})

export const config = envSchema.superRefine((value, context) => {
  if (value.NODE_ENV === 'production' && !value.API_KEY) context.addIssue({ code: z.ZodIssueCode.custom, path: ['API_KEY'], message: 'API_KEY is required in production.' })
}).parse(process.env)
