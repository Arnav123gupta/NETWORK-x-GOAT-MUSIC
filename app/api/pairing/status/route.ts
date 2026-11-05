import { NextResponse } from 'next/server'
import { backendConfigured, backendFetch, type PairingStatusResponse } from '@/lib/api'

export async function GET(request: Request) {
  if (!backendConfigured()) return NextResponse.json({ error: 'Music backend is not configured.', code: 'BACKEND_NOT_CONFIGURED' }, { status: 503 })
  const requestId = new URL(request.url).searchParams.get('requestId')
  if (!requestId) return NextResponse.json({ error: 'requestId is required.' }, { status: 400 })
  try { return NextResponse.json(await backendFetch<PairingStatusResponse>(`/pairing/status?requestId=${encodeURIComponent(requestId)}`)) } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to read pairing status.' }, { status: 503 }) }
}
