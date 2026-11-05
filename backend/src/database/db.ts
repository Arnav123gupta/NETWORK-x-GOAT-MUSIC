import Database from 'better-sqlite3'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { config } from '../config.js'
import type { PairingRequestRecord, ServerRecord } from '../types/index.js'

mkdirSync(dirname(config.DATABASE_PATH), { recursive: true })
export const db = new Database(config.DATABASE_PATH)
db.pragma('journal_mode = WAL')
db.exec(`
  CREATE TABLE IF NOT EXISTS servers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    region TEXT NOT NULL,
    load INTEGER,
    status TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS pairing_requests (
    request_id TEXT PRIMARY KEY,
    phone_number TEXT NOT NULL,
    server_id TEXT NOT NULL,
    status TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`)

const serverSeeds: ServerRecord[] = Array.from({ length: 10 }, (_, index) => ({
  id: `server-${index + 1}`,
  name: `NXG Node ${String(index + 1).padStart(2, '0')}`,
  region: ['us-east', 'eu-west', 'ap-south', 'ap-southeast'][index % 4],
  load: null,
  status: 'offline',
}))
const insertServer = db.prepare('INSERT OR IGNORE INTO servers (id, name, region, load, status, updated_at) VALUES (?, ?, ?, ?, ?, ?)')
const seedServers = db.transaction(() => serverSeeds.forEach((server) => insertServer.run(server.id, server.name, server.region, server.load, server.status, new Date().toISOString())))
seedServers()

export function listServers(): ServerRecord[] {
  return db.prepare('SELECT id, name, region, load, status FROM servers ORDER BY id').all() as ServerRecord[]
}

export function savePairingRequest(request: PairingRequestRecord) {
  db.prepare(`INSERT INTO pairing_requests (request_id, phone_number, server_id, status, message, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(request_id) DO UPDATE SET status = excluded.status, message = excluded.message, updated_at = excluded.updated_at`)
    .run(request.requestId, request.phoneNumber, request.serverId, request.status, request.message, request.createdAt, request.updatedAt)
}

export function getPairingRequest(requestId: string): PairingRequestRecord | undefined {
  const row = db.prepare(`SELECT request_id as requestId, phone_number as phoneNumber, server_id as serverId, status, message, created_at as createdAt, updated_at as updatedAt FROM pairing_requests WHERE request_id = ?`).get(requestId) as PairingRequestRecord | undefined
  return row
}
