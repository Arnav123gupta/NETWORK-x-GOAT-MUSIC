import { NextResponse } from 'next/server'
import { backendConfigured, backendFetch } from '@/lib/api'

export async function POST(request: Request) {
  if (!backendConfigured()) return NextResponse.json({ error: 'Music backend is not configured.' }, { status: 503 })
  try { return NextResponse.json(await backendFetch('/music/search', { method: 'POST', body: JSON.stringify(await request.json()) })) } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Backend unavailable' }, { status: 503 }) }
}
