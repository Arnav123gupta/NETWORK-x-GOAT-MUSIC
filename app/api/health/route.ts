import { NextResponse } from 'next/server'
import { backendConfigurationError, backendFetch, backendErrorStatus } from '@/lib/api'
export async function GET() {
  const issue = backendConfigurationError()
  if (issue) return NextResponse.json({ configured: false, status: 'unconfigured', service: 'api-backend', checkedAt: new Date().toISOString(), message: issue }, { status: 503 })
  try { return NextResponse.json(await backendFetch('/health')) }
  catch (error) { return NextResponse.json({ configured: true, status: 'unavailable', service: 'api-backend', checkedAt: new Date().toISOString(), message: error instanceof Error ? error.message : 'Backend unavailable.' }, { status: backendErrorStatus(error) }) }
}
