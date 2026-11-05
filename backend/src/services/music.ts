import { config } from '../config.js'
import type { MusicProvider } from './providers.js'

export type MusicSearchResult = { query: string; results: Array<{ title: string; artist: string; duration: string; url?: string }>; source: 'configured-provider' | 'unconfigured' }

class HttpMusicProvider implements MusicProvider {
  constructor(private readonly baseUrl: string) {}

  async search(query: string) {
    const isItunes = this.baseUrl.includes('itunes.apple.com')
    const url = isItunes ? `${this.baseUrl}/search?media=music&limit=25&term=${encodeURIComponent(query)}` : `${this.baseUrl}/search?q=${encodeURIComponent(query)}`
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!response.ok) throw new Error(`Music provider returned HTTP ${response.status}.`)
    const payload = await response.json() as { results?: Array<{ title?: string; artist?: string; duration?: string; url?: string; trackName?: string; artistName?: string; trackTimeMillis?: number; previewUrl?: string }> }
    return (payload.results ?? []).map((item) => ({
      title: item.title ?? item.trackName ?? 'Unknown track',
      artist: item.artist ?? item.artistName ?? 'Unknown artist',
      duration: item.duration ?? (item.trackTimeMillis ? `${Math.round(item.trackTimeMillis / 60000)} min` : '—'),
      url: item.url ?? item.previewUrl,
    }))
  }

  async health() {
    if (this.baseUrl.includes('itunes.apple.com')) return { status: 'online' as const, provider: 'Apple iTunes Search API' }
    try {
      const response = await fetch(`${this.baseUrl}/health`, { signal: AbortSignal.timeout(3000) })
      return { status: response.ok ? 'online' as const : 'offline' as const, provider: this.baseUrl }
    } catch {
      return { status: 'offline' as const, provider: this.baseUrl, message: 'Provider health check failed.' }
    }
  }
}

export const musicProvider: MusicProvider = new HttpMusicProvider(config.MUSIC_PROVIDER_URL ?? 'https://itunes.apple.com')
export function configuredProvider() { return true }
export async function musicHealth() { return musicProvider.health() }

export async function searchMusic(query: string): Promise<MusicSearchResult> {
  if (!musicProvider) throw new Error('Music search is unavailable until a licensed provider is configured.')
  return { query, results: await musicProvider.search(query), source: 'configured-provider' }
}
