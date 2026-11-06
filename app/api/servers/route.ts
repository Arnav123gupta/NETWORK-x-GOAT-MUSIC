import { NextResponse } from 'next/server'
import { backendConfigured, backendErrorStatus, backendFetch, type ServersResponse } from '@/lib/api'
export async function GET() {
  if (!backendConfigured()) return NextResponse.json({ error: 'Music backend is not configured.', code: 'BACKEND_NOT_CONFIGURED' }, { status: 503 })
  try { return NextResponse.json(await backendFetch<ServersResponse>('/servers')) }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Backend unavailable.' }, { status: backendErrorStatus(error) }) }
}
