import { NextResponse } from 'next/server'
import { backendConfigured, backendFetch } from '@/lib/api'
import type { PairingStatusResponse } from '@/lib/types'

export async function GET(_request: Request, { params }: { params: Promise<{ requestId: string }> }) {
  if (!backendConfigured()) return NextResponse.json({ error: 'Music backend is not configured.', code: 'BACKEND_NOT_CONFIGURED' }, { status: 503 })
  const { requestId } = await params
  try {
    return NextResponse.json(await backendFetch<PairingStatusResponse>(`/pairing/status/${encodeURIComponent(requestId)}`))
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to read pairing status.' }, { status: 503 })
  }
}
