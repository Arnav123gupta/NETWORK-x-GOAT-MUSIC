import { NextResponse } from 'next/server'
import { backendConfigured, backendErrorStatus, backendFetch } from '@/lib/api'
export async function GET() {
  if (!backendConfigured()) return NextResponse.json({ error: 'Music backend is not configured.' }, { status: 503 })
  try { return NextResponse.json(await backendFetch('/dashboard/stats')) }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Backend unavailable' }, { status: backendErrorStatus(error) }) }
}
