import { NextResponse } from 'next/server'
import { backendConfigured, backendErrorStatus, backendFetch } from '@/lib/api'
export async function GET() {
  if (!backendConfigured()) return NextResponse.json({ status: 'unconfigured', service: 'whatsapp', checkedAt: new Date().toISOString() }, { status: 503 })
  try { return NextResponse.json(await backendFetch('/bot/status')) }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Backend unavailable' }, { status: backendErrorStatus(error) }) }
}
