import { NextResponse } from 'next/server'
import { backendConfigured, backendErrorStatus, backendFetch } from '@/lib/api'
export async function GET() {
  if (!backendConfigured()) return NextResponse.json({ commands: [], source: 'unconfigured' }, { status: 503 })
  try { return NextResponse.json(await backendFetch('/commands')) }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Backend unavailable' }, { status: backendErrorStatus(error) }) }
}
