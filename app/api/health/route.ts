import { NextResponse } from 'next/server'
import { backendConfigured, backendFetch, type HealthResponse } from '@/lib/api'

export async function GET() {
  if (!backendConfigured()) return NextResponse.json<HealthResponse>({ configured: false, status: 'unconfigured', service: 'persistent-music-backend', checkedAt: new Date().toISOString(), message: 'Set MUSIC_BACKEND_API_URL to connect the persistent Node.js backend.' })
  try { return NextResponse.json(await backendFetch<HealthResponse>('/health')) } catch (error) { return NextResponse.json<HealthResponse>({ configured: true, status: 'unavailable', service: 'persistent-music-backend', checkedAt: new Date().toISOString(), message: error instanceof Error ? error.message : 'Backend unavailable.' }, { status: 503 }) }
}
