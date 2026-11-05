import { NextResponse } from 'next/server'
import { backendConfigured, backendFetch } from '@/lib/api'

export async function GET() {
  if (!backendConfigured()) return NextResponse.json({ status: 'not_configured', message: 'Music Service Not Configured' }, { status: 503 })
  try {
    return NextResponse.json(await backendFetch('/api/music/status'))
  } catch {
    return NextResponse.json({ status: 'offline', message: 'Music Backend Offline' }, { status: 503 })
  }
}
