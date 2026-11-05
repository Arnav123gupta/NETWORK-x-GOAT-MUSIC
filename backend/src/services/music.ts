import { config } from '../config.js'

export type MusicSearchResult = { query: string; results: Array<{ title: string; artist: string; duration: string; url?: string }>; source: 'configured-provider' | 'unconfigured' }

export function configuredProvider() {
  return Boolean(config.MUSIC_PROVIDER_URL)
}

export async function searchMusic(query: string): Promise<MusicSearchResult> {
  return { query, results: [], source: 'unconfigured' }
}
