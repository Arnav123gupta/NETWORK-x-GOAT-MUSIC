import { NextResponse } from 'next/server'
import { backendConfigured, backendErrorStatus, backendFetch } from '@/lib/api'
export async function GET() {
  if (!backendConfigured()) return NextResponse.json({ status: 'not_configured', message: 'Backend is not configured.' }, { status: 503 })
  try { return NextResponse.json(await backendFetch('/music/health')) }
  catch (error) { return NextResponse.json({ status: 'offline', message: error instanceof Error ? error.message : 'Music provider health unavailable.' }, { status: backendErrorStatus(error) }) }
}
