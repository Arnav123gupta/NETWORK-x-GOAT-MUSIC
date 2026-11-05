import { config } from '../config.js'
import type { MusicProvider } from './providers.js'

export type MusicSearchResult = { query: string; results: Array<{ title: string; artist: string; duration: string; url?: string }>; source: 'configured-provider' | 'unconfigured' }

class HttpMusicProvider implements MusicProvider {
  constructor(private readonly baseUrl: string) {}

  async search(query: string) {
    const response = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`, { signal: AbortSignal.timeout(8000) })
    if (!response.ok) throw new Error(`Music provider returned HTTP ${response.status}.`)
    const payload = await response.json() as { results?: Array<{ title: string; artist: string; duration: string; url?: string }> }
    return payload.results ?? []
  }

  async health() {
    try {
      const response = await fetch(`${this.baseUrl}/health`, { signal: AbortSignal.timeout(3000) })
      return { status: response.ok ? 'online' as const : 'offline' as const, provider: this.baseUrl }
    } catch {
      return { status: 'offline' as const, provider: this.baseUrl, message: 'Provider health check failed.' }
    }
  }
}

export const musicProvider: MusicProvider | undefined = config.MUSIC_PROVIDER_URL ? new HttpMusicProvider(config.MUSIC_PROVIDER_URL) : undefined
export function configuredProvider() { return Boolean(musicProvider) }
export async function musicHealth() { return musicProvider ? musicProvider.health() : { status: 'offline' as const, provider: 'none', message: 'No licensed music provider is configured.' } }

export async function searchMusic(query: string): Promise<MusicSearchResult> {
  if (!musicProvider) throw new Error('Music search is unavailable until a licensed provider is configured.')
  return { query, results: await musicProvider.search(query), source: 'configured-provider' }
}
