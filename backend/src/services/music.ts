export type MusicSearchResult = { query: string; results: Array<{ title: string; artist: string; duration: string; url?: string }>; source: 'configured-provider' | 'unconfigured' }

export async function searchMusic(query: string): Promise<MusicSearchResult> {
  return { query, results: [], source: 'unconfigured' }
}
