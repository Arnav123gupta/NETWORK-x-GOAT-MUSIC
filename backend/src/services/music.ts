import { config } from '../config.js'
import type { MusicProvider } from './providers.js'

export type MusicSearchResult = {
  query: string
  results: Array<{ title: string; artist: string; duration: string; previewUrl?: string; trackUrl?: string }>
  source: 'configured-provider' | 'public-catalog-fallback'
}

class HttpMusicProvider implements MusicProvider {
  constructor(private readonly baseUrl: string) {}

  async search(query: string) {
    const isItunes = this.baseUrl.includes('itunes.apple.com')
    const url = isItunes ? `${this.baseUrl}/search?media=music&limit=25&term=${encodeURIComponent(query)}` : `${this.baseUrl}/search?q=${encodeURIComponent(query)}`
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      throw new Error(`Music provider returned HTTP ${response.status}${detail ? `: ${detail.slice(0, 160)}` : '.'}`)
    }
    const payload = await response.json() as { results?: Array<{ title?: string; artist?: string; duration?: string; url?: string; trackUrl?: string; previewUrl?: string; trackName?: string; artistName?: string; trackTimeMillis?: number; trackViewUrl?: string }> }
    return (payload.results ?? []).map((item) => ({
      title: item.title ?? item.trackName ?? 'Unknown track',
      artist: item.artist ?? item.artistName ?? 'Unknown artist',
      duration: item.duration ?? (item.trackTimeMillis ? `${Math.round(item.trackTimeMillis / 60000)} min` : '—'),
      previewUrl: item.previewUrl,
      trackUrl: item.trackUrl ?? item.trackViewUrl ?? item.url,
    }))
  }

  async health() {
    const isItunes = this.baseUrl.includes('itunes.apple.com')
    const healthUrl = isItunes ? `${this.baseUrl}/search?media=music&limit=1&term=healthcheck` : `${this.baseUrl}/health`
    try {
      const response = await fetch(healthUrl, { signal: AbortSignal.timeout(4000) })
      return {
        status: response.ok ? 'online' as const : 'offline' as const,
        provider: isItunes ? 'Apple iTunes public catalog (preview links only)' : this.baseUrl,
        ...(!response.ok ? { message: `Provider health check returned HTTP ${response.status}.` } : {})
      }
    } catch {
      return { status: 'offline' as const, provider: isItunes ? 'Apple iTunes public catalog' : this.baseUrl, message: 'Provider health check failed.' }
    }
  }
}

export const musicProvider: MusicProvider = new HttpMusicProvider(config.MUSIC_PROVIDER_URL ?? 'https://itunes.apple.com')
export function configuredProvider() { return Boolean(config.MUSIC_PROVIDER_URL) }
export async function musicHealth() { return musicProvider.health() }

export async function searchMusic(query: string): Promise<MusicSearchResult> {
  const results = await musicProvider.search(query)
  return { query, results, source: configuredProvider() ? 'configured-provider' : 'public-catalog-fallback' }
}
