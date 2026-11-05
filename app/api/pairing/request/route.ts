import { NextResponse } from 'next/server'
import { backendConfigured, backendFetch, type PairingRequest, type PairingRequestResponse } from '@/lib/api'

export async function POST(request: Request) {
  if (!backendConfigured()) return NextResponse.json({ error: 'Music backend is not configured.', code: 'BACKEND_NOT_CONFIGURED' }, { status: 503 })
  try {
    const body = await request.json() as PairingRequest
    if (!/^\+?[0-9]{8,15}$/.test(body.phoneNumber) || !body.serverId) return NextResponse.json({ error: 'Provide a valid international phone number and server.' }, { status: 400 })
    return NextResponse.json(await backendFetch<PairingRequestResponse>('/pairing/request', { method: 'POST', body: JSON.stringify(body) }))
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to create pairing request.' }, { status: 503 }) }
}
